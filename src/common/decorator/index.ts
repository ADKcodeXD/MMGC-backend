import { Context } from 'koa'
import { controllers, params } from './decorator'

export * from '~/controller/index'

export default (app: any, router: any) => {
	controllers.forEach((item: ControllerRouter) => {
		const prefix = item.constructor.prefix

		let url = item.url

		if (prefix) url = `${prefix}${url}` // 组合真正链接

		router[item.method](url, ...item.middleware, async (ctx: Context) => {
			const args = params
				.filter(i => i.name === item.name)
				.sort((a, b) => a.index - b.index)
				.map(i => i.fn(ctx))
			await item.handler(...args, ctx)
		})
	})
	app.use(router.routes()).use(router.allowedMethods()) // 路由装箱
}
