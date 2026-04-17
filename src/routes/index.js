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

function route(app) {
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
}


export default route
