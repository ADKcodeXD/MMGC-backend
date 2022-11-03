import { RESULT_CODE, RESULT_MSG } from '../types/enum'

export default class Result {
	static success(code: RESULT_CODE | number, msg: RESULT_MSG | string, data: any) {
		return {
			code: code,
			msg: msg,
			data: data
		}
	}
	static fail(code: RESULT_CODE | number, msg: RESULT_MSG | string, data: any) {
		return {
			code: code,
			msg: msg,
			data: data
		}
	}
}
