import { CommentParams } from 'Comment'
import { MemberVo } from 'Member'
import { Controller, PostMapping, Body, User, GetMapping, QueryAll, DeleteMapping, Param, Autowired } from '~/common/decorator/decorator'
import Result from '~/common/result'
import { commentParamsValidate } from '~/common/validate/validate'
import { Validtor } from '~/middleware/ajv.middleware'
import CommentService from '~/service/comment.service'
import { RESULT_CODE, RESULT_MSG } from '~/types/enum'

@Controller('/comment')
export default class CommentController {
	@Autowired()
	commentService!: CommentService

	@PostMapping('/addComment', [Validtor('body', commentParamsValidate)])
	async addComment(@Body() sponsortParams: CommentParams, @User() userInfo: MemberVo) {
		if (!userInfo || !userInfo.memberId) {
			return Result.noAuth()
		}

		const res = await this.commentService.save(sponsortParams)
		if (res) return Result.success(res)

		return Result.paramsError()
	}

	@GetMapping('/getCommentList')
	async getCommentList(@QueryAll() params: PageParams & { movieId: number }) {
		if (!params.page || !params.pageSize) {
			params = { page: 1, pageSize: 10, ...params, movieId: params.movieId }
		}
		return Result.success(await this.commentService.findCommentList(params, params.movieId))
	}

	@DeleteMapping('/deleteComment/:commentId')
	async deleteSponsor(@Param('commentId') commentId: number, @User() userInfo: MemberVo) {
		if (!userInfo || !userInfo.memberId) {
			return Result.fail(RESULT_CODE.NO_AUTHORIZION, RESULT_MSG.NO_AUTHORIZION, null)
		}
		if (!commentId) return Result.paramsError()

		const res = await this.commentService.deleteMyselfComment(commentId, userInfo.memberId)
		return res
	}
}
