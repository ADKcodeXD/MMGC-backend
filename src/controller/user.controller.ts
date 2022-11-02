import { RESULT_CODE, RESULT_MSG } from '../types/enum'
import { Context } from 'koa'
import { REQUEST_METHOD } from '../types/enum'
import { Controller, RequestMapping } from '../common/decorator/decorator'
import Result from '../vo/result'

@Controller('/user')
export default class UserController {
	@RequestMapping({ url: '/login', method: REQUEST_METHOD.POST })
	async login(ctx: Context) {
		const postData = ctx.request.body
		const res = {
			...postData
		}
		ctx.body = Result.success(RESULT_CODE.SUCCESS, RESULT_MSG.SUCCESS, res)
	}
}
