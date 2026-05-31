import { Apartment, FeeTypes, UtilityReading, Invoices, InvoiceDetails, Resident, Contract } from '@/models'
import { abort } from '@/utils/helpers'
import mongoose from 'mongoose'

// Helper function: Tách ID và object cho các field liên kết (building_id, floor_id, apartment_id, etc) - xử lý recursive
const flattenRelationships = (obj) => {
    if (!obj || typeof obj !== 'object') return obj

    const result = { ...obj }

    // Xử lý từng relationship field
    const relationshipFields = ['building_id', 'floor_id', 'apartment_id']

    relationshipFields.forEach(field => {
        if (result[field] && typeof result[field] === 'object') {
            const id = result[field]._id
            const objData = result[field]
            result[field] = id  // Thay thế bằng ID
            result[field.replace('_id', '')] = objData  // Tạo field mới với object

            // Xử lý nested objects bên trong (recursive)
            if (result[field.replace('_id', '')]) {
                result[field.replace('_id', '')] = flattenRelationships(result[field.replace('_id', '')])
            }
        }
    })

    return result
}

// Helper function: Tính toán chi tiết các loại phí từ invoice details
const enrichInvoiceWithFeeBreakdown = (invoice, details) => {
    let fixedAmount = 0
    let meteredAmount = 0
    let parkingAmount = 0

    // Duyệt qua từng chi tiết hóa đơn
    details.forEach(detail => {
        const feeType = detail.fee_type_id

        // Nhóm theo fee_category
        if (typeof feeType === 'object') {
            const category = feeType.fee_category
            if (category === 'fixed') {
                fixedAmount += detail.amount
            } else if (category === 'metered') {
                meteredAmount += detail.amount
            } else if (category === 'parking') {
                parkingAmount += detail.amount
            }
        }
    })

    return {
        ...invoice,
        apartment: flattenRelationships(invoice.apartment),  // Flatten building_id, floor_id
        fixed_amount: fixedAmount,
        metered_amount: meteredAmount,
        parking_amount: parkingAmount,
        rental_amount: invoice.rental_amount || 0,  // Lấy từ invoice (đã lưu khi tạo hóa đơn)
        details: details.map(detail => ({
            id: detail._id,
            fee_type_id: typeof detail.fee_type_id === 'object' ? detail.fee_type_id._id : detail.fee_type_id,
            fee_type: typeof detail.fee_type_id === 'object' ? detail.fee_type_id : null,
            quantity: detail.quantity,
            unit_price: detail.unit_price,
            amount: detail.amount
        }))
    }
}

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
            let rentalAmount = 0
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

            // Lấy phí thuê nhà từ hợp đồng đang hoạt động
            try {
                const activeContract = await Contract.findOne({
                    apartment_id: apartment._id,
                    status: 'active',
                    contract_type: 'rent'
                }).session(session)

                if (activeContract && activeContract.monthly_price && activeContract.monthly_price > 0) {
                    rentalAmount = activeContract.monthly_price
                    totalAmount += rentalAmount
                }
            } catch (error) {
                // Log error nhưng không dừng quá trình tạo hóa đơn
                console.error(`Lỗi khi lấy phí thuê nhà cho căn hộ ${apartment._id}:`, error.message)
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
                due_date: dueDate,
                rental_amount: rentalAmount
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
    // và thêm thông tin chi tiết phí
    const transformedInvoices = await Promise.all(invoices.map(async (invoice) => {
        // Skip if apartment_id is null (deleted apartment)
        if (!invoice.apartment_id) {
            return null
        }

        const details = await InvoiceDetails.find({ invoice_id: invoice._id })
            .populate('fee_type_id')
            .lean()

        const transformedInvoice = {
            ...invoice,
            apartment: invoice.apartment_id,  // object đầy đủ
            apartment_id: invoice.apartment_id._id  // chỉ lấy ID
        }

        return enrichInvoiceWithFeeBreakdown(transformedInvoice, details)
    }))

    // Filter out null values (deleted apartments)
    return transformedInvoices.filter(invoice => invoice !== null)
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

        // Lấy tất cả active fee types
        const activeFeeTypes = await FeeTypes.find({ is_active: true })
        const fixedAndParkingFees = activeFeeTypes.filter(ft =>
            ['fixed', 'parking'].includes(ft.fee_category)
        )

        // Merge: details từ client (metered) + tự động thêm fixed/parking
        const clientFeeTypeIds = details.map(d => d.fee_type_id.toString())
        const autoDetails = fixedAndParkingFees
            .filter(ft => !clientFeeTypeIds.includes(ft._id.toString())) // tránh duplicate
            .map(ft => ({
                fee_type_id: ft._id.toString(),
                quantity: 1
            }))

        const allDetails = [...details, ...autoDetails]

        let totalAmount = 0
        let rentalAmount = 0
        const invoiceDetailsToInsert = []

        for (const item of allDetails) {
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

        // Lấy phí thuê nhà từ hợp đồng
        try {
            const activeContract = await Contract.findOne({
                apartment_id,
                status: 'active',
                contract_type: 'rent'
            }).session(session)

            if (activeContract && activeContract.monthly_price && activeContract.monthly_price > 0) {
                rentalAmount = activeContract.monthly_price
                totalAmount += rentalAmount
            }
        } catch (error) {
            console.error(`Lỗi khi lấy phí thuê nhà: ${error.message}`)
        }

        const invoiceCode = `INV-${billing_year}-${billing_month}-APT${apartment.id || apartment._id}-M`

        let dueMonth = Number(billing_month) + 1
        let dueYear = Number(billing_year)
        if (dueMonth > 12) { dueMonth = 1; dueYear += 1 }
        const dueDate = new Date(dueYear, dueMonth - 1, 10)

        const [newInvoice] = await Invoices.create([{
            apartment_id,
            invoice_code: invoiceCode,
            billing_month,
            billing_year,
            total_amount: totalAmount,
            paid_amount: 0,
            status: 'unpaid',
            due_date: dueDate,
            rental_amount: rentalAmount
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
    if (!invoice.apartment_id) abort(404, 'Associated apartment not found')

    const details = await InvoiceDetails.find({ invoice_id: invoice._id })
        .populate('fee_type_id')
        .lean()

    // Transform: tách apartment_id (object) thành apartment (object) + apartment_id (ID string)
    const transformedInvoice = {
        ...invoice,
        apartment: invoice.apartment_id,
        apartment_id: invoice.apartment_id._id
    }

    // Enrich với fee breakdown
    return enrichInvoiceWithFeeBreakdown(transformedInvoice, details)
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
    // và thêm thông tin chi tiết phí
    const transformedInvoices = await Promise.all(invoices.map(async (invoice) => {
        // Skip if apartment_id is null (deleted apartment)
        if (!invoice.apartment_id) {
            return null
        }

        const details = await InvoiceDetails.find({ invoice_id: invoice._id })
            .populate('fee_type_id')
            .lean()

        const transformedInvoice = {
            ...invoice,
            apartment: invoice.apartment_id,
            apartment_id: invoice.apartment_id._id
        }

        return enrichInvoiceWithFeeBreakdown(transformedInvoice, details)
    }))

    // Filter out null values (deleted apartments)
    return transformedInvoices.filter(invoice => invoice !== null)
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
    if (!invoice.apartment_id) abort(404, 'Associated apartment not found')

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

    // Enrich với fee breakdown
    return enrichInvoiceWithFeeBreakdown(transformedInvoice, details)
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
    // và thêm thông tin chi tiết phí
    const transformedInvoices = await Promise.all(invoices.map(async (invoice) => {
        // Skip if apartment_id is null (deleted apartment)
        if (!invoice.apartment_id) {
            return null
        }

        const details = await InvoiceDetails.find({ invoice_id: invoice._id })
            .populate('fee_type_id')
            .lean()

        const transformedInvoice = {
            ...invoice,
            apartment: invoice.apartment_id,
            apartment_id: invoice.apartment_id._id
        }

        return enrichInvoiceWithFeeBreakdown(transformedInvoice, details)
    }))

    // Filter out null values (deleted apartments)
    return transformedInvoices.filter(invoice => invoice !== null)
}

export const exportInvoicePDF = async (id) => {
    await getInvoiceById(id)
    // Ở đây hệ thống hiện tại chưa cài đặt thư viện PDF (như puppeteer hoặc pdfkit)
    // Thay vào đó, API này có thể trả về HTML template đã được render bằng ejs
    // Hoặc trả về thông báo lỗi 501
    abort(501, 'Chức năng xuất PDF chưa được cài đặt thư viện hỗ trợ trên server')
}
