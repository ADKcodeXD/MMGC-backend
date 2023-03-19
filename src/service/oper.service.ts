import { Singleton } from '~/common/decorator/decorator'
import Result from '~/common/result'
import { Oper } from '~/model'
import BaseService from './base.service'
import IncrementService from './increment.service'
import MovieService from './movie.service'
import { OperTypeEntity } from '~/entity/global'

@Singleton()
export default class OperService extends BaseService {
	operModel = Oper
	incrementService = IncrementService.getInstance()

	static singleton: OperService = new OperService()
	static getInstance() {
		console.log('dont have Singleton')
		return new this()
	}

	async addLikeOperRecord(movieId: number, memberId: number) {
		const movieVo = await MovieService.getInstance().getMovieDetail(movieId, false)
		if (!movieVo) {
			return Result.dataNotFound()
		}
		const model = new OperTypeEntity()
		model.operType = 'like'
		model.movieId = movieId
		model.memberId = memberId
		model.operId = await this.incrementService.incrementId('opers', { model: this.operModel, key: 'operId' })
		model.createTime = Date.now()
		await this.operModel.create(model)
		return Result.success(null)
	}

	async deleteLikeOperRecord(movieId: number, memberId: number) {
		const movieVo = await MovieService.getInstance().findMovieModel(movieId)
		if (!movieVo) {
			return Result.dataNotFound()
		}
		const res = await this.operModel.findOneAndDelete({ movieId: movieId, memberId: memberId, operType: 'like' })
		if (res) {
			return Result.success(null)
		}
		return Result.dataNotFound()
	}

	async addPollOerRecord(movieId: number, memberId: number) {
		const movieVo = await MovieService.getInstance().findMovieModel(movieId)
		if (!movieVo) {
			return Result.dataNotFound()
		}
		if (!movieVo.activityId || !movieVo.day) {
			return Result.cantPollVideo()
		}
		const target = await this.operModel.find({
			movieId: movieId,
			memberId: memberId,
			operType: 'poll',
			day: movieVo.day,
			activityId: movieVo.activityId
		})
		if (target) {
			return Result.cantPollVideo()
		}
		const model = new OperTypeEntity()
		model.operType = 'poll'
		model.movieId = movieId
		model.memberId = memberId
		model.operId = await this.incrementService.incrementId('opers', { model: this.operModel, key: 'operId' })
		model.createTime = Date.now()
		model.day = movieVo.day
		model.activityId = movieVo.activityId
		await this.operModel.create(model)
		return Result.success(null)
	}

	async findLikeCoundByMovieId(movieId: number) {
		const movieVo = await MovieService.getInstance().getMovieDetail(movieId, false)
		if (!movieVo) {
			return 0
		}
		const count = await this.operModel.countDocuments({ movieId: movieId, operType: 'like' })
		return count
	}

	async findPollCountByMovieId(movieId: number) {
		const movieVo = await MovieService.getInstance().getMovieDetail(movieId, false)
		if (!movieVo) {
			return 0
		}
		const count = await this.operModel.countDocuments({ movieId: movieId, operType: 'poll' })
		return count
	}

	async canMoviePoll(movieId: number, memberId: number) {
		const movieVo = await MovieService.getInstance().findMovieModel(movieId)
		if (!movieVo) {
			return false
		}
		if (!movieId || memberId) {
			return false
		}
		const target = await this.operModel.findOne({
			movieId: movieId,
			memberId: memberId,
			operType: 'poll'
		})
		if (target) {
			return false
		}
		const list = await this.operModel.find({
			activityId: movieVo.activityId,
			day: movieVo.day
		})
		if (list) {
			return false
		}
		return true
	}

	async canMovieLike(movieId: number, memberId: number) {
		if (!movieId || memberId) {
			return false
		}
		const target = await this.operModel.findOne({
			movieId: movieId,
			memberId: memberId,
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