import { pageQuery } from '~/common/utils'
import { Autowired, Service } from '~/common/decorator/decorator'
import Result from '~/common/result'
import { copyProperties } from '~/common/utils'
import { Statistics } from '~/model'
import BaseService from './base.service'
import { formatTime } from '~/common/utils/moment'
import { AuthorModelEntity, AuthorParamsEntity } from '~/entity/statistics.entity'
import { StatisticsModel, StatisticsParams, StatisticsUpdateParams } from 'Statistics'

const calcLongestConsecutiveTimes = (nums: number[]) => {
  if (nums.length === 0) return 0
  let longestTimes = 1
  const set = new Set(nums.sort((a, b) => a - b))
  for (const item of set) {
    if (set.has(item - 1)) {
      continue
    }
    let currentNum = item
    let currentLongestNum = 1
    while (set.has(currentNum + 1)) {
      currentNum += 1
      currentLongestNum += 1
    }
    longestTimes = Math.max(longestTimes, currentLongestNum)
  }
  return longestTimes
}

@Service(true)
export default class StatisticsService extends BaseService {
  statisticsModel = Statistics

  async findAuthorList(pageParams: PageParams) {
    const res = await pageQuery(pageParams, this.statisticsModel)

    return {
      result: await this.copyToVoList(res.result),
      page: res.page,
      total: res.total
    }
  }

  async saveAuthor(params: StatisticsParams) {
    const model = new AuthorParamsEntity()
    copyProperties(params, model)
    model.createTime = Date.now()
    // 计算最长连续参赛次数和累计次数
    const matches = params.participateMacthes?.map(item => parseInt(item.toString())).filter(item => !isNaN(item)) || []
    const consecutiveParticipateTimes = calcLongestConsecutiveTimes(matches)

    if (!params.consecutiveParticipateTimes) {
      model.consecutiveParticipateTimes = consecutiveParticipateTimes
    } else {
      model.consecutiveParticipateTimes = params.consecutiveParticipateTimes
    }

    if (!params.participateTimes) {
      model.participateTimes = matches.length
    } else {
      model.participateTimes = params.participateTimes || 0
    }

    const res = await new Statistics(model).save()
    return res || null
  }

  async updateAuthorInfo(params: StatisticsUpdateParams) {
    const model = new AuthorModelEntity()
    copyProperties(params, model)
    // 计算最长连续参赛次数和累计次数
    const matches = params.participateMacthes?.map(item => parseInt(item.toString())).filter(item => !isNaN(item)) || []
    const consecutiveParticipateTimes = calcLongestConsecutiveTimes(matches)

    if (!params.consecutiveParticipateTimes) {
      model.consecutiveParticipateTimes = consecutiveParticipateTimes
    } else {
      model.consecutiveParticipateTimes = params.consecutiveParticipateTimes
    }

    if (!params.participateTimes) {
      model.participateTimes = matches.length
    } else {
      model.participateTimes = params.participateTimes
    }
    await this.statisticsModel.updateOne({ _id: params._id }, model)
    return null
  }

  async deleteAuthor(id: any) {
    if (!id) {
      return null
    }
    await this.statisticsModel.deleteOne({ _id: id })
    return null
  }

  copyToVo(model: StatisticsModel) {
    const vo: any = new AuthorModelEntity()
    copyProperties(model, vo)
    vo.createTime = formatTime(model.createTime)
    return vo as StatisticsModel
  }
}
