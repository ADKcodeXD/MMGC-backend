import { CommentModel, CommentVo } from 'Comment'
import { MemberVo } from 'Member'

export class CommentModelEntity implements CommentModel {
	commentId: number | null = null
	content = ''
	createTime: number = Date.now()
	movieId: number | null = null
	memberId: number | null = null
	toMemberId: number | null = null
	parentId: number | null = null
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
