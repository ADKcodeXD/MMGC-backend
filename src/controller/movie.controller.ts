import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import { Body, Controller, GetMapping, PostMapping, Query } from '~/common/decorator/decorator'
import Result from '~/common/result'
import { MovieParams } from 'Movie'

@Controller('/movie')
export default class MovieController {
	static singletonInstance: MovieController = new MovieController()
	static getInstance() {
		if (!MovieController.singletonInstance) {
			MovieController.singletonInstance = new this()
		}
		return MovieController.singletonInstance
	}

	@PostMapping('/save')
	async save(@Body() movieParams: MovieParams) {
		return Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
	}

	@PostMapping('/verify')
	async verifyCode(@Body() body: { email: string; code: number }) {
		return Result.success(RESULT_CODE.SUCCESS, RESULT_MSG.SUCCESS, null)
	}
}
