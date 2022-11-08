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
	NO_AUTHORIZION = 8003, // 未授权
	DATA_REPEAT = 8004, // 数据已存在
	DATA_NOTFOUND = 8005 // 未找到相对应的数据
}

export const enum RESULT_MSG {
	SUCCESS = '访问成功',
	PARAMS_ERROR = '参数错误', // 入参错误
	USER_NOTFOUND = '用户不存在', // 不合法的用户
	NO_AUTHORIZION = '未登录', // 未授权
	DATA_REPEAT = '当前数据已存在，请勿重复创建', // 数据已存在
	DATA_NOTFOUND = '未找到对应数据' // 未找到相对应的数据
}
