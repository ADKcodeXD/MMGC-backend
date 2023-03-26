import { CommentModelEntity, CommentVoEntity } from './../entity/comment.entity'
import { pageQuery } from '~/common/utils'
// write a service for sponsor

import { Autowired, Service } from '~/common/decorator/decorator'
import Result from '~/common/result'
import { copyProperties } from '~/common/utils'
import { Comment } from '~/model'
import BaseService from './base.service'
import IncrementService from './increment.service'
import { formatTime } from '~/common/utils/moment'
import MemberService from './member.service'
import { CommentModel, CommentParams, CommentVo } from 'Comment'

@Service(true)
export default class CommentService extends BaseService {
	commentModel = Comment

	@Autowired()
	incrementService!: IncrementService

	@Autowired()
	memberService!: MemberService

	async findCommentList(pageParams: PageParams, movieId: number): Promise<PageResult<CommentVo>> {
		const _filter: any = { parentId: null, movieId: movieId }
		if (pageParams.keyword) {
			_filter['content'] = { $regex: pageParams.keyword }
		}

		const pageRes = await pageQuery(pageParams, this.commentModel, _filter)
		const { result, page, total } = pageRes
		const findChildren = async (comment: CommentVo): Promise<CommentVo[]> => {
			const list = await this.commentModel.find({ parentId: comment.commentId })
			if (list && list.length > 0) {
				const tempList: CommentVo[] = []
				for await (const item of list) {
					const vo = await this.copyToVo(item)
					vo.children = await findChildren(vo)
					tempList.push(vo)
				}
				return tempList
			} else {
				return []
			}
		}
		const res = await this.copyToVoList<CommentModel, CommentVo>(result, true)
		// 找到page中的所有不含子的评论 然后再循环调用
		for await (const item of res) {
			item.children = await findChildren(item)
		}

		return {
			result: res,
			page: page,
			total: total
		}
	}

	async deleteMyselfComment(commentId: number, memberId: number) {
		const member = await this.memberService.findMemberByMemberId(memberId)
		if (member) {
			const res = await this.commentModel.findOne({ commentId: commentId, memberId: member.memberId })
			if (!res) {
				return Result.dataNotFound()
			}
			await this.commentModel.deleteOne({ commentId: commentId, memberId: member.memberId })
			return Result.success(null)
		}
		return Result.dataNotFound()
	}

	async save(commentParams: CommentParams) {
		const model = new CommentModelEntity()
		copyProperties(commentParams, model)
		model.commentId = await this.incrementService.incrementId('comments', { model: Comment, key: 'commentId' })
		model.createTime = Date.now()
		const res = await new Comment(model).save()
		return res || null
	}

	async copyToVo(model: CommentModel) {
		const vo = new CommentVoEntity()
		copyProperties(model, vo)
		if (model.memberId) {
			const memberVo = await this.memberService.findMemberVoByMemberId(model.memberId)
			if (memberVo) {
				vo.memberVo = memberVo
			}
		}
		if (model.toMemberId) {
			const memberVo = await this.memberService.findMemberVoByMemberId(model.toMemberId)
			if (memberVo) {
				vo.toMemberVo = memberVo
			}
		}
		vo.createTime = formatTime(model.createTime)
		return vo
	}
}
