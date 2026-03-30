import admin from './admin'
import user from './user'
import userAuthRouter from './user/auth.router'
import userProfileRouter from './user/profile.route'
import buildingRouter from './building.router'

function route(app) {
    app.use('/admin', admin)
    app.use('/user', user)
    app.use('/auth', userAuthRouter)
    app.use('/user', userProfileRouter)
    app.use('/buildings', buildingRouter)
}


export default route
