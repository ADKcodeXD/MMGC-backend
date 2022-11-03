import { controllers } from './decorator'

export * from '~/controller/index'

export default (app: any, router: any) => {
	controllers.forEach((item: any) => {
		const prefix = item.constructor.prefix
		let url = item.url
		if (prefix) url = `${prefix}${url}` // 组合真正链接
		router[item.method](url, ...item.middleware, item.handler) // 创建路由
	})
	app.use(router.routes()).use(router.allowedMethods()) // 路由装箱
}
