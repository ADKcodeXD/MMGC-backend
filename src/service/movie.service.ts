import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import { Singleton } from '~/common/decorator/decorator'
import { Movie } from '~/model'
import BaseService from './base.service'
import IncrementService from './increment.service'
import { MovieModel, MovieParams, MovieUpdateParams, MovieVo } from 'Movie'
import { MovieModelEntity, MovieVoEntity } from '~/entity/movie.entity'
import { copyProperties, pageQuery } from '~/common/utils'
import Result from '~/common/result'
import MemberService from './member.service'
import ActivityService from './activity.service'
import { formatTime } from '~/common/utils/moment'

@Singleton()
export default class MovieService extends BaseService {
	movieModel = Movie
	incrementService = IncrementService.getInstance()
	memberService = MemberService.getInstance()
	activityService = ActivityService.getInstance()
	static getInstance() {
		console.log('dont have Singleton')
		return new this()
	}

	async save(movieParams: MovieParams, memberId: number) {
		const model = new MovieModelEntity()
		copyProperties(movieParams, model)
		model.movieId = await this.incrementService.incrementId('movies', { model: Movie, key: 'movieId' })
		model.uploader = memberId
		model.createTime = Date.now()

		const res = await new Movie(model).save()
		if (res) {
			return Result.success(RESULT_CODE.SUCCESS, RESULT_MSG.SUCCESS, res)
		} else {
			return Result.fail(RESULT_CODE.VERIFY_ERROR, RESULT_MSG.VERIFY_ERROR, null)
		}
	}

	async getMovieByActivityId(params: { activityId: number; day?: number }): Promise<PageResult<MovieVo>> {
		const movieList = (await this.movieModel.find({
			activityId: params.activityId,
			day: params.day,
			expectPlayTime: { $lt: Date.now() }
		})) as MovieModel[]
		if (movieList) {
			const movieVoList = await this.copyToVoList<MovieModel, MovieVo>(movieList, false)
			return {
				result: movieVoList,
				total: movieList.length,
				page: 1
			}
		}
		return {
			result: [],
			total: 0,
			page: 1
		}
	}

	async getMovieDetail(movieId: number, isAll?: boolean) {
		const _filter: any = {
			movieId: movieId
		}
		if (!isAll) {
			_filter.expectPlayTime = { $lt: new Date() }
		}

		const model = await this.movieModel.findOne(_filter)
		if (model) {
			return this.copyToVo(model)
		}
		return null
	}

	async deleteMovie(movieId: number) {
		await this.movieModel.deleteOne({ movieId: movieId })
		return null
	}

	async getMovieList(movieParams: MoviePageParams) {
		let _filter: any = {}
		if (movieParams.keyword) {
			const reg = new RegExp(movieParams.keyword, 'i')
			_filter = {
				$or: [
					// 多字段同时匹配
					{ 'movieName.cn': { $regex: reg } },
					{ 'movieName.en': { $regex: reg } },
					{ 'movieName.jp': { $regex: reg } },
					{ authorName: { $regex: reg } },
					{ 'movieDesc.cn': { $regex: reg } },
					{ 'movieDesc.en': { $regex: reg } },
					{ 'movieDesc.jp': { $regex: reg } }
				]
			}
		}

		if (movieParams.isPublic) {
			movieParams.isPublic = parseInt(movieParams.isPublic as any)
			_filter.expectPlayTime = movieParams.isPublic === 0 ? { $gt: new Date() } : { $lt: new Date() }
		}

		if (movieParams.uploader) {
			_filter.uploader = movieParams.uploader
		}

		if (movieParams.activityId) {
			_filter.activityId = movieParams.activityId
		}

		if (movieParams.activityId) {
			_filter.day = movieParams.day
		}

		const res = await pageQuery(movieParams, this.movieModel, _filter)

		return {
			result: await this.copyToVoList(res.result, false),
			page: res.page,
			total: res.total
		}
	}

	async updateMovie(movieParams: MovieUpdateParams) {
		// 保证拥有
		const movie = await this.movieModel.findOne({ movieId: movieParams.movieId })
		if (movie) {
			const flag = await this.movieModel.updateOne({ movieId: movieParams.movieId }, movieParams)
			if (flag) {
				return true
			}
			return false
		}
		return false
	}

	async copyToVo(movieModel: MovieModel, needActivityVo = true) {
		const vo = new MovieVoEntity()
		copyProperties(movieModel, vo)
		if (needActivityVo && movieModel.activityId) {
			vo.activityVo = await this.activityService.findActivityVoByActivityId(movieModel.activityId)
			vo.isActivityMovie = true
		} else {
			vo.activityVo = null
			vo.isActivityMovie = movieModel.activityId ? true : false
		}
		if (movieModel.authorId) vo.author = await this.memberService.findMemberVoByMemberId(movieModel.authorId)
		if (movieModel.expectPlayTime) {
			const time = parseInt(formatTime(movieModel.expectPlayTime, 'x'))
			if (time > Date.now()) {
				vo.isPublic = false
			} else {
				vo.isPublic = true
			}
		} else {
			vo.isPublic = true
		}
		if (vo.realPublishTime) vo.realPublishTime = formatTime(movieModel.realPublishTime)
		vo.uploader = await this.memberService.findMemberVoByMemberId(movieModel.uploader)
		vo.createTime = formatTime(movieModel.createTime)
		return vo
	}
}
