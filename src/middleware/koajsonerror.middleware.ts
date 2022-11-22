import { Context } from 'koa'
import KoaError from 'koa-json-error'
import Result from '~/common/result'

/**
 * 处理抛出的异常和错误 假设在开发环境下全盘抛出 如果在生产环境下则动态判断是否为全中文提示，如是，则抛出message
 */
export const Error = KoaError({
	format: (err: any) => {
		const reg = /^[\u4e00-\u9fa5][^%&',;=?$\x22]+$/
		const message = process.env.NODE_ENV === 'dev' ? err.message : reg.test(err.message) ? err.message : '服务器内部错误！'
		return Result.fail(err.status, message, process.env.NODE_ENV === 'dev' ? err.stack : null)
	}
})

export const ErrorHandle = async (ctx: Context, next: Function) => {
	try {
		await next()
	} catch (error: any) {
		ctx.throw(error)
	}
}
