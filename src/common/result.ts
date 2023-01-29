import { RESULT_CODE, RESULT_MSG } from '../types/enum'

export default class Result {
	static success<T>(data: T): ResResult<T> {
		return {
			code: RESULT_CODE.SUCCESS,
			msg: RESULT_MSG.SUCCESS,
			data: data
		}
	}
	static fail<T>(code: RESULT_CODE | number, msg: RESULT_MSG | string, data: T): ResResult<T> {
		return {
			code: code,
			msg: msg,
			data: data
		}
	}
}
