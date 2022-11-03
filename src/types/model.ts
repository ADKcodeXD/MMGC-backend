declare global {
	interface Activity {
		activityId: number
		activityName: string
		createTime: Date
		sponsorId: string
		sponsorName: string
		days: number
		movieNums: number
	}
}
export {}
