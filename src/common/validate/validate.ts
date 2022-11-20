import { ActivityParams } from 'Activity'
import Ajv, { JSONSchemaType } from 'ajv'
import ajvErrors from 'ajv-errors'
import { MemberParams } from 'Member'
const ajv = new Ajv({ allErrors: true })
ajvErrors(ajv)
const activityParamsSchema: JSONSchemaType<ActivityParams> = {
	type: 'object',
	definitions: {
		i18n: {
			$id: '#i18n',
			type: 'object',
			properties: {
				cn: { type: 'string' },
				jp: { type: 'string', nullable: true },
				en: { type: 'string', nullable: true }
			},
			required: ['cn'],
			additionalProperties: false
		}
	},
	properties: {
		activityId: { type: 'integer' },
		activityName: { $ref: '#i18n' },
		activityCover: { type: 'string' },
		activityLogo: { type: 'string' },
		desc: { $ref: '#i18n' },
		activityCM: { type: 'array', nullable: true, items: { type: 'string' } },
		activityBackgroundImg: { type: 'string', nullable: true },
		days: { type: 'integer', nullable: true },
		startTime: { type: 'string', nullable: true },
		endTime: { type: 'string', nullable: true },
		sponsorId: { type: 'array', nullable: true, items: { type: 'number' } },
		staff: {
			type: 'object',
			nullable: true,
			properties: {
				organizer: { type: 'integer', nullable: true },
				translator: { type: 'array', nullable: true, items: { type: 'integer' } },
				judges: { type: 'array', nullable: true, items: { type: 'integer' } }
			},
			additionalProperties: false
		}
	},
	required: ['activityId', 'activityName', 'activityLogo', 'activityCover', 'desc'],
	additionalProperties: true
}

const memberParamsSchema: JSONSchemaType<MemberParams> = {
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

const activityParamsValidate = ajv.compile<ActivityParams>(activityParamsSchema)

const memberParamsValidate = ajv.compile<MemberParams>(memberParamsSchema)

export { activityParamsValidate, memberParamsValidate }
