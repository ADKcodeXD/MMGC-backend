declare module 'Comment' {
	import { MemberVo } from 'Member'
	interface CommentModel {
		commentId: number | null // 评论id
		content: string | null // 评论内容
		createTime: number | null // 评论时间
		movieId: number | null // 评论的电影id
		memberId: number | null // 评论人id
		toMemberId: number | null
		parentId: number | null
	}

	interface CommentVo extends Omit<CommentModel, 'memberId' | 'toMemberId' | 'createTime'> {
		memberVo?: MemberVo | null
		toMemberVo?: MemberVo | null
		createTime: string
		children: Array<CommentVo>
	}

	interface CommentParams {
		content: string
		movieId: number
		toMemberId?: number | null
		parentId?: number | null
	}
}
