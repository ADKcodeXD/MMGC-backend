import { ActivityParams, ActivityUpdateParams, DayParams } from 'Activity'
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
		},
		i18nNullable: {
			$id: '#i18nNull',
			type: 'object',
			nullable: true,
			properties: {
				cn: { type: 'string', nullable: true },
				jp: { type: 'string', nullable: true },
				en: { type: 'string', nullable: true }
			},
			required: [],
			additionalProperties: false
		}
	},
	properties: {
		activityId: { type: 'integer' },
		activityName: { $ref: '#i18n' },
		activityCover: { type: 'string' },
		activityLogo: { type: 'string' },
		desc: { $ref: '#i18n' },
		activityCM: {
			type: 'array',
			nullable: true,
			items: {
				type: 'object',
				properties: {
					title: { type: 'string', nullable: true },
					cmEditor: { type: 'string', nullable: true },
					link: { type: 'string', nullable: true },
					desc: { type: 'string', nullable: true }
				},
				required: [],
				additionalProperties: true
			}
		},
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
				judges: { type: 'array', nullable: true, items: { type: 'integer' } },
				others: { type: 'array', nullable: true, items: { type: 'integer' } }
			},
			additionalProperties: false
		},
		rules: { $ref: '#i18nNull' },
		timesorother: { $ref: '#i18nNull' },
		faq: { $ref: '#i18nNull' }
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
		},
		i18nNullable: {
			$id: '#i18nNull',
			type: 'object',
			nullable: true,
			properties: {
				cn: { type: 'string', nullable: true },
				jp: { type: 'string', nullable: true },
				en: { type: 'string', nullable: true }
			},
			required: [],
			additionalProperties: false
		}
	},
	properties: {
		activityId: { type: 'integer' },
		activityName: { $ref: '#i18n', nullable: true, type: 'object' },
		activityCover: { type: 'string', nullable: true },
		activityLogo: { type: 'string', nullable: true },
		desc: { $ref: '#i18n', nullable: true, type: 'object' },
		activityCM: {
			type: 'array',
			nullable: true,
			items: {
				type: 'object',
				properties: {
					title: { type: 'string', nullable: true },
					cmEditor: { type: 'string', nullable: true },
					link: { type: 'string', nullable: true },
					desc: { type: 'string', nullable: true }
				},
				required: [],
				additionalProperties: true
			}
		},
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
				judges: { type: 'array', nullable: true, items: { type: 'integer' } },
				others: { type: 'array', nullable: true, items: { type: 'integer' } }
			},
			additionalProperties: false
		},
		rules: { $ref: '#i18nNull' },
		timesorother: { $ref: '#i18nNull' },
		faq: { $ref: '#i18nNull' }
	},
	required: ['activityId'],
	additionalProperties: true
}

export const DayParamsSchema: JSONSchemaType<DayParams> = {
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
		},
		i18nNullable: {
			$id: '#i18nNull',
			type: 'object',
			nullable: true,
			properties: {
				cn: { type: 'string', nullable: true },
				jp: { type: 'string', nullable: true },
				en: { type: 'string', nullable: true }
			},
			required: [],
			additionalProperties: false
		}
	},
	properties: {
		activityId: { type: 'integer' },
		day: { type: 'integer' },
		themeName: { $ref: '#i18n' },
		isPublic: { type: 'boolean', nullable: true },
		themeCover: { type: 'string', nullable: true },
		sortIndex: { type: 'integer', nullable: true },
		themeDesc: { $ref: '#i18nNull' }
	},
	required: ['activityId', 'day', 'themeName'],
	additionalProperties: true
}
