import { ActivityModel, ActivityUpdateParams, ActivityVo } from 'Activity'
import { copyProperties, pageQuery } from '~/common/utils'
import { formatTime } from '~/common/utils/moment'
import { Activity } from '~/model'
import { ActivityVoEntity } from '~/entity/activity.entity'
import BaseService from './base.service'
import { Autowired, Service } from '~/common/decorator/decorator'
import MemberService from './member.service'

@Service(true)
export default class ActivityService extends BaseService {
	activityModel = Activity

	@Autowired()
	memberService!: MemberService

	async findActivityVoByActivityId(activityId: number) {
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
			const setMembersByKey = async (key: keyof StaffVo, staff: Map<any, any>) => {
				if (staff.has(key) && Array.isArray(staff.get(key))) {
					key = key as keyof Omit<Staff, 'organizer'>
					const members = (await this.memberService.findMemberVoListByMemberIds(staff.get(key))) as []
					activityVo.staff![key] = members
				} else if (staff.has(key)) {
					const member = await this.memberService.findMemberVoByMemberId(staff.get('organizer'))
					key = key as 'organizer'
					activityVo.staff![key] = member
				}
			}
			await setMembersByKey('organizer', activityModel.staff)
			await setMembersByKey('judges', activityModel.staff)
			await setMembersByKey('translator', activityModel.staff)
			await setMembersByKey('others', activityModel.staff)
		}
		return activityVo
	}
}
