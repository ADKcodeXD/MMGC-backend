import logger from '~/common/utils/log4j'
import { Context } from 'koa'
import { controllers, params } from './decorator'
import ContainerInstance from '../utils/container'

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
			try {
				const res = await item.handler.call(ContainerInstance.get(Reflect.getMetadata('cus:id', item.constructor)), ...args, ctx)
				ctx.body = res
			} catch (error: any) {
				console.log(error)
			}
		})
	})
	app.use(router.routes()).use(router.allowedMethods()) // 路由装箱
}
