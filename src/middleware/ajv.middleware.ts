import { RESULT_CODE } from '~/types/enum'
import { Context } from 'koa'
import Result from '~/common/result'

type RequestParamType = 'body' | 'query' | 'param'
export const Validtor = (paramType: RequestParamType, validateRef: any) => {
	return async (ctx: Context, next: Function) => {
		if (paramType === 'body') {
			if (validateRef(ctx.request.body)) {
				await next()
			} else {
				if (process.env.MODE === 'dev') {
					throw new Error(`${validateRef.errors[0].instancePath} ${validateRef.errors[0].message}`)
				} else {
					ctx.body = Result.fail(RESULT_CODE.PARAMS_ERROR, `${validateRef.errors[0].instancePath} ${validateRef.errors[0].message}`, null)
				}
			}
		} else {
			if (validateRef(ctx[paramType])) {
				await next()
			} else {
				throw new Error(`${validateRef.errors[0].instancePath} ${validateRef.errors[0].message}`)
			}
		}
	}
}
