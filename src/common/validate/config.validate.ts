import { JSONSchemaType } from 'ajv'

export const configUpdateSchemas: JSONSchemaType<MMGCSysConfig> = {
	type: 'object',
	properties: {
		currentActivityId: { type: 'integer', nullable: true },
		isVideoPlay: { type: 'boolean', nullable: true },
		otherSettings: { type: 'string', nullable: true },
		skin: { type: 'string', nullable: true },
		configType: { type: 'integer', nullable: true }
	},
	additionalProperties: true
}
