import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import { Context } from 'koa'
import { Controller, GetMapping, Query } from '~/common/decorator/decorator'
import Result from '~/common/result'

@Controller('/user')
export default class UserController {
	@GetMapping('/login')
	async login(@Query('id') id: string) {
		console.log(1)
	}
}
