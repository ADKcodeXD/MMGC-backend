declare module 'Activity' {
	interface ActivityModel {
		/**
		 * 活动官网页的背景图 不设置就是默认背景
		 */
		activityBackgroundImg: string | null
		/**
		 * 活动cm 视频链接 可以拥有好几个CM
		 */
		activityCM: string[] | null
		/**
		 * 活动封面图
		 */
		activityCover: string | null
		/**
		 * 活动主id，活动的id 根据此id进行各种操作
		 */
		activityId: number
		/**
		 * 活动专属logo
		 */
		activityLogo: string
		activityName: I18N
		/**
		 * 创建时间 Date类型
		 */
		createTime: string | Date | number
		days: number
		/**
		 * 富文本的多语言简介
		 */
		desc: I18N | null
		endTime: string | Date | null
		movieNums: number | null
		/**
		 * 赞助商id  可以有多个赞助商
		 */
		sponsorId: number[] | null
		staff: Staff | null
		startTime: string | null
	}

	interface ActivityVo {
		activityBackgroundImg: string | null
		activityCM: string[] | null
		activityLogo: string | null
		activityCover: string
		activityId: number
		activityName: I18N
		createTime: string
		days: number | null
		desc: I18N | null
		endTime: string | null
		movieNums: number | null
		staff: Staff | null
		startTime: string | null
		sponsorListVo: Array<any> | null
	}

	interface ActivityParams {
		/**
		 * 活动官网页的背景图 不设置就是默认背景
		 */
		activityBackgroundImg?: null | string
		/**
		 * 活动cm 视频链接 可以拥有好几个CM
		 */
		activityCM?: string[] | null
		/**
		 * 活动封面图
		 */
		activityCover: string
		/**
		 * 自行输入活动标识或者id
		 */
		activityId: number
		/**
		 * 活动专属logo
		 */
		activityLogo: string
		activityName: I18N
		days?: number | null
		/**
		 * 富文本的多语言简介
		 */
		desc: I18N
		endTime?: null | string
		/**
		 * 搜索获取赞助商id
		 */
		sponsorId?: null | number[]
		staff?: null | Staff
		startTime?: null | string
	}
}
