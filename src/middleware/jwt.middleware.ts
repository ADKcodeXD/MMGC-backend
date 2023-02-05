import config from '~/config/config.default'
import Jwt from 'koa-jwt'

const whiteList = [
	'/email',
	'/user/register',
	'/user/login',
	'/config/getConfig',
	'/activity/getActivityList',
	'/activity/getActivityDetail',
	'/activity/getDays'
].map(item => new RegExp(`^${config.MMGC_PREFIX}${item}`.split('/').join('\\/')))

export default Jwt({
	secret: config.JWT_SECRET || 'jwt-secret'
}).unless({
	path: whiteList
})
