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

const aggreFilter = (filter: any, additionFields?: any[]) => [
  {
    $lookup: {
      from: 'opers',
      localField: 'movieId',
      foreignField: 'movieId',
      as: 'operations'
    }
  },
  {
    $lookup: {
      from: 'members',
      localField: 'authorId',
      foreignField: 'memberId',
      as: 'author'
    }
  },
  {
    $lookup: {
      from: 'members',
      localField: 'uploader',
      foreignField: 'memberId',
      as: 'uploader'
    }
  },
  {
    $lookup: {
      from: 'comments',
      localField: 'movieId',
      foreignField: 'movieId',
      as: 'comments'
    }
  },
  {
    $unwind: {
      path: '$author',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $unwind: {
      path: '$uploader',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $addFields: {
      likeNums: {
        $size: {
          $filter: {
            input: '$operations',
            as: 'operation',
            cond: {
              $eq: ['$$operation.operType', 'like']
            }
          }
        }
      },
      pollNums: {
        $size: {
          $filter: {
            input: '$operations',
            as: 'operation',
            cond: {
              $eq: ['$$operation.operType', 'poll']
            }
          }
        }
      },
      commentNums: {
        $size: '$comments'
      }
    }
  },
  {
    $project: {
      operations: 0,
      comments: 0
    }
  },
  {
    $match: filter ? { ...filter } : {}
  },
  ...(additionFields ? additionFields : [])
]
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

  async getMovieByActivityId(params: { activityId: number; day?: number; ip?: string }): Promise<PageResult<MovieVo>> {
    const filters = aggreFilter({
      activityId: parseInt(params.activityId.toString()),
      day: params.day ? parseInt(params.day?.toString()) : undefined
    })
    const movieList = (await this.movieModel.aggregate(filters)) as MovieModel[]

    if (movieList) {
      const movieVoList = await this.copyToVoList<MovieModel, MovieVo>(movieList, params.ip, false, 'dynamic')
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

  async getMovieDetail(movieId: number, isAll?: boolean, ip?: string) {
    const _filter: any = aggreFilter({
      movieId: parseInt(movieId.toString()),
      expectPlayTime: typeof isAll === 'boolean' && !isAll ? { $lt: new Date() } : {}
    })

    const model = await this.movieModel.aggregate([..._filter, { $limit: 1 }])

    if (model.length > 0) {
      return await this.copyToVo(model[0], ip, true, isAll ? isAll : 'dynamic')
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
    let _additionFields: any[] = []
    if (movieParams.keyword) {
      const reg = new RegExp(movieParams.keyword, 'i')
      _additionFields = [
        {
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
      ]
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
      _filter.uploader = parseInt(movieParams.uploader.toString())
    }

    if (movieParams.activityId) {
      _filter.activityId = parseInt(movieParams.activityId.toString())
    }

    if (movieParams.day) {
      _filter.day = parseInt(movieParams.day.toString())
    }

    const res = await pageQuery(movieParams, this.movieModel, aggreFilter(_filter, _additionFields))

    return {
      result: await this.copyToVoList(res.result, null, false, false),
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

  async sortMovie(movieParams: Array<{ movieId: number; sortIndex: number }>) {
    if (movieParams.some(movie => !movie.movieId || isNaN(parseInt(movie.movieId.toString())))) {
      return false
    }
    for await (const { movieId, sortIndex } of movieParams) {
      // 使用 updateOne 方法针对每个 movieId 单独更新 sortIndex
      await this.movieModel.findOneAndUpdate({ movieId }, { $set: { sortIndex: sortIndex } })
    }
    return true // 所有更新操作被成功执行
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

  async copyToVo(movieModel: MovieModel, ip?: string | null, needActivityVo?: boolean, needLink?: boolean | string) {
    const vo = new MovieVoEntity()
    copyProperties(movieModel, vo)
    if (needActivityVo && movieModel.activityId) {
      vo.activityVo = await this.activityService.findActivityVoByActivityId(movieModel.activityId)
      if (vo.activityVo) {
        vo.activityVo.staff = null
        vo.activityVo.desc = null
        vo.activityVo.rules = null
        vo.activityVo.faq = null
        vo.activityVo.timesorother = null
        vo.activityVo.sponsorListVo = null
      }
      vo.isActivityMovie = true
    } else {
      vo.activityVo = null
      vo.isActivityMovie = movieModel.activityId ? true : false
    }

    let flag = false
    if (typeof needLink === 'boolean') {
      flag = needLink
    } else {
      if (needLink === 'dynamic') {
        flag = !(movieModel.expectPlayTime && new Date(movieModel.expectPlayTime as any).getTime() > new Date().getTime()) || false
      } else {
        flag = false
      }
    }

    if (movieModel.expectPlayTime && new Date(movieModel.expectPlayTime as any).getTime() > new Date().getTime() && !flag) {
      vo.moviePlaylink = null
      vo.movieDownloadLink = null
      vo.movieLink = null
    }

    if (movieModel.expectPlayTime) {
      const time = new Date(movieModel.expectPlayTime).getTime()
      vo.expectPlayTime = formatTime(movieModel.expectPlayTime)
      if (time > Date.now()) {
        vo.isPublic = false
      } else {
        vo.isPublic = true
      }
    } else {
      vo.isPublic = true
    }

    if (ip) {
      const canPoll = await this.operService.canMoviePoll(movieModel.movieId, ip)
      const canLike = await this.operService.canMovieLike(movieModel.movieId, ip)
      const loginVo: LoginVo = {
        isLike: !canLike,
        isPoll: !canPoll,
        isCollect: false
      }
      vo.loginVo = loginVo
    }

    if (vo.realPublishTime) vo.realPublishTime = formatTime(movieModel.realPublishTime)
    vo.uploader = movieModel.uploader as any

    vo.createTime = formatTime(movieModel.createTime)
    return vo
  }
}
