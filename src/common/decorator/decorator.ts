import { Context } from 'koa'
import { REQUEST_METHOD } from '~/types/enum'

export const controllers: Array<ControllerRouter> = []
export const params: Array<ParamsMeta> = []
/**
 * Controller 注解方法 可以解析一个path 直接作用于API上
 * 使用方法:在类上直接使用即可 @Controller('/user')
 * @param path 类请求前缀
 * @returns
 */
export const Controller = (path = '') => {
	return function (target: any) {
		target.prefix = path
	}
}

/**
 * 用于方法上的注解
 * @param param0 ControllerRouter 对象
 * @returns
 */
export const RequestMapping = ({ url = '', method = '', middleware = [] }) => {
	return function (target: any, name: string) {
		let path = ''
		// 判断有没有定义url
		if (!url) {
			path = `/${name}` // 取方法名作为路径
		} else {
			path = url // 自己定义的url
		}

		const item: ControllerRouter = {
			url: path,
			method: method || REQUEST_METHOD.GET,
			middleware: middleware,
			handler: target[name],
			constructor: target.constructor,
			name: name
		}

		controllers.push(item)
	}
}

export const GetMapping = (url = '') => {
	return RequestMapping({ url: url, method: REQUEST_METHOD.GET })
}

export const PostMapping = (url = '') => {
	return RequestMapping({ url: url, method: REQUEST_METHOD.POST })
}

export const PutMapping = (url = '') => {
	return RequestMapping({ url: url, method: REQUEST_METHOD.PUT })
}

export const DeleteMapping = (url = '') => {
	return RequestMapping({ url: url, method: REQUEST_METHOD.DELETE })
}

export const PatchMapping = (url = '') => {
	return RequestMapping({ url: url, method: REQUEST_METHOD.PATCH })
}

/**
 * Inject 装饰器 用于获取请求中的各种参数
 * @param target
 * @param propertyKey
 * @param parameterIndex
 */
export const Inject = (fn: Function) => {
	return function (target: any, propertyKey: string, descriptor: any) {
		params.push({
			name: propertyKey,
			index: descriptor,
			fn: fn
		})
	}
}

export const Param = (arg: string) => {
	return Inject((ctx: Context) => ctx.params[arg])
}

export const Body = () => {
	return Inject((ctx: Context) => ctx.request.body)
}

export const Ctx = () => {
	return Inject((ctx: Context) => ctx)
}

export const Query = (arg: string) => {
	return Inject((ctx: Context) => ctx.query[arg])
}
