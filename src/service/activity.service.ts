import { Activity } from '~/model'

export default class ActivityService {
	activityModel = Activity
	static activityServiceSingleInstance: ActivityService = new ActivityService()

	static getInstance() {
		if (!ActivityService.activityServiceSingleInstance) {
			ActivityService.activityServiceSingleInstance = new ActivityService()
		}
		return ActivityService.activityServiceSingleInstance
	}

	async findActivityByActivityId(activityId: number) {
		const activityModel = await this.activityModel.findOne({ activityId: activityId })
		return activityModel
	}
}
