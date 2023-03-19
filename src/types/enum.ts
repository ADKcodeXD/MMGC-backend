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
	DATA_NOTFOUND = 8005, // 未找到相对应的数据
	TOO_MANY_REQUEST = 8006, // 请求次数过多
	VERIFY_ERROR = 8007, // 验证码错误
	USER_PASSWORD_WRONG = 8008, // 用户名错误或密码错误
	SEND_EMAIL_ERROR = 8009, // 发邮件错误
	TRY_AGAIN = 8010, // 上传发生错误 请重试
	NO_PERMISSION = 403, // 无权限
	CANT_POLL_VIDEO = 8011,
	CANT_LIKE_VIDEO = 8012,
	USER_EMAIL_EXIST = 8013 //用户邮箱已存在
}

export const enum RESULT_MSG {
	SUCCESS = '访问成功',
	PARAMS_ERROR = '参数错误', // 入参错误
	USER_NOTFOUND = '用户不存在', // 不合法的用户
	NO_AUTHORIZION = '未登录', // 未授权
	DATA_REPEAT = '当前数据已存在，请勿重复创建', // 数据已存在
	DATA_NOTFOUND = '未找到对应数据', // 未找到相对应的数据
	TOO_MANY_REQUEST = '请稍后再请求', // 请求次数过多
	VERIFY_ERROR = '验证码错误', // 验证码错误
	USER_PASSWORD_WRONG = '用户名错误或密码错误', // 用户名错误或密码错误
	SEND_EMAIL_ERROR = '发送邮件错误',
	TRY_AGAIN = '上传发生错误 请重试', // 上传发生错误 请重试
	NO_PERMISSION = '暂无权限', // 无权限
	CANT_POLL_VIDEO = '无法投票',
	CANT_LIKE_VIDEO = '无法点赞',
	USER_EMAIL_EXIST = '邮箱已存在' //用户邮箱已存在
}

export const enum ROLE {
	/** 全局管理员 */
	ADMIN = 'ADMIN',
	/** 子管理员 */
	SUBADMIN = 'SUBADMIN',
	/** 访客 */
	GUEST = 'GUEST',
	/** 组内成员 */
	GROUPMEMBER = 'GROUPMEMBER',
	/** 贡献者 */
	COMMITTER = 'COMMITTER'
}
