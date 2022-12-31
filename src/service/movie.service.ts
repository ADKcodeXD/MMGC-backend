import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import { Singleton } from '~/common/decorator/decorator'
import { Movie } from '~/model'
import BaseService from './base.service'
import IncrementService from './increment.service'
import { MovieModel, MovieParams } from 'Movie'
import { MovieModelEntity } from '~/entity/movie.entity'
import { copyProperties } from '~/common/utils'
import Result from '~/common/result'

@Singleton()
export default class MovieService extends BaseService {
	movieModel = Movie
	incrementService = IncrementService.getInstance()
	static getInstance() {
		console.log('dont have Singleton')
		return new this()
	}

	async save(movieParams: MovieParams, memberId: number) {
		const model = new MovieModelEntity()
		copyProperties(movieParams, model)
		model.movieId = await this.incrementService.incrementId('movies')
		model.uploader = memberId
		model.createTime = Date.now()
		const res = await new Movie(model).save()
		if (res) {
			return Result.success(RESULT_CODE.SUCCESS, RESULT_MSG.SUCCESS, res)
		} else {
			return Result.fail(RESULT_CODE.VERIFY_ERROR, RESULT_MSG.VERIFY_ERROR, null)
		}
	}

	copyToVo(movieModel: MovieModel) {
		return movieModel
	}
}
