import { JSONSchemaType } from 'ajv'
import { StatisticsParams, StatisticsUpdateParams } from 'Statistics'

export const addNewAuthorParamsSchema: JSONSchemaType<StatisticsParams> = {
  type: 'object',
  properties: {
    authorName: { type: 'string' },
    authorAvatar: { type: 'string' },
    participateMacthes: { type: 'array', items: { type: 'number' } },
    authorType: { type: 'string' },
    participateTimes: { type: 'number' },
    consecutiveParticipateTimes: { type: 'number' }
  },
  required: ['authorName'],
  additionalProperties: false
}

export const updateAuthorParamsSchema: JSONSchemaType<StatisticsUpdateParams> = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    authorName: { type: 'string' },
    authorAvatar: { type: 'string' },
    participateMacthes: { type: 'array', items: { type: 'number' } },
    authorType: { type: 'string' },
    participateTimes: { type: 'number' },
    consecutiveParticipateTimes: { type: 'number' }
  },
  required: ['_id'],
  additionalProperties: false
}
