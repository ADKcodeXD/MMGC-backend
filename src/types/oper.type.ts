declare module 'Oper' {
	interface OperType {
		createTime: number | null
		memberId: number | null
		movieId: number | null
		operType: 'like' | 'poll'
		operId: number | null
		day: number | null
		activityId: number | null
	}
}
