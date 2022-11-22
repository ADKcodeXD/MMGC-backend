import Koa from 'koa'
import config from './config/config.default'
import router from './router/router'
import initRoutes from './common/decorator/index'
import koabody from './middleware/koabody.middleware'
import mongoware from './middleware/mongoose.middleware'
import { Error, ErrorHandle } from '~/middleware/koajsonerror.middleware'
import jwt from '~/middleware/jwt.middleware'
import logger from 'koa-logger'

const app = new Koa()

app.use(koabody).use(logger()).use(mongoware).use(Error).use(ErrorHandle).use(jwt)

initRoutes(app, router)

app.listen(config.APP_PORT)

console.log(`your server is running on ${config.HOST_NAME}:${config.APP_PORT}`)
console.log(`click to view  http://${config.HOST_NAME}:${config.APP_PORT}${config.MMGC_PREFIX}`)
