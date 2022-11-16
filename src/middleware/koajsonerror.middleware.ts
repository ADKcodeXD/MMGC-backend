import { Context } from 'koa'
import KoaError from 'koa-json-error'
import Result from '~/common/result'

export const Error = KoaError({
	format: (err: any) => {
		return Result.fail(err.status, err.message, err.stack)
	}
})

export const ErrorHandle = async (ctx: Context, next: Function) => {
	try {
		await next()
	} catch (error: any) {
		ctx.throw(error)
	}
}
