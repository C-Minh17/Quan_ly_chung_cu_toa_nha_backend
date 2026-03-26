import admin from './admin'
import user from './user'
import userAuthRouter from './user/auth.router'
import userProfileRouter from './user/profile.route'

function route(app) {
    app.use('/admin', admin)
    app.use('/user', user)
    app.use('/auth', userAuthRouter)
    app.use('/user', userProfileRouter)
}

export default route
