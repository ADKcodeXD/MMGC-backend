import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import { Body, Controller, PostMapping, User } from '~/common/decorator/decorator'
import { MovieParams } from 'Movie'
import { MemberVo } from 'Member'
import Result from '~/common/result'
import MovieService from '~/service/movie.service'
import { Validtor } from '~/middleware/ajv.middleware'
import { movieParamsValidate } from '~/common/validate/validate'

@Controller('/movie')
export default class MovieController {
	static singletonInstance: MovieController = new MovieController()
	static getInstance() {
		if (!MovieController.singletonInstance) {
			MovieController.singletonInstance = new this()
		}
		return MovieController.singletonInstance
	}

	movieService = MovieService.getInstance()

	@PostMapping('/save', [Validtor('body', movieParamsValidate)])
	async save(@Body() movieParams: MovieParams, @User() userInfo: MemberVo) {
		if (!userInfo || !userInfo.memberId) {
			return Result.fail(RESULT_CODE.USER_NOTFOUND, RESULT_MSG.USER_NOTFOUND, null)
		}
		return this.movieService.save(movieParams, userInfo.memberId)
	}
}
