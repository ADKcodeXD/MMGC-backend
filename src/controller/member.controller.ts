import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import Result from '~/common/result'
import { Body, Controller, PostMapping } from '~/common/decorator/decorator'
import { copyProperties } from '~/common/utils'
import { Validtor } from '~/middleware/ajv.middleware'
import { memberParamsValidate } from '~/common/validate/validate'
import { MemberParams } from 'Member'
import MemberService from '~/service/member.service'
import { MemberParamsEntity } from '~/entity/member.entity'
import { EmailUtil } from '~/common/utils/emailutil'

@Controller('/user')
export default class MemberController {
	static singletonInstance: MemberController = new MemberController()
	static getInstance() {
		if (!MemberController.singletonInstance) {
			MemberController.singletonInstance = new MemberController()
		}
		return MemberController.singletonInstance
	}

	memberService = MemberService.getInstance()

	@PostMapping('/register', [Validtor('body', memberParamsValidate)])
	async register(@Body() registerParams: MemberParams) {
		const email = EmailUtil.getInstance()
		if (
			(await this.memberService.findMemberVoByEmail(registerParams.email)) ||
			(await this.memberService.findMemberVoByUsername(registerParams.username))
		) {
			return Result.fail(RESULT_CODE.DATA_REPEAT, RESULT_MSG.DATA_REPEAT, null)
		}
		if (await email.verifyCode(registerParams.email, registerParams.verifyCode)) {
			const params = new MemberParamsEntity()
			copyProperties(registerParams, params)
			const id = await this.memberService.save(params)
			return Result.success(RESULT_CODE.SUCCESS, RESULT_MSG.SUCCESS, id)
		} else {
			return Result.fail(RESULT_CODE.VERIFY_ERROR, RESULT_MSG.VERIFY_ERROR, null)
		}
	}
}
