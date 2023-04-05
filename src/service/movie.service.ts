import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import { Autowired, Service } from '~/common/decorator/decorator'
import { Movie } from '~/model'
import { MovieModel, MovieParams, MovieUpdateParams, MovieVo } from 'Movie'
import { MovieModelEntity, MovieVoEntity } from '~/entity/movie.entity'
import { copyProperties, pageQuery } from '~/common/utils'
import Result from '~/common/result'
import MemberService from './member.service'
import ActivityService from './activity.service'
import OperService from './oper.service'
import BaseService from './base.service'
import IncrementService from './increment.service'
import logger from '~/common/utils/log4j'
import { formatTime } from '~/common/utils/moment'
import { IpUtils } from '~/common/utils/ipUtils'
import CommentService from './comment.service'

@Service(true)
export default class MovieService extends BaseService {
	movieModel = Movie
	map = new Map()
	timmer!: NodeJS.Timeout

	@Autowired()
	incrementService!: IncrementService

	@Autowired()
	memberService!: MemberService

	@Autowired()
	activityService!: ActivityService

	@Autowired('OperService')
	operService!: OperService

	@Autowired('CommentService')
	commentService!: CommentService

	@Autowired()
	ipUtils!: IpUtils

	async save(movieParams: MovieParams, memberId: number) {
		const model = new MovieModelEntity()
		copyProperties(movieParams, model)
		model.movieId = await this.incrementService.incrementId('movies', { model: Movie, key: 'movieId' })
		model.uploader = memberId
		model.createTime = Date.now()

		const res = await new Movie(model).save()
		if (res) {
			return Result.success(res)
		} else {
			return Result.fail(RESULT_CODE.VERIFY_ERROR, RESULT_MSG.VERIFY_ERROR, null)
		}
	}

	async getMovieByActivityId(params: { activityId: number; day?: number }): Promise<PageResult<MovieVo>> {
		const movieList = (await this.movieModel.find({
			activityId: params.activityId,
			day: params.day
		})) as MovieModel[]

		if (movieList) {
			const movieVoList = await this.copyToVoList<MovieModel, MovieVo>(movieList, null, false, false)
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

	async getMovieDetail(movieId: number, isAll?: boolean, memberId?: number) {
		const _filter: any = {
			movieId: movieId
		}
		if (typeof isAll === 'boolean' && !isAll) {
			_filter.expectPlayTime = { $lt: new Date() }
		}

		const model = await this.movieModel.findOne(_filter)
		if (model) {
			return await this.copyToVo(model, memberId, true, true)
		}
		return null
	}

	async findMovieModel(movieId: number) {
		const model = await this.movieModel.findOne({ movieId: movieId })
		if (model) {
			return model
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
			if (movieParams.isPublic === 0) {
				_filter.expectPlayTime = { $gt: new Date() }
			} else if (movieParams.isPublic === 1) {
				_filter.expectPlayTime = { $lt: new Date() }
			}
		}

		if (movieParams.uploader) {
			_filter.uploader = movieParams.uploader
		}

		if (movieParams.activityId) {
			_filter.activityId = movieParams.activityId
		}

		if (movieParams.day) {
			_filter.day = movieParams.day
		}
		const res = await pageQuery(movieParams, this.movieModel, _filter)

		return {
			result: await this.copyToVoList(res.result, null, false),
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

	async updateMovieViewNums(movieId: number, ip: string) {
		const model = await this.movieModel.findOne({ movieId: movieId })
		if (!model) return null
		if (this.map.get(ip)) return null
		this.map.set(
			ip,
			setTimeout(() => {
				this.map.has(ip) && clearTimeout(this.map.get(ip)) // 清除定时器 防止内存泄漏
				this.map.delete(ip)
				logger.debug(`清除定时器 && 删除${ip}记录`)
			}, 1000 * 60)
		)
		await this.movieModel.updateOne({ movieId: model.movieId }, { viewNums: model.viewNums + 1 })
		return null
	}

	async copyToVo(movieModel: MovieModel, memberId?: number, needActivityVo?: boolean, needLink?: boolean) {
		const vo = new MovieVoEntity()
		copyProperties(movieModel, vo)
		if (needActivityVo && movieModel.activityId) {
			vo.activityVo = await this.activityService.findActivityVoByActivityId(movieModel.activityId)
			vo.isActivityMovie = true
		} else {
			vo.activityVo = null
			vo.isActivityMovie = movieModel.activityId ? true : false
		}
		if (
			!needLink &&
			typeof needLink === 'boolean' &&
			movieModel.expectPlayTime &&
			new Date(movieModel.expectPlayTime as any).getTime() > new Date().getTime()
		) {
			vo.moviePlaylink = null
			vo.movieDownloadLink = null
			vo.movieLink = null
		}
		if (movieModel.authorId) vo.author = await this.memberService.findMemberVoByMemberId(movieModel.authorId)
		if (movieModel.expectPlayTime) {
			const time = parseInt(formatTime(movieModel.expectPlayTime, 'x'))
			vo.expectPlayTime = formatTime(movieModel.expectPlayTime)
			if (time > Date.now()) {
				vo.isPublic = false
			} else {
				vo.isPublic = true
			}
		} else {
			vo.isPublic = true
		}

		if (memberId) {
			const canPoll = await this.operService.canMoviePoll(movieModel.movieId, memberId)
			const canLike = await this.operService.canMovieLike(movieModel.movieId, memberId)
			const loginVo: LoginVo = {
				isLike: !canLike,
				isPoll: !canPoll,
				isCollect: false
			}
			vo.loginVo = loginVo
		}

		const likeNums = await this.operService.findLikeCoundByMovieId(movieModel.movieId)
		const pollNums = await this.operService.findPollCountByMovieId(movieModel.movieId)
		const commentNums = await this.commentService.countCommentByMovieId(movieModel.movieId)

		vo.likeNums = likeNums
		vo.pollNums = pollNums
		vo.commentNums = commentNums

		if (vo.realPublishTime) vo.realPublishTime = formatTime(movieModel.realPublishTime)
		vo.uploader = await this.memberService.findMemberVoByMemberId(movieModel.uploader)
		vo.createTime = formatTime(movieModel.createTime)
		return vo
	}
}
