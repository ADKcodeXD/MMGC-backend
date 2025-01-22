import { Context } from 'koa'
import { REQUEST_METHOD } from '~/types/enum'
import 'reflect-metadata'
import Container from '~/common/utils/container'
interface ConstructableFunction extends Function {
	new (): any
}

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
		Reflect.defineMetadata('prefix', path, target)
		Service(true)(target)
	}
}

/**
 * ### Service IOC控制反转
 * 用于服务类上的注解 可以将类注入到容器中
 * #### 使用方法
 * @example
 * \@Service('user') // 注册一个user的服务
 * export default class UserService {
 * 	// ...
 * }
 * // OR
 * \@Service(true) // 注册为单例的Service
 * export default class UserService {
 * 	// ...
 * }
 * // OR
 * |@Service('memberService',trues) // 注册为单例的Service 且容器名为memberService
 * export default class UserService {
 * 	// ...
 * }
 * @param id 标识符
 * @param singleton boolean 是否单例
 */
export function Service(id: string): Function
export function Service(isSingleTon: boolean): Function
export function Service(id: string, isSingleTon: boolean): Function
export function Service(idOrSingleton?: string | boolean, isSingleTon?: boolean): Function {
	return (target: ConstructableFunction) => {
		let _id: string // 自定义标识符 或者是类名
		let _isSingleTon: boolean // 是否单例
		let _singleInstance: any // 单例实例

		if (typeof idOrSingleton === 'boolean') {
			_isSingleTon = true
			_id = target.name
		} else {
			// 判断如果设置 id，id 是否唯一
			const customServiceName = idOrSingleton as string
			if (customServiceName && Container.has(customServiceName)) {
				throw new Error(`Service:此标识符(${customServiceName})已被注册.`)
			}
			_id = customServiceName || target.name
			_isSingleTon = isSingleTon || false
		}
		Reflect.defineMetadata('cus:id', _id, target)
		if (_isSingleTon) {
			_singleInstance = new target()
		}
		Container.set(_id, _singleInstance || target)
	}
}

/**
 * 用于属性上的注解 自动注入依赖的实例
 * @param id 自定义注入的标识符
 * @returns
 */
export function Autowired(id?: string): PropertyDecorator {
	return (target: Object, propertyKey: string | symbol) => {
		Reflect.defineProperty(target, propertyKey, {
			get: () => {
				const dependency = Reflect.getMetadata('design:type', target, propertyKey)
				const _id = id || Reflect.getMetadata('cus:id', dependency)
				return Container.get(_id)
			}
		})
	}
}

/**
 * 用于单例模式 使得该类拥有getInstance方法
 * @returns
 */
export const Singleton = () => {
	return Service(true)
}

/**
 * 用于方法上的注解
 * TODO:改写成元编程的形式 不使用当前的直接执行
 * @param param0 ControllerRouter 对象
 * @returns
 */
export const RequestMapping = ({ url = '', method = '', middleware = [] as Array<any> }) => {
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

export const GetMapping = (url = '', middleware: any[] = []) => {
	return RequestMapping({ url: url, method: REQUEST_METHOD.GET, middleware: middleware })
}

export const PostMapping = (url = '', middleware: any[] = []) => {
	return RequestMapping({ url: url, method: REQUEST_METHOD.POST, middleware: middleware })
}

export const PutMapping = (url = '', middleware: any[] = []) => {
	return RequestMapping({ url: url, method: REQUEST_METHOD.PUT, middleware: middleware })
}

export const DeleteMapping = (url = '', middleware: any[] = []) => {
	return RequestMapping({ url: url, method: REQUEST_METHOD.DELETE, middleware: middleware })
}

export const PatchMapping = (url = '', middleware: any[] = []) => {
	return RequestMapping({ url: url, method: REQUEST_METHOD.PATCH, middleware: middleware })
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

export const QueryAll = () => {
	return Inject((ctx: Context) => ctx.query)
}

export const ParamAll = () => {
	return Inject((ctx: Context) => ctx.params)
}

export const User = () => {
	return Inject((ctx: Context) => ctx.state.user)
}

export const Headers = (arg: string) => {
	return Inject((ctx: Context) => ctx.headers[arg])
}

export const Ip = () => {
	return Inject((ctx: Context) => ctx.ip)
}
