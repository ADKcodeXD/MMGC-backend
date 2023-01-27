import { Context } from 'koa'

const NOT_ALLOW_PAGE = ['/upload', '/activity/saveActivity', '/activity/updateActivity']

export default async (ctx: Context, next: Function) => {
	console.log(ctx)
	await next()
}
