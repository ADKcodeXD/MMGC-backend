import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import { Body, Controller, GetMapping, PostMapping, Query } from '~/common/decorator/decorator'
import Result from '~/common/result'
import { EmailUtil } from '~/common/utils/emailutil'

@Controller('/email')
export default class EmailController {
	static singletonInstance: EmailController = new EmailController()
	static getInstance() {
		if (!EmailController.singletonInstance) {
			EmailController.singletonInstance = new this()
		}
		return EmailController.singletonInstance
	}
	static emailMap = new Map()
	emailUtil = EmailUtil.getInstance()
	map = new Map()

	@GetMapping('/getCode')
	async getCode(@Query('email') email: string) {
		if (!email) {
			return Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
		}
		if (this.map.has(email)) {
			return Result.fail(RESULT_CODE.TOO_MANY_REQUEST, RESULT_MSG.TOO_MANY_REQUEST, null)
		}
		const timeOut = setTimeout(() => {
			clearTimeout(this.map.get(email))
			this.map.delete(email)
		}, 60 * 1000)
		this.map.set(email, timeOut)
		try {
			await this.emailUtil.sendEmail(email)
		} catch (error) {
			clearTimeout(this.map.get(email))
			this.map.delete(email)
			return Result.fail(RESULT_CODE.SEND_EMAIL_ERROR, RESULT_MSG.SEND_EMAIL_ERROR, null)
		}
		return Result.success(null)
	}

	@PostMapping('/verify')
	async verifyCode(@Body() body: { email: string; code: number | string }) {
		if (!body.email || !body.code) {
			return Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
		}
		const flag = await this.emailUtil.verifyCode(body.email, parseInt(body.code.toString()))
		if (flag) {
			if (this.map.has(body.email)) {
				clearTimeout(this.map.get(body.email))
				this.map.delete(body.email)
			}
			return Result.success(null)
		} else {
			return Result.fail(RESULT_CODE.VERIFY_ERROR, RESULT_MSG.VERIFY_ERROR, null)
		}
	}
}
