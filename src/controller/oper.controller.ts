import { MemberVo } from 'Member'
import { Controller, PostMapping, User, Query, Autowired } from '~/common/decorator/decorator'
import Result from '~/common/result'
import OperService from '~/service/oper.service'
import { RESULT_CODE, RESULT_MSG } from '~/types/enum'

@Controller('/oper')
export default class OperController {
	@Autowired()
	operService!: OperService

	@PostMapping('/likeVideo')
	async likeVideo(@Query('movieId') movieId: number, @User() userInfo: MemberVo) {
		if (!userInfo || !userInfo.memberId) {
			return Result.fail(RESULT_CODE.USER_NOTFOUND, RESULT_MSG.USER_NOTFOUND, null)
		}
		if (!movieId) {
			return Result.paramsError()
		}
		const res = await this.operService.addLikeOperRecord(movieId, userInfo.memberId)
		if (res) return res
		return Result.dataNotFound()
	}

	@PostMapping('/cancelLikeVideo')
	async cancelLikeVideo(@Query('movieId') movieId: number, @User() userInfo: MemberVo) {
		if (!userInfo || !userInfo.memberId) {
			return Result.fail(RESULT_CODE.USER_NOTFOUND, RESULT_MSG.USER_NOTFOUND, null)
		}
		if (!movieId) {
			return Result.paramsError()
		}
		const res = await this.operService.deleteLikeOperRecord(movieId, userInfo.memberId)
		if (res) return res
		return Result.dataNotFound()
	}

	@PostMapping('/pollVideo')
	async pollVideo(@Query('movieId') movieId: number, @User() userInfo: MemberVo) {
		if (!userInfo || !userInfo.memberId) {
			return Result.fail(RESULT_CODE.USER_NOTFOUND, RESULT_MSG.USER_NOTFOUND, null)
		}
		if (!movieId) {
			return Result.paramsError()
		}
		const res = await this.operService.addPollOerRecord(movieId, userInfo.memberId)
		if (res) return res
		return Result.dataNotFound()
	}
}
