import Koa from 'koa'
import config from './config/config.default'
import router from './router/router'
import initRoutes from './common/decorator/index'
import koabody from './middleware/KoaBody'
import BodyParser from 'koa-bodyparser'

const app = new Koa()

app.use(koabody)

app.use(BodyParser())

initRoutes(app, router)

app.listen(config.APP_PORT)

console.log(`your server is running on ${config.HOST_NAME}:${config.APP_PORT}`)
console.log(`click to view  http://${config.HOST_NAME}:${config.APP_PORT}${config.MMGC_PREFIX}`)
