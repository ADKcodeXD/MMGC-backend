import config from '~/config/config.default'
import Jwt from 'koa-jwt'
import { verifyToken } from '~/common/utils/jwtutil'

const whiteList = ['/email', '/user/register', '/user/login'].map(
	item => new RegExp(`^${config.MMGC_PREFIX}${item}`.split('/').join('\\/'))
)

export default Jwt({
	secret: config.JWT_SECRET || 'jwt-secret'
}).unless({
	path: whiteList
})
