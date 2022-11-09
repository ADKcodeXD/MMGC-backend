import { Context } from 'koa'

type RequestParamType = 'body' | 'query' | 'param'
export const Validtor = (paramType: RequestParamType, validateRef: any) => {
	return async (ctx: Context, next: Function) => {
		if (paramType === 'body') {
			if (validateRef(ctx.request.body)) {
				await next()
			} else {
				throw new Error(`${validateRef.errors[0].instancePath} ${validateRef.errors[0].message}`)
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
