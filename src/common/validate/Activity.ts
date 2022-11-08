import { ActivityParams } from 'Activity'
import Ajv, { JSONSchemaType } from 'ajv'
import ajvErrors from 'ajv-errors'
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
		sponsorId: { type: 'integer', nullable: true },
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
	additionalProperties: false
}

const activityParamsValidate = ajv.compile<ActivityParams>(activityParamsSchema)

export { activityParamsValidate }
