import Koa from 'koa'
import config from './config/config.default'
import router from './router/router'
import initRoutes from './common/decorator/index'
import koabody from './middleware/KoaBody'
import BodyParser from 'koa-bodyparser'
import mongoware from './middleware/Mongoose'
import { Error, ErrorHandle } from '~/middleware/KoaJsonError'

const app = new Koa()

app.use(koabody).use(mongoware).use(BodyParser()).use(Error).use(ErrorHandle)

initRoutes(app, router)

app.listen(config.APP_PORT)

console.log(`your server is running on ${config.HOST_NAME}:${config.APP_PORT}`)
console.log(`click to view  http://${config.HOST_NAME}:${config.APP_PORT}${config.MMGC_PREFIX}`)
