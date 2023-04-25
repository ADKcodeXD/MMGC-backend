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
	static emailExist(): ResResult<null> {
		return {
			code: RESULT_CODE.USER_EMAIL_EXIST,
			msg: RESULT_MSG.USER_EMAIL_EXIST,
			data: null
		}
	}
	static cantLikeVideo(): ResResult<null> {
		return {
			code: RESULT_CODE.CANT_LIKE_VIDEO,
			msg: RESULT_MSG.CANT_LIKE_VIDEO,
			data: null
		}
	}
	static cantPollVideo(): ResResult<null> {
		return {
			code: RESULT_CODE.CANT_POLL_VIDEO,
			msg: RESULT_MSG.CANT_POLL_VIDEO,
			data: null
		}
	}
	static cantPollVideoLimit(): ResResult<null> {
		return {
			code: RESULT_CODE.CANT_POLL_VIDEO_LIMIT,
			msg: RESULT_MSG.CANT_POLL_VIDEO_LIMIT,
			data: null
		}
	}
}
