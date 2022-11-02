export const enum REQUEST_METHOD {
	GET = 'get',
	POST = 'post',
	DELETE = 'delete',
	PUT = 'put',
	PATCH = 'patch'
}

export const enum RESULT_CODE {
	SUCCESS = 200,
	PARAMS_ERROR = 8001, // 入参错误
	USER_NOTFOUND = 8002, // 不合法的用户
	NO_AUTHORIZION = 8003 // 未授权
}

export const enum RESULT_MSG {
	SUCCESS = '访问成功',
	PARAMS_ERROR = '参数错误', // 入参错误
	USER_NOTFOUND = '用户不存在', // 不合法的用户
	NO_AUTHORIZION = '未登录' // 未授权
}
