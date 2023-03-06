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
	static paramsError(): ResResult<null> {
		return {
			code: RESULT_CODE.PARAMS_ERROR,
			msg: RESULT_MSG.PARAMS_ERROR,
			data: null
		}
	}
	static tooManyRequest(): ResResult<null> {
		return {
			code: RESULT_CODE.TOO_MANY_REQUEST,
			msg: RESULT_MSG.TOO_MANY_REQUEST,
			data: null
		}
	}
	static noAuth(): ResResult<null> {
		return {
			code: RESULT_CODE.NO_PERMISSION,
			msg: RESULT_MSG.NO_PERMISSION,
			data: null
		}
	}
	static noPermission(): ResResult<null> {
		return {
			code: RESULT_CODE.NO_AUTHORIZION,
			msg: RESULT_MSG.NO_AUTHORIZION,
			data: null
		}
	}
	static dataNotFound(): ResResult<null> {
		return {
			code: RESULT_CODE.DATA_NOTFOUND,
			msg: RESULT_MSG.DATA_NOTFOUND,
			data: null
		}
	}
	static dataRepeat(): ResResult<null> {
		return {
			code: RESULT_CODE.DATA_REPEAT,
			msg: RESULT_MSG.DATA_REPEAT,
			data: null
		}
	}
	static tryAgain(): ResResult<null> {
		return {
			code: RESULT_CODE.TRY_AGAIN,
			msg: RESULT_MSG.TRY_AGAIN,
			data: null
		}
	}
}
