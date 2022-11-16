import { ActivityModel, ActivityParams, ActivityVo } from 'Activity'

export class ActivityModelEntity implements ActivityModel {
	activityBackgroundImg: string | null = null
	activityCM: string[] | null = null
	activityCover = ''
	activityId = 0
	activityLogo = ''
	activityName: I18N = {
		cn: ''
	}
	createTime = Date.now()
	days = 0
	desc: I18N | null = null
	endTime: string | Date | null = null
	movieNums: number | null = null
	sponsorId: number[] | null = null
	staff: Staff | null = null
	startTime: string | null = null
}

export class ActivityVoEntity implements ActivityVo {
	sponsorListVo: any[] | null = null
	activityBackgroundImg: string | null = null
	activityCM: string[] | null = null
	activityCover = ''
	activityId = 0
	activityLogo = ''
	activityName: I18N = {
		cn: ''
	}
	createTime = ''
	days = 0
	desc: I18N | null = null
	endTime: string | null = null
	movieNums: number | null = null
	sponsorId: number[] | null = null
	staff: Staff | null = null
	startTime: string | null = null
}

export class ActivityParamsEntity implements ActivityParams {
	activityBackgroundImg: string | null = null
	activityCM: string[] | null = null
	activityCover = ''
	activityId = 0
	activityLogo = ''
	activityName: I18N = {
		cn: ''
	}
	createTime = ''
	days = 0
	desc: I18N = {
		cn: ''
	}
	endTime: string | null = null
	movieNums: number | null = null
	sponsorId: number[] | null = null
	staff: Staff | null = null
	startTime: string | null = null
}
