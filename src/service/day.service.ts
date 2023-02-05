import { DayModel, DayVo, DayParams } from 'Activity'
import { copyProperties } from '~/common/utils'
import { Day } from '~/model'
import { DayVoEntity } from '~/entity/activity.entity'
import BaseService from './base.service'
import { Singleton } from '~/common/decorator/decorator'

@Singleton()
export default class ActivityService extends BaseService {
	static getInstance() {
		console.log('dont have Singleton')
		return new this()
	}

	dayModel = Day

	async findDaysByActivityId(activityId: number, isAll?: boolean) {
		const _filter: any = { activityId }
		if (!isAll) {
			_filter.isPublic = true
		}
		const dayModels: DayModel[] = <DayModel[]>await this.dayModel.find(_filter)
		if (dayModels && dayModels.length > 0) {
			return await this.copyToVoList<DayModel, DayVo>(dayModels, isAll)
		} else {
			return []
		}
	}

	async findDayDetail(activityId: number, day: number) {
		const res = await this.dayModel.findOne({ activityId: activityId, day: day })
		if (res) return res
		return null
	}

	async updateDay(dayParams: DayParams) {
		const update: Partial<DayParams> = {}
		update.isPublic = dayParams.isPublic || undefined
		update.themeCover = dayParams.themeCover || undefined
		update.themeName = dayParams.themeName || undefined
		update.themeDesc = dayParams.themeDesc || undefined
		await this.dayModel.findOneAndUpdate({ day: dayParams.day, activityId: dayParams.activityId }, update)
		return null
	}

	async deleteDay(dayParams: { activityId: number; day: number }) {
		await this.dayModel.findOneAndDelete({ day: dayParams.day, activityId: dayParams.activityId })
		return null
	}

	async copyToVo(dayModel: DayModel, isAll: boolean): Promise<DayVo> {
		const dayVo: DayVo = new DayVoEntity()
		copyProperties(dayModel, dayVo)
		return dayVo
	}
}
