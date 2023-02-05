import { ActivityModel, ActivityParams, ActivityVo, DayModel, DayParams, DayVo } from 'Activity'

export class ActivityModelEntity implements Required<ActivityModel> {
	rules: I18N | null = null
	timesorother: I18N | null = null
	faq: I18N | null = null
	activityBackgroundImg: string | null = null
	activityCM: Cmvo[] | null = null
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
	staff: Map<any, any> | null = null
	startTime: string | null = null
}

export class ActivityVoEntity implements Required<ActivityVo> {
	rules: I18N | null = null
	faq: I18N | null = null
	timesorother: I18N | null = null
	sponsorListVo: any[] | null = null
	activityBackgroundImg: string | null = null
	activityCM: Cmvo[] | null = null
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
	staff: StaffVo | null = null
	startTime: string | null = null
}

export class ActivityParamsEntity implements Required<ActivityParams> {
	rules: I18N | null = null
	faq: I18N | null = null
	timesorother: I18N | null = null
	activityBackgroundImg: string | null = null
	activityCM: Cmvo[] | null = null
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

export class DayParamsEntity implements Required<DayParams> {
	activityId: number | null = null
	day: number | null = 0
	themeCover: string | null = null
	themeDesc: I18N | null = null
	themeName: I18N | null = null
	isPublic: boolean | null = true
	sortIndex: number | null = 0
}

export class DayModelEntity implements Required<DayModel> {
	activityId: number | null = null
	day: number | null = 0
	themeCover: string | null = null
	themeDesc: I18N | null = null
	themeName: I18N | null = null
	isPublic: boolean | null = false
	sortIndex: number | null = 0
}

export class DayVoEntity implements Required<DayVo> {
	day: number | null = null
	themeCover: string | null = null
	themeDesc: I18N | null = null
	themeName: I18N | null = null
	isPublic: boolean | null = null
	sortIndex: number | null = 0
	activityId: number | null = 0
}
