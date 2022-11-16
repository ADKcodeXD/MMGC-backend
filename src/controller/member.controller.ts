import { Body, Controller, DeleteMapping, GetMapping, Param, PostMapping, PutMapping, QueryAll } from '~/common/decorator/decorator'
import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import Result from '~/common/result'
import { copyProperties } from '~/common/utils'
import { Validtor } from '~/middleware/ajv.middleware'
import { memberParamsValidate } from '~/common/validate/validate'
import ActivityService from '~/service/activity.service'
import { MemberParams } from 'Member'
import MemberService from '~/service/member.service'

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
		return null
	}
}
