declare global {
	interface NormalObject {
		[key: string]: string
	}

	interface ControllerRouter {
		url: string
		method: string
		handler: Function
		name?: string
		middleware?: any
		constructor?: Function | any
	}

	interface ParamsMeta {
		name: string
		index: number
		fn: Function
	}

	interface I18N {
		/**
		 * 中文名
		 */
		cn: string
		/**
		 * 英文名
		 */
		en?: null | string
		/**
		 * 日文名
		 */
		jp?: null | string
	}

	interface Staff {
		/**
		 * 评委id列表
		 */
		judges?: string[] | null
		/**
		 * 主办人用户id
		 */
		organizer?: null | string
		/**
		 * 翻译人员
		 */
		translator?: string[] | null
	}

	interface Sns {
		bilibili?: string;
		/**
		 * niconico网站
		 */
		niconico?: string;
		/**
		 * 个人网站
		 */
		personalWebsite?: string;
		/**
		 * 推特网站
		 */
		twitter?: string;
		/**
		 * youtube频道
		 */
		youtube?: string;
	}

	interface DownloadLink {
		baidu?: string;
		google?: string;
		onedrive?: string;
		other?: string;
	}

	interface LoginVo {
		/**
		 * 是否收藏
		 */
		isCollect: boolean;
		/**
		 * 是否点赞
		 */
		isLike: boolean;
		/**
		 * 是否已投票
		 */
		isPoll: boolean;
	}
	
}
export { }
