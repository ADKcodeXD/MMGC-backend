import { ActivityParams, ActivityUpdateParams } from 'Activity'
import { JSONSchemaType } from 'ajv'

export const activityParamsSchema: JSONSchemaType<ActivityParams> = {
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

export const activityUpdateParamsSchema: JSONSchemaType<ActivityUpdateParams> = {
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
		activityName: { $ref: '#i18n', nullable: true, type: 'object' },
		activityCover: { type: 'string', nullable: true },
		activityLogo: { type: 'string', nullable: true },
		desc: { $ref: '#i18n', nullable: true, type: 'object' },
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
	required: ['activityId'],
	additionalProperties: true
}
