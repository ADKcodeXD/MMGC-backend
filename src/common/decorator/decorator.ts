import { REQUEST_METHOD } from '~/types/enum'

export const controllers: Array<ControllerRouter> = []

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
export const RequestMapping = ({ url = '', method = '', middleware = [] }: ControllerRouter) => {
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
			constructor: target.constructor
		}

		controllers.push(item)
	}
}
