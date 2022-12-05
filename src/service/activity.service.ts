import { ActivityModel, ActivityUpdateParams, ActivityVo } from 'Activity'
import { copyProperties, pageQuery } from '~/common/utils'
import { formatTime } from '~/common/utils/moment'
import { Activity } from '~/model'
import { ActivityVoEntity } from '~/entity/activity.entity'
import BaseService from './base.service'
import { Singleton } from '~/common/decorator/decorator'
import MemberService from './member.service'

@Singleton()
export default class ActivityService extends BaseService {
	static getInstance() {
		console.log('dont have Singleton')
		return new this()
	}

	activityModel = Activity

	memberService = MemberService.getInstance()

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
			result: await this.copyToVoList(res.result),
			page: res.page,
			total: res.total
		}
	}

	async updateByActivityId(updateActivity: ActivityUpdateParams) {
		const res = <ActivityModel | null>await this.activityModel.findOneAndUpdate({ activityId: updateActivity.activityId }, updateActivity)
		if (res) return res.activityId
		return res
	}

	async deleteByActivityId(activityId: number) {
		const res = await this.activityModel.findOneAndRemove({ activityId })
		return res
	}

	async copyToVo(activityModel: ActivityModel): Promise<ActivityVo> {
		const activityVo: ActivityVo = new ActivityVoEntity()
		copyProperties(activityModel, activityVo)
		activityVo.createTime = formatTime(activityVo.createTime)
		activityVo.endTime = activityVo.endTime ? formatTime(activityVo.endTime) : null
		activityVo.startTime = activityVo.startTime ? formatTime(activityVo.startTime) : null
		activityVo.staff = {}

		if (activityModel.staff) {
			if (activityModel.staff.has('organizer')) {
				activityVo.staff.organizer = await this.memberService.findMemberVoByMemberId(activityModel.staff.get('organizer'))
			}
			if (activityModel.staff.has('judges') && Array.isArray(activityModel.staff.get('judges'))) {
				activityVo.staff.judges = await this.memberService.findMemberVoListByMemberIds(activityModel.staff.get('judges'))
			}
			if (activityModel.staff.has('translator') && Array.isArray(activityModel.staff.get('translator'))) {
				activityVo.staff.translator = await this.memberService.findMemberVoListByMemberIds(activityModel.staff.get('translator'))
			}
		}
		return activityVo
	}
}
