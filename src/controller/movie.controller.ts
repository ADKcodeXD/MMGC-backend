import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import {
	Body,
	Controller,
	DeleteMapping,
	GetMapping,
	Param,
	PostMapping,
	PutMapping,
	Query,
	QueryAll,
	User
} from '~/common/decorator/decorator'
import { MovieParams, MovieUpdateParams } from 'Movie'
import { MemberVo } from 'Member'
import Result from '~/common/result'
import MovieService from '~/service/movie.service'
import { Validtor } from '~/middleware/ajv.middleware'
import { movieParamsValidate, movieUpdateParamsValidate } from '~/common/validate/validate'

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

	@GetMapping('/getMovieByActivityId')
	async getMovieByActivityId(@QueryAll() params: { activityId: number; day?: number }) {
		if (!params.activityId) {
			return Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
		}
		return Result.success(this.movieService.getMovieByActivityId(params))
	}

	@GetMapping('/getMovieDetail')
	async getMovieDetailById(@Query('movieId') movieId: number) {
		if (!movieId) {
			return Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
		}
		const res = await this.movieService.getMovieDetail(movieId)
		return Result.success(res)
	}

	@GetMapping('/getMovieDetailAll')
	async getMovieDetailAll(@Query('movieId') movieId: number) {
		if (!movieId) {
			return Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
		}
		const res = await this.movieService.getMovieDetail(movieId, true)
		return Result.success(res)
	}

	@DeleteMapping('/delete/:movieId')
	async deleteMovie(@Param('movieId') movieId: number) {
		if (!movieId) {
			return Result.paramsError()
		}
		this.movieService.deleteMovie(movieId)
		return Result.success(null)
	}

	@GetMapping('/getAllMovie')
	async getAllMovie(@QueryAll() moviePageParams: MoviePageParams) {
		const res = await this.movieService.getMovieList(moviePageParams)
		return Result.success(res)
	}

	@PutMapping('/updateMovie', [Validtor('body', movieUpdateParamsValidate)])
	async updateMovie(@Body() movieParams: MovieUpdateParams) {
		const res = await this.movieService.updateMovie(movieParams)
		if (res) return Result.success(null)
		return Result.dataNotFound()
	}
}
