import { ActivityModel, ActivityVo } from 'Activity'
import { copyProperties } from '~/common/utils'
import { formatTime } from '~/common/utils/moment'
import { Activity } from '~/model'
import { ActivityVoEntity } from '~/entity/activity.entity'
import BaseService from './base.service'
import { PageParamsEntity } from '~/entity/global'
import { Singleton } from '~/common/decorator/decorator'

@Singleton()
export default class ActivityService extends BaseService {
	static getInstance() {
		console.log('dont have Singleton')
		return new this()
	}

	activityModel = Activity

	async findActivityByActivityId(activityId: number) {
		const activityModel: ActivityModel = <ActivityModel>await this.activityModel.findOne({ activityId: activityId })
		if (activityModel) {
			return this.copyToVo(activityModel)
		}
		return null
	}

	async findActivityList(pageParams: PageParams): Promise<PageResult<ActivityVo>> {
		const params = new PageParamsEntity()
		copyProperties(pageParams, params)
		params.page = parseInt(params.page.toString()) // 发现可能是字符串类型
		let _filter = {}
		if (params.keyword) {
			const reg = new RegExp(params.keyword, 'i')
			console.log(reg.test('黄金鸡-2022'))
			_filter = {
				$or: [
					// 多字段同时匹配
					{ 'activityName.cn': { $regex: reg } },
					{ 'activityName.en': { $regex: reg } },
					{ 'activityName.jp': { $regex: reg } },
					{ 'desc.cn': { $regex: reg } },
					{ 'desc.en': { $regex: reg } },
					{ 'desc.jp': { $regex: reg } }
				]
			}
		}
		let count = 0
		count = await this.activityModel.count(_filter)
		if ((params.page - 1) * params.pageSize > count) {
			return {
				result: [],
				total: count,
				page: params.page
			}
		}
		const orderRule = params.orderRule ? 1 : -1
		let sort = {}
		if (params.sortRule) {
			sort = { [params.sortRule]: orderRule }
		} else {
			sort = { createTime: orderRule }
		}
		const res = await this.activityModel
			.find(_filter)
			.sort(sort)
			.skip((params.page - 1) * params.pageSize)
			.limit(params.pageSize)
		const result = this.copyToVoList(res)
		return {
			result: result,
			total: count,
			page: params.page
		}
	}

	async updateByActivityId(updateActivity: ActivityModel) {
		const res = <ActivityModel | null>await this.activityModel.findOneAndUpdate({ activityId: updateActivity.activityId }, updateActivity)
		if (res) return res.activityId
		return res
	}

	async deleteByActivityId(activityId: number) {
		const res = await this.activityModel.findOneAndRemove({ activityId })
		return res
	}

	copyToVo(activityModel: ActivityModel): ActivityVo {
		const activityVo: ActivityVo = new ActivityVoEntity()
		copyProperties(activityModel, activityVo)
		activityVo.createTime = formatTime(activityVo.createTime)
		activityVo.endTime = activityVo.endTime ? formatTime(activityVo.endTime) : null
		activityVo.startTime = activityVo.startTime ? formatTime(activityVo.startTime) : null
		return activityVo
	}
}
