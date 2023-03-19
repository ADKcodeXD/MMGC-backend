declare module 'Comment' {
	interface CommentModel {
		commentId: number
		content: string
		createTime: number
		movieId: number
		memberId: number
		toMemberId: number
		parentId: number
	}
}
