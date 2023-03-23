import { MemberVo } from 'Member'
import { SponsorParams, SponsorUpdateParams } from 'Sponsor'
import { Auth } from '~/common/decorator/auth'
import {
	Controller,
	PostMapping,
	Body,
	User,
	GetMapping,
	QueryAll,
	DeleteMapping,
	Param,
	PutMapping,
	Autowired,
	Query
} from '~/common/decorator/decorator'
import Result from '~/common/result'
import { sponsorParamsValidate, sponsorUpdateParamsValidate } from '~/common/validate/validate'
import { Validtor } from '~/middleware/ajv.middleware'
import SponsorService from '~/service/sponsor.service'
import { RESULT_CODE, RESULT_MSG } from '~/types/enum'

@Controller('/sponsor')
export default class SponsorController {
	@Autowired()
	sponsorService!: SponsorService

	@PostMapping('/saveSponsor', [Validtor('body', sponsorParamsValidate)])
	@Auth([ROLE.ADMIN, ROLE.SUBADMIN, ROLE.COMMITTER, ROLE.GROUPMEMBER], '/saveSponsor')
	async saveSponsor(@Body() sponsortParams: SponsorParams, @User() userInfo: MemberVo) {
		if (!userInfo || !userInfo.memberId) {
			return Result.fail(RESULT_CODE.USER_NOTFOUND, RESULT_MSG.USER_NOTFOUND, null)
		}

		const res = await this.sponsorService.save(sponsortParams)
		if (res) return Result.success(res)

		return Result.paramsError()
	}

	@GetMapping('/getSponsorList')
	async getSponsorList(@QueryAll() params: PageParams) {
		if (!params.page || !params.pageSize) {
			params = { page: 1, pageSize: 10 }
		}
		return Result.success(await this.sponsorService.findSponsorList(params))
	}

	@GetMapping('/getSponsorDetail')
	async getSponsorDetail(@Query('sponsorId') sponsorId: number) {
		if (!sponsorId) {
			return Result.paramsError()
		}
		const res = await this.sponsorService.findSponsorBySponsorId(sponsorId)
		return Result.success(res)
	}

	@PutMapping('/updateSponsor', [Validtor('body', sponsorUpdateParamsValidate)])
	@Auth([ROLE.ADMIN, ROLE.SUBADMIN, ROLE.COMMITTER, ROLE.GROUPMEMBER], '/updateSponsor')
	async updateSponsor(@Body() updateParams: SponsorUpdateParams) {
		if (!updateParams.sponsorId) {
			return Result.paramsError()
		}
		const res = await this.sponsorService.updateSponsor(updateParams)
		return Result.success(res)
	}

	@DeleteMapping('/deleteSponsor/:sponsorId')
	@Auth([ROLE.ADMIN, ROLE.SUBADMIN, ROLE.COMMITTER, ROLE.GROUPMEMBER], '/delete')
	async deleteSponsor(@Param('sponsorId') sponsorId: number) {
		if (!sponsorId) {
			return Result.paramsError()
		}
		const res = await this.sponsorService.deleteSponsor(sponsorId)
		if (res) return Result.success(null)
		return Result.dataNotFound()
	}
}
