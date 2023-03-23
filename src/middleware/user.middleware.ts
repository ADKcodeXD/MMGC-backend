import { Context } from 'koa'
import { verifyToken } from '~/common/utils/jwtutil'
import config from '~/config/config.default'

export default async (ctx: Context, next: Function) => {
	const token = ctx.headers.authorization
	if (!ctx.state.user && token) {
		if (token && token.split(' ')[0] === 'Bearer') {
			const realToken = token.split(' ')[1]
			const user = verifyToken(realToken, config.JWT_SECRET || 'jwt-secret')
			if (user) {
				ctx.state.user = user
			}
		}
	}
	await next()
}
