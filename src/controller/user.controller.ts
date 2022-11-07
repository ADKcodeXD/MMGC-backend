import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import { Context } from 'koa'
import { Controller, Ctx, GetMapping, Query } from '~/common/decorator/decorator'
import Result from '~/vo/result'

@Controller('/user')
export default class UserController {
	@GetMapping('/login')
	async login(@Ctx() ctx: Context, @Query('id') id: string) {
		console.log(id)
		const res = {
			username: '你好',
			password: '谢谢',
			id: id
		}
		ctx.body = Result.success(RESULT_CODE.SUCCESS, RESULT_MSG.SUCCESS, res)
	}
}
