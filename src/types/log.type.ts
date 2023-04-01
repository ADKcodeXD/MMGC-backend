declare module 'Log' {
	import { MemberVo } from 'Member'

	interface LogModel {
		/**
		 * 日志uuid
		 */
		_id: string
		/**
		 * 日志默认value值
		 */
		_v: string
		/**
		 * 访问操作设备头
		 */
		agent: string
		/**
		 * 时间戳
		 */
		createTime: number
		/**
		 * 记录访问ip
		 */
		ip: string
		/**
		 * 用户id
		 */
		memberId: number | null
		/**
		 * 访问接口名
		 */
		url: string
	}

	type LogParams = Omit<LogModel, '_id' | '_v'>

	interface LogVo extends Omit<LogModel, 'memberId'> {
		memberVo: MemberVo | null
	}
}
