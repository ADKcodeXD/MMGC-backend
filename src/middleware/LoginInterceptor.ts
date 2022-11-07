import { Context } from 'koa'

const NOT_ALLOW_PAGE = ['/upload', '/activity/saveActivity', '/activity/updateActivity']

export const LoginInterceptor = async (ctx: Context, next: Function) => {
	console.log(1)
}
