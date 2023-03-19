import { JSONSchemaType } from 'ajv'
import { SponsorParams, SponsorUpdateParams } from 'Sponsor'

export const sponsorParamsSchema: JSONSchemaType<SponsorParams> = {
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
		sponsorDesc: { $ref: '#i18n' },
		sponsorName: { $ref: '#i18n' },
		sponsorLogo: { type: 'string' }
	},
	required: ['sponsorDesc', 'sponsorName', 'sponsorLogo'],
	additionalProperties: false
}

export const sponsorUpdateParamsSchema: JSONSchemaType<SponsorUpdateParams> = {
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
			nullable: true,
			required: [],
			additionalProperties: false
		}
	},
	properties: {
		sponsorId: { type: 'number' },
		sponsorDesc: { $ref: '#i18n' },
		sponsorName: { $ref: '#i18n' },
		sponsorLogo: { type: 'string', nullable: true }
	},
	required: ['sponsorId'],
	additionalProperties: false
}
