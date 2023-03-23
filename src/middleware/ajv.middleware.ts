import { RESULT_CODE } from '~/types/enum'
import { Context } from 'koa'
import Result from '~/common/result'
import log4j from '~/common/utils/log4j'

type RequestParamType = 'body' | 'query' | 'param'
export const Validtor = (paramType: RequestParamType, validateRef: any) => {
	return async (ctx: Context, next: Function) => {
		if (paramType === 'body') {
			if (validateRef(ctx.request.body)) {
				await next()
			} else {
				log4j.debug(`${validateRef.errors[0].instancePath} ${validateRef.errors[0].message}`)
				if (process.env.MODE === 'dev') {
					ctx.body = Result.fail(RESULT_CODE.PARAMS_ERROR, `${validateRef.errors[0].instancePath} ${validateRef.errors[0].message}`, null)
					throw new Error(`${validateRef.errors[0].instancePath} ${validateRef.errors[0].message}`)
				} else {
					ctx.body = Result.paramsError()
					throw new Error(`${validateRef.errors[0].instancePath} ${validateRef.errors[0].message}`)
				}
			}
		} else {
			if (validateRef(ctx[paramType])) {
				await next()
			} else {
				log4j.error(`${validateRef.errors[0].instancePath} ${validateRef.errors[0].message}`)
				throw new Error(`${validateRef.errors[0].instancePath} ${validateRef.errors[0].message}`)
			}
		}
	}
}
