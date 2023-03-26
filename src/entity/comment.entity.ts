import { CommentModel, CommentVo } from 'Comment'
import { MemberVo } from 'Member'

export class CommentModelEntity implements CommentModel {
	commentId = NaN
	content = ''
	createTime: number = Date.now()
	movieId = NaN
	memberId = NaN
	toMemberId = NaN
	parentId = NaN
}

export class CommentVoEntity implements CommentVo {
	children: CommentVo[] = []
	commentId = NaN
	content = ''
	createTime = ''
	movieId = NaN
	parentId: number | null = null
	memberVo: MemberVo | null = null
	toMemberVo: MemberVo | null = null
}
