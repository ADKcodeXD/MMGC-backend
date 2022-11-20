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
		await this.emailUtil.sendEmail(email)
		return Result.success(RESULT_CODE.SUCCESS, RESULT_MSG.SUCCESS, null)
	}

	@PostMapping('/verify')
	async verifyCode(@Body() body: { email: string; code: number }) {
		if (!body.email || !body.code) {
			return Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
		}
		if (await this.emailUtil.verifyCode(body.email, body.code)) {
			if (this.map.has(body.email)) {
				clearTimeout(this.map.get(body.email))
				this.map.delete(body.email)
			}
			return Result.success(RESULT_CODE.SUCCESS, RESULT_MSG.SUCCESS, null)
		} else {
			return Result.fail(RESULT_CODE.VERIFY_ERROR, RESULT_MSG.VERIFY_ERROR, null)
		}
	}
}
