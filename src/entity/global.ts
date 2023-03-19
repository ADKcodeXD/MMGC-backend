import { OperType } from 'Oper'

export class PageParamsEntity implements PageParams {
	page = 1
	pageSize = 10
	id: number | null = null
	keyword: string | null = null
	createTime: string | number | Date | null = null
	sortRule: string | null = null
	orderRule: '' | 'reverse' | null = null
}

export class MMGCSysConfigEntity implements MMGCSysConfig {
	currentActivityId = 0
	skin = ''
	isVideoPlay = true
	otherSettings = ''
	configType = 1
}

export class OperTypeEntity implements OperType {
	createTime: number | null = null
	memberId: number | null = null
	movieId = 0
	operType: 'like' | 'poll' = 'like'
	operId = 0
	day: number | null = null
	activityId: number | null = null
}
