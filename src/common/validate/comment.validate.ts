// CommentParams
import { JSONSchemaType } from 'ajv'
import { CommentParams } from 'Comment'

export const commentParamsSchema: JSONSchemaType<CommentParams> = {
	type: 'object',
	properties: {
		content: { type: 'string' },
		movieId: { type: 'integer' },
		toMemberId: { type: 'integer', nullable: true },
		parentId: { type: 'integer', nullable: true }
	},
	required: ['content', 'movieId'],
	additionalProperties: true
}
