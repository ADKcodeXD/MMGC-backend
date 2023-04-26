import { IpUtils } from '~/common/utils/ipUtils'
import { Autowired, Service } from '~/common/decorator/decorator'
import Result from '~/common/result'
import { Oper } from '~/model'
import BaseService from './base.service'
import IncrementService from './increment.service'
import MovieService from './movie.service'
import { OperTypeEntity } from '~/entity/global'
import ActivityService from './activity.service'

@Service(true)
export default class OperService extends BaseService {
	operModel = Oper

	@Autowired()
	incrementService!: IncrementService

	@Autowired('MovieService')
	movieService!: MovieService

	@Autowired('ActivityService')
	activityService!: ActivityService

	pollMap = new Map()

	async addLikeOperRecord(movieId: number, ip: string) {
		const movieVo = await this.movieService.getMovieDetail(movieId, false)
		if (!movieVo) {
			return Result.dataNotFound()
		}
		const model = new OperTypeEntity()
		model.operType = 'like'
		model.movieId = movieId
		model.ip = ip
		model.operId = await this.incrementService.incrementId('opers', { model: this.operModel, key: 'operId' })
		model.createTime = Date.now()
		await this.operModel.create(model)
		return Result.success(null)
	}

	async deleteLikeOperRecord(movieId: number, ip: string) {
		const movieVo = await this.movieService.findMovieModel(movieId)
		if (!movieVo) {
			return Result.dataNotFound()
		}
		const res = await this.operModel.findOneAndDelete({ movieId: movieId, ip: ip, operType: 'like' })
		if (res) {
			return Result.success(null)
		}
		return Result.dataNotFound()
	}

	async addPollOerRecord(movieId: number, ip: string) {
		if (this.pollMap.get(ip)) {
			return Result.cantPollVideo()
		}
		this.pollMap.set(ip, ip)

		const movieVo = await this.movieService.findMovieModel(movieId)
		if (!movieVo || !ip) {
			this.pollMap.delete(ip)
			return Result.dataNotFound()
		}
		if (!movieVo.activityId || !movieVo.day) {
			this.pollMap.delete(ip)
			return Result.cantPollVideo()
		}
		const activityVo = await this.activityService.findActivityVoByActivityId(movieVo.activityId, false)

		if (activityVo && new Date(activityVo && (activityVo.endTime as any)).getTime() < new Date().getTime()) {
			this.pollMap.delete(ip)
			return Result.cantPollVideoLimit()
		}
		const target = await this.operModel.countDocuments({
			ip: ip,
			operType: 'poll',
			day: movieVo.day,
			activityId: movieVo.activityId
		})
		if (target && target >= 2) {
			this.pollMap.delete(movieId + ip)
			return Result.cantPollVideo()
		}
		const model = new OperTypeEntity()
		model.operType = 'poll'
		model.movieId = movieId
		model.ip = ip
		model.operId = await this.incrementService.incrementId('opers', { model: this.operModel, key: 'operId' })
		model.createTime = Date.now()
		model.day = movieVo.day
		model.activityId = movieVo.activityId
		await this.operModel.create(model)
		this.pollMap.delete(ip)
		return Result.success(null)
	}

	async findLikeCoundByMovieId(movieId: number) {
		const movieVo = await this.movieService.findMovieModel(movieId)
		if (!movieVo) {
			return 0
		}
		const count = await this.operModel.countDocuments({ movieId: movieId, operType: 'like' })
		return count
	}

	async findPollCountByMovieId(movieId: number) {
		const movieVo = await this.movieService.findMovieModel(movieId)
		if (!movieVo) {
			return 0
		}
		const count = await this.operModel.countDocuments({ movieId: movieId, operType: 'poll' })
		return count
	}

	async canMoviePoll(movieId: number, ip: string) {
		const movieVo = await this.movieService.findMovieModel(movieId)
		if (!movieVo) {
			return false
		}
		if (!movieId || !ip) {
			return false
		}
		const target = await this.operModel.findOne({
			movieId: movieId,
			ip: ip,
			operType: 'poll'
		})
		if (target) {
			return false
		}
		const list = await this.operModel.countDocuments({
			ip: ip,
			operType: 'poll',
			activityId: movieVo.activityId,
			day: movieVo.day
		})
		if (list >= 2) {
			return false
		}
		return true
	}

	async canMovieLike(movieId: number, ip: string) {
		if (!movieId || !ip) {
			return false
		}
		const target = await this.operModel.findOne({
			movieId: movieId,
			ip: ip,
			operType: 'like'
		})

		if (target) {
			return false
		}
		return true
	}

	copyToVo(model: OperTypeEntity) {
		return model
	}
}
