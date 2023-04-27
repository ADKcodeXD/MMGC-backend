import {
	Autowired,
	Body,
	Controller,
	Ctx,
	DeleteMapping,
	GetMapping,
	Ip,
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
import { Auth } from '~/common/decorator/auth'
import { IpUtils } from '~/common/utils/ipUtils'
import { Context } from 'koa'

@Controller('/movie')
export default class MovieController {
	@Autowired()
	movieService!: MovieService

	@Autowired()
	ipUtils!: IpUtils

	@PostMapping('/save', [Validtor('body', movieParamsValidate)])
	@Auth([ROLE.ADMIN, ROLE.SUBADMIN, ROLE.COMMITTER, ROLE.GROUPMEMBER], '/save')
	async save(@Body() movieParams: MovieParams, @User() userInfo: MemberVo) {
		if (!userInfo || !userInfo.memberId) {
			return Result.noAuth()
		}
		return this.movieService.save(movieParams, userInfo.memberId)
	}

	@GetMapping('/getMovieByActivityId')
	async getMovieByActivityId(@QueryAll() params: any, @Ctx() ctx: Context) {
		if (!params.activityId) {
			return Result.paramsError()
		}
		const ip = this.ipUtils.getIp(ctx)
		params.ip = ip
		return Result.success(await this.movieService.getMovieByActivityId(params))
	}

	@GetMapping('/getMovieDetail')
	async getMovieDetailById(@Query('movieId') movieId: number, @Ctx() ctx: Context) {
		if (!movieId) {
			return Result.paramsError()
		}
		const ip = this.ipUtils.getIp(ctx)
		const res = await this.movieService.getMovieDetail(movieId, false, ip)
		await this.movieService.updateMovieViewNums(movieId, ip)

		return Result.success(res)
	}

	@GetMapping('/getMovieDetailAll')
	@Auth([ROLE.ADMIN, ROLE.SUBADMIN, ROLE.COMMITTER, ROLE.GROUPMEMBER], '/getMovieDetailAll')
	async getMovieDetailAll(@Query('movieId') movieId: number) {
		if (!movieId) {
			return Result.paramsError()
		}
		const res = await this.movieService.getMovieDetail(movieId, true, undefined)
		return Result.success(res)
	}

	@DeleteMapping('/delete/:movieId')
	@Auth([ROLE.ADMIN, ROLE.SUBADMIN, ROLE.COMMITTER, ROLE.GROUPMEMBER], '/delete')
	async deleteMovie(@Param('movieId') movieId: number) {
		if (!movieId) {
			return Result.paramsError()
		}
		this.movieService.deleteMovie(movieId)
		return Result.success(null)
	}

	@GetMapping('/getAllMovie')
	@Auth([ROLE.ADMIN, ROLE.SUBADMIN, ROLE.COMMITTER, ROLE.GROUPMEMBER], '/getAllMovie')
	async getAllMovie(@QueryAll() moviePageParams: MoviePageParams) {
		const res = await this.movieService.getMovieList(moviePageParams)
		return Result.success(res)
	}

	@PutMapping('/updateMovie', [Validtor('body', movieUpdateParamsValidate)])
	@Auth([ROLE.ADMIN, ROLE.SUBADMIN, ROLE.COMMITTER, ROLE.GROUPMEMBER], '/updateMovie')
	async updateMovie(@Body() movieParams: MovieUpdateParams) {
		const res = await this.movieService.updateMovie(movieParams)
		if (res) return Result.success(null)
		return Result.dataNotFound()
	}
}
