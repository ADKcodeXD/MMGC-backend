export class PageParamsEntity implements PageParams {
	page = 1
	pageSize = 10
	id: number | null = null
	keyword: string | null = null
	createTime: string | number | Date | null = null
	sortRule: string | null = null
	orderRule: '' | 'reverse' | null = null
}
