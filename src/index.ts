import Koa from 'koa'
import config from './config/config.default'
import router from './router/router'
import initRoutes from './common/decorator/index'
import koabody from './middleware/koabody.middleware'
import mongoware from './middleware/mongoose.middleware'
import { Error, ErrorHandle } from './middleware/koajsonerror.middleware'
import jwt from './middleware/jwt.middleware'
import auth from './middleware/auth.middleware'
import log4js from './middleware/log4js.middleware'
import user from './middleware/user.middleware'
import logger from './common/utils/log4j'
import cors from 'koa2-cors'

const app = new Koa()

app.proxy = true

app.use(koabody).use(mongoware).use(jwt).use(auth).use(Error).use(ErrorHandle).use(log4js).use(cors()).use(user)

initRoutes(app, router)

app.listen(config.APP_PORT)

logger.debug(`Your server is running on \u001b[44m${config.HOST_NAME}:${config.APP_PORT}\u001b[0m`)
logger.debug(`Click to view  \u001b[44mhttp://${config.HOST_NAME}:${config.APP_PORT}${config.MMGC_PREFIX}\u001b[0m`)
