import { Context } from 'koa'
import KoaError from 'koa-json-error'
import Result from '~/common/result'
import logger from '~/common/utils/log4j'

/**
 * 处理抛出的异常和错误 假设在开发环境下全盘抛出 如果在生产环境下则动态判断是否为全中文提示，如是，则抛出message
 */
export const Error = KoaError({
	format: (err: any) => {
		const reg = /^[\u4e00-\u9fa5][^%&',;=?$\x22]+$/
		logger.error(err.message)
		logger.error(err.stack)
		const message = process.env.NODE_ENV === 'dev' ? err.message : reg.test(err.message) ? err.message : '服务器内部错误！'
		return Result.fail(err.status, message, process.env.NODE_ENV === 'dev' ? err.stack : null)
	}
})

export const ErrorHandle2 = async (ctx: Context, next: any) => {
	try {
		await next() // 尝试执行后续中间件
	} catch (err: any) {
		const reg = /^[\u4e00-\u9fa5][^%&',;=?$\x22]+$/
		logger.error(`${err.message} : ${err.stack}`)
		if (err.message === 'invalid signature') {
			err.statusCode = 401
		}
		const message = process.env.NODE_ENV === 'dev' ? err.message : reg.test(err.message) ? err.message : '服务器内部错误！'
		ctx.status = err.statusCode || err.status || 500 // 如果错误对象中有状态码则使用它，否则默认为 500
		ctx.body = Result.fail(err.statusCode || err.status || 500, message, process.env.NODE_ENV === 'dev' ? err.stack : null)
	}
}
