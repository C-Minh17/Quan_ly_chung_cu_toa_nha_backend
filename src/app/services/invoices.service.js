import { Apartment, FeeTypes, UtilityReading, Invoices, InvoiceDetails , Resident } from '@/models'
import { abort } from '@/utils/helpers'
import mongoose from 'mongoose'

export const generateMonthlyInvoices = async ({ billing_month, billing_year }) => {
    if (!billing_month || !billing_year) {
        abort(400, 'billing_month and billing_year are required')
    }

    // Lấy danh sách tất cả apartment có hợp đồng đang active
    // Kiểm tra contract_status = 'active' để xác định apartment có hợp đồng hiệu lực
    const apartments = await Apartment.find({ contract_status: 'active' })

    const results = {
        total_processed: apartments.length,
        success: 0,
        failed: 0,
        skipped: 0,
        errors: []
    }

    // Lấy tất cả fee_types đang is_active = true
    const activeFeeTypes = await FeeTypes.find({ is_active: true })

    for (const apartment of apartments) {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            // Kiểm tra hóa đơn tháng này đã tồn tại chưa
            const existingInvoice = await Invoices.findOne({
                apartment_id: apartment._id,
                billing_month,
                billing_year
            }).session(session)

            if (existingInvoice) {
                results.skipped++
                await session.abortTransaction()
                session.endSession()
                continue
            }

            let totalAmount = 0
            const invoiceDetailsToInsert = []

            // Duyệt qua từng loại phí
            for (const feeType of activeFeeTypes) {
                let quantity = 0
                let amount = 0

                if (['fixed', 'parking'].includes(feeType.fee_category)) {
                    quantity = 1
                    amount = quantity * feeType.unit_price
                } else if (feeType.fee_category === 'metered') {
                    // Truy vấn utility_readings
                    const reading = await UtilityReading.findOne({
                        apartment_id: apartment._id,
                        fee_type_id: feeType._id,
                        reading_month: billing_month,
                        reading_year: billing_year
                    }).session(session)

                    if (!reading || typeof reading.consumption !== 'number') {
                        continue // Bỏ qua nếu chưa có chỉ số
                    }

                    quantity = reading.consumption
                    amount = quantity * feeType.unit_price
                }

                if (quantity > 0) {
                    totalAmount += amount
                    invoiceDetailsToInsert.push({
                        fee_type_id: feeType._id,
                        quantity,
                        unit_price: feeType.unit_price, // Snapshot giá tại thời điểm tạo
                        amount
                    })
                }
            }

            // Nếu không có phí nào cần thu thì bỏ qua
            if (invoiceDetailsToInsert.length === 0) {
                results.skipped++
                await session.abortTransaction()
                session.endSession()
                continue
            }

            // Sinh invoice_code theo format INV-{year}-{month}-APT{apartment_id}
            const invoiceCode = `INV-${billing_year}-${String(billing_month).padStart(2, '0')}-APT${apartment.id || apartment._id}`

            // Tính due_date = ngày 10 tháng kế tiếp
            let dueMonth = billing_month + 1
            let dueYear = billing_year
            if (dueMonth > 12) {
                dueMonth = 1
                dueYear += 1
            }
            const dueDate = new Date(dueYear, dueMonth - 1, 10)

            // Tạo hóa đơn sử dụng new + save() thay vì create() để tương thích với transaction
            const newInvoice = new Invoices({
                apartment_id: apartment._id,
                invoice_code: invoiceCode,
                billing_month,
                billing_year,
                total_amount: totalAmount,
                paid_amount: 0,
                status: 'unpaid',
                due_date: dueDate
            })
            
            await newInvoice.save({ session })

            // Gán invoice_id vào chi tiết và lưu
            const detailsWithInvoiceId = invoiceDetailsToInsert.map(d => ({
                ...d,
                invoice_id: newInvoice._id
            }))

            await InvoiceDetails.insertMany(detailsWithInvoiceId, { session })

            await session.commitTransaction()
            session.endSession()
            results.success++

        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            results.failed++
            results.errors.push({
                apartment_id: apartment._id,
                error: error.message
            })
        }
    }

    return results
}

export const getInvoices = async (query) => {
    const { status, apartment_id, billing_month, billing_year, sort } = query
    const filter = {}
    if (status) filter.status = status
    if (apartment_id) filter.apartment_id = apartment_id
    if (billing_month) filter.billing_month = Number(billing_month)
    if (billing_year) filter.billing_year = Number(billing_year)

    const invoices = await Invoices.find(filter)
        .populate({
            path: 'apartment_id',
            populate: { path: 'floor_id', populate: { path: 'building_id' } }
        })
        .sort(sort || { created_at: -1 })
        .lean()

    // Transform: tách apartment_id (object) thành apartment (object) + apartment_id (ID string)
    const transformedInvoices = invoices.map(invoice => ({
        ...invoice,
        apartment: invoice.apartment_id,  // object đầy đủ
        apartment_id: invoice.apartment_id._id  // chỉ lấy ID
    }))

    return transformedInvoices
}

export const createInvoice = async (data) => {
    const { apartment_id, billing_month, billing_year, details } = data
    if (!apartment_id || !billing_month || !billing_year || !details || details.length === 0) {
        abort(400, 'apartment_id, billing_month, billing_year and details are required')
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const apartment = await Apartment.findById(apartment_id)
        if (!apartment) abort(404, 'Apartment not found')

        const existingInvoice = await Invoices.findOne({ apartment_id, billing_month, billing_year }).session(session)
        if (existingInvoice) {
            abort(400, `Hóa đơn tháng ${billing_month}/${billing_year} cho căn hộ này đã tồn tại`)
        }

        let totalAmount = 0
        const invoiceDetailsToInsert = []

        for (const item of details) {
            const feeType = await FeeTypes.findById(item.fee_type_id)
            if (!feeType) abort(404, `FeeType ${item.fee_type_id} not found`)

            const quantity = Number(item.quantity)
            const amount = quantity * feeType.unit_price

            totalAmount += amount
            invoiceDetailsToInsert.push({
                fee_type_id: feeType._id,
                quantity,
                unit_price: feeType.unit_price,
                amount
            })
        }

        const invoiceCode = `INV-${billing_year}-${billing_month}-APT${apartment.id || apartment._id}-M`
        
        let dueMonth = Number(billing_month) + 1
        let dueYear = Number(billing_year)
        if (dueMonth > 12) {
            dueMonth = 1
            dueYear += 1
        }
        const dueDate = new Date(dueYear, dueMonth - 1, 10)

        const [newInvoice] = await Invoices.create([{
            apartment_id,
            invoice_code: invoiceCode,
            billing_month,
            billing_year,
            total_amount: totalAmount,
            paid_amount: 0,
            status: 'unpaid',
            due_date: dueDate
        }], { session })

        const detailsWithInvoiceId = invoiceDetailsToInsert.map(d => ({
            ...d,
            invoice_id: newInvoice._id
        }))

        await InvoiceDetails.insertMany(detailsWithInvoiceId, { session })

        await session.commitTransaction()
        session.endSession()

        return newInvoice
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

export const getInvoiceById = async (id) => {
    const invoice = await Invoices.findById(id)
        .populate({
            path: 'apartment_id',
            populate: { path: 'floor_id', populate: { path: 'building_id' } }
        })
        .lean()

    if (!invoice) abort(404, 'Invoice not found')

    const details = await InvoiceDetails.find({ invoice_id: invoice._id })
        .populate('fee_type_id')
        .lean()

    // Transform: tách apartment_id (object) thành apartment (object) + apartment_id (ID string)
    const transformedInvoice = {
        ...invoice,
        apartment: invoice.apartment_id,
        apartment_id: invoice.apartment_id._id
    }
    transformedInvoice.details = details
    return transformedInvoice
}

export const deleteInvoice = async (id) => {
    const invoice = await Invoices.findById(id)
    if (!invoice) abort(404, 'Invoice not found')

    if (invoice.status !== 'unpaid') {
        abort(400, 'Chỉ có thể xoá hóa đơn chưa thanh toán (unpaid)')
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await InvoiceDetails.deleteMany({ invoice_id: id }).session(session)
        await Invoices.findByIdAndDelete(id).session(session)

        await session.commitTransaction()
        session.endSession()
        return { message: 'Xóa hóa đơn thành công' }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}


export const getMyInvoices = async (user_id) => {
    const residents = await Resident.find({ user_id }).lean()
    const apartmentIds = residents.map(r => r.apartment_id)

    if (apartmentIds.length === 0) {
        return []
    }

    const invoices = await Invoices.find({ apartment_id: { $in: apartmentIds } })
        .populate({
            path: 'apartment_id',
            populate: { path: 'floor_id', populate: { path: 'building_id' } }
        })
        .sort({ created_at: -1 })
        .lean()

    // Transform: tách apartment_id (object) thành apartment (object) + apartment_id (ID string)
    const transformedInvoices = invoices.map(invoice => ({
        ...invoice,
        apartment: invoice.apartment_id,
        apartment_id: invoice.apartment_id._id
    }))

    return transformedInvoices
}

export const getMyInvoiceById = async (user_id, invoice_id) => {
    const residents = await Resident.find({ user_id }).lean()
    const apartmentIds = residents.map(r => r.apartment_id.toString())

    const invoice = await Invoices.findById(invoice_id)
        .populate({
            path: 'apartment_id',
            populate: { path: 'floor_id', populate: { path: 'building_id' } }
        })
        .lean()
    
    if (!invoice) abort(404, 'Invoice not found')

    if (!apartmentIds.includes(invoice.apartment_id._id.toString())) {
        abort(403, 'Bạn không có quyền xem hóa đơn này')
    }

    const details = await InvoiceDetails.find({ invoice_id: invoice._id }).populate('fee_type_id').lean()
    
    // Transform: tách apartment_id (object) thành apartment (object) + apartment_id (ID string)
    const transformedInvoice = {
        ...invoice,
        apartment: invoice.apartment_id,
        apartment_id: invoice.apartment_id._id
    }
    transformedInvoice.details = details

    return transformedInvoice
}

export const getOverdueInvoices = async () => {
    const today = new Date()
    const invoices = await Invoices.find({
        status: { $in: ['unpaid', 'partial'] },
        due_date: { $lt: today }
    })
        .populate({
            path: 'apartment_id',
            populate: { path: 'floor_id', populate: { path: 'building_id' } }
        })
        .sort({ due_date: 1 })
        .lean()

    // Transform: tách apartment_id (object) thành apartment (object) + apartment_id (ID string)
    const transformedInvoices = invoices.map(invoice => ({
        ...invoice,
        apartment: invoice.apartment_id,
        apartment_id: invoice.apartment_id._id
    }))

    return transformedInvoices
}

export const exportInvoicePDF = async (id) => {
    await getInvoiceById(id)
    // Ở đây hệ thống hiện tại chưa cài đặt thư viện PDF (như puppeteer hoặc pdfkit)
    // Thay vào đó, API này có thể trả về HTML template đã được render bằng ejs
    // Hoặc trả về thông báo lỗi 501
    abort(501, 'Chức năng xuất PDF chưa được cài đặt thư viện hỗ trợ trên server')
}
