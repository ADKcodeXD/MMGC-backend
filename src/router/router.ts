import KoaRouter from 'koa-router'
import config from '../config/config.default'

const router = new KoaRouter()

router.prefix(config.MMGC_PREFIX || '/')

export default router
