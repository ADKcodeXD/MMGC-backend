import { Context } from 'koa'
import { MemberVo } from 'Member'
import { Controller, PostMapping, User, Query, Autowired, Ctx } from '~/common/decorator/decorator'
import Result from '~/common/result'
import { IpUtils } from '~/common/utils/ipUtils'
import OperService from '~/service/oper.service'
import { RESULT_CODE, RESULT_MSG } from '~/types/enum'

@Controller('/oper')
export default class OperController {
	@Autowired()
	operService!: OperService

	@Autowired()
	IpUtils!: IpUtils

	@PostMapping('/likeVideo')
	async likeVideo(@Query('movieId') movieId: number, @Ctx() ctx: Context) {
		if (!movieId) {
			return Result.paramsError()
		}
		const ip = this.IpUtils.getIp(ctx)
		const res = await this.operService.addLikeOperRecord(movieId, ip)
		if (res) return res
		return Result.dataNotFound()
	}

	@PostMapping('/cancelLikeVideo')
	async cancelLikeVideo(@Query('movieId') movieId: number, @Ctx() ctx: Context) {
		if (!movieId) {
			return Result.paramsError()
		}
		const ip = this.IpUtils.getIp(ctx)
		const res = await this.operService.deleteLikeOperRecord(movieId, ip)
		if (res) return res
		return Result.dataNotFound()
	}

	@PostMapping('/pollVideo')
	async pollVideo(@Query('movieId') movieId: number, @Ctx() ctx: Context) {
		if (!movieId) {
			return Result.paramsError()
		}
		const ip = this.IpUtils.getIp(ctx)
		const res = await this.operService.addPollOerRecord(movieId, ip)
		if (res) return res
		return Result.dataNotFound()
	}
}
