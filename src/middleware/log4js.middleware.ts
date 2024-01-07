import { Context } from 'koa'
import logger from '~/common/utils/log4j'
export default async (ctx: Context, next: Function) => {
	const start = new Date().getTime()
	try {
		await next()
	} finally {
		const ms = new Date().getTime() - start
		let tipColorms = ''
		if (ms > 0 && ms < 50) {
			tipColorms = `\u001b[37;42m`
		} else if (ms >= 50 && ms < 150) {
			tipColorms = `\u001b[37;43m`
		} else if (ms >= 150) {
			tipColorms = `\u001b[37;41m`
		}
		let tipSatus = '\u001b[32m'
		if (ctx.status > 299 && ctx.status < 399) {
			tipSatus = '\u001b[33m'
		} else if (ctx.status >= 399 && ctx.status < 499) {
			tipSatus = '\u001b[35m'
		} else if (ctx.status >= 499) {
			tipSatus = '\u001b[31m'
		}
		logger.debug(
			`\u001b[34m[${ctx.request.method.toUpperCase()}]\u001b[0m: \u001b[33m${ctx.request.url}\u001b[0m - \u001b[36mPARAMS:${JSON.stringify(
				ctx.request.query || ctx.request.body
			)} - ${tipColorms}${ms}ms\u001b[0m - ${tipSatus}${ctx.status}\u001b[0m`
		)

		logger.record(
			`[${ctx.request.method.toUpperCase()}]: ${ctx.request.url} - PARAMS:${JSON.stringify(
				ctx.request.query || ctx.request.body
			)} - ${ms}ms - ${ctx.status}`
		)
	}
}
