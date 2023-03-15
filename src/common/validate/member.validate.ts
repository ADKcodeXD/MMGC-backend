import { JSONSchemaType } from 'ajv'
import { MemberParams, MemberVo } from 'Member'

export const memberParamsSchema: JSONSchemaType<MemberParams> = {
	type: 'object',
	definitions: {
		snsSite: {
			$id: '#snsSite',
			type: 'object',
			nullable: true,
			properties: {
				bilibili: { type: 'string', nullable: true },
				youtube: { type: 'string', nullable: true },
				personalWebsite: { type: 'string', nullable: true },
				niconico: { type: 'string', nullable: true },
				twitter: { type: 'string', nullable: true }
			},
			required: [],
			additionalProperties: false
		}
	},
	properties: {
		username: { type: 'string' },
		password: { type: 'string' },
		memberName: { type: 'string' },
		email: { type: 'string' },
		verifyCode: { type: 'number' },
		avatar: { type: 'string', nullable: true },
		snsSite: { $ref: '#snsSite' },
		desc: { type: 'string', nullable: true },
		gender: { type: 'integer', nullable: true }
	},
	required: ['username', 'password', 'memberName', 'email', 'verifyCode'],
	additionalProperties: true
}

export const memberUpdateParamsSchema: JSONSchemaType<MemberVo> = {
	type: 'object',
	definitions: {
		snsSite: {
			$id: '#snsSite',
			type: 'object',
			nullable: true,
			properties: {
				bilibili: { type: 'string', nullable: true },
				youtube: { type: 'string', nullable: true },
				personalWebsite: { type: 'string', nullable: true },
				niconico: { type: 'string', nullable: true },
				twitter: { type: 'string', nullable: true }
			},
			required: [],
			additionalProperties: false
		}
	},
	properties: {
		username: { type: 'string', nullable: true },
		password: { type: 'string', nullable: true },
		memberName: { type: 'string', nullable: true },
		email: { type: 'string', nullable: true },
		avatar: { type: 'string', nullable: true },
		snsSite: { $ref: '#snsSite' },
		desc: { type: 'string', nullable: true },
		gender: { type: 'number', nullable: true },
		role: { type: 'string', nullable: true },
		memberId: { type: 'integer' },
		createTime: { type: 'string', nullable: true }
	},
	required: [],
	additionalProperties: false
}
