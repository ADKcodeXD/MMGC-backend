import { ActivityModel, ActivityVo } from 'Activity'
import { copyProperties, pageQuery } from '~/common/utils'
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
		let _filter = {}
		if (pageParams.keyword) {
			const reg = new RegExp(pageParams.keyword, 'i')
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
		const res = await pageQuery(pageParams, this.activityModel, _filter)
		return {
			result: this.copyToVoList(res.result),
			page: res.page,
			total: res.total
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
