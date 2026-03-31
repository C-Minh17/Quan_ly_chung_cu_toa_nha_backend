import admin from './admin'
import user from './user'
import userAuthRouter from './user/auth.router'
import userProfileRouter from './user/profile.route'
import buildingRouter from './building.router'
import floorRouter from './floor.router'
import apartmentRouter from './apartments.router'

function route(app) {
    app.use('/admin', admin)
    app.use('/user', userProfileRouter)
    app.use('/user', user)
    app.use('/auth', userAuthRouter)
    app.use('/buildings', buildingRouter)
    app.use('/floors', floorRouter)
    app.use('/apartments', apartmentRouter)
}


export default route
