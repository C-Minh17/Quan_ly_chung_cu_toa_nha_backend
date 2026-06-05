import admin from './admin'
import user from './user'
import userAuthRouter from './user/auth.router'
import userProfileRouter from './user/profile.route'
import buildingRouter from './building.router'
import floorRouter from './floor.router'
import apartmentRouter from './apartments.router'
import residentRouter from './resident.router'
import contractRouter from './contracts.router'
import fileRouter from './file.router'
import vehicleRouter from './vehicles.router'
import feeTypeRouter from './feeType.router'
import maintenanceRequestsRouter from './maintenancerequests.router'
import maintenanceSchedulesRouter from './maintenance-schedules.router'
import utilityReadingRouter from './utilityReading.router'
import invoicesRouter from './invoices.router'
import paymentsRouter from './payments.router'
import amenitiesRouter from './amenities.router'
import amenityBookingsRouter from './amenity-bookings.router'
import notificationRouter from './notification.router'
import dashboardRouter from './dashboard.router'
import residentDashboardRouter from './residentDashboard.router'

function route(app) {
    const apiPrefix = process.env.API_PREFIX || '/api/v1'
    app.use(`${apiPrefix}/resident/dashboard`, residentDashboardRouter)
    app.use('/resident/dashboard', residentDashboardRouter)

    app.use(`${apiPrefix}/notification`, notificationRouter)
    app.use('/notification', notificationRouter)

    app.use(`${apiPrefix}/dashboard`, dashboardRouter)
    app.use('/dashboard', dashboardRouter)

    app.use(`${apiPrefix}/invoices`, invoicesRouter)
    app.use('/invoices', invoicesRouter)

    app.use(`${apiPrefix}/maintenance-requests`, maintenanceRequestsRouter)
    app.use('/maintenance-requests', maintenanceRequestsRouter)
    app.use('/maintenancerequests', maintenanceRequestsRouter)

    app.use('/admin', admin)
    app.use('/user', userProfileRouter)
    app.use('/user', user)
    app.use('/auth', userAuthRouter)
    app.use('/buildings', buildingRouter)
    app.use('/floors', floorRouter)
    app.use('/apartments', apartmentRouter)
    app.use('/residents', residentRouter)
    app.use('/contracts', contractRouter)
    app.use('/file', fileRouter)
    app.use('/vehicles', vehicleRouter)
    app.use('/feeType', feeTypeRouter)
    app.use('/maintenance-schedules', maintenanceSchedulesRouter)
    app.use('/utilityreading', utilityReadingRouter)
    app.use('/payments', paymentsRouter)
    app.use('/amenities', amenitiesRouter)
    app.use('/amenity-bookings', amenityBookingsRouter)
}


export default route
