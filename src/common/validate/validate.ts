import { ActivityParams, ActivityUpdateParams, DayParams } from 'Activity'
import Ajv from 'ajv'
import ajvErrors from 'ajv-errors'
import { MemberParams } from 'Member'
import { MovieParams, MovieUpdateParams } from 'Movie'
import { activityParamsSchema, activityUpdateParamsSchema, DayParamsSchema } from './activity.validate'
import { memberParamsSchema, memberUpdateParamsSchema } from './member.validate'
import { movieParamsSchema, movieUpdateParamsSchema } from './movie.validate'
import { configUpdateSchemas } from './config.validate'
const ajv = new Ajv({ allErrors: true })
ajvErrors(ajv)

const activityParamsValidate = ajv.compile<ActivityParams>(activityParamsSchema)

const activityUpdateParamsSchemaValidate = ajv.compile<ActivityUpdateParams>(activityUpdateParamsSchema)

const DayParamsSchemaValidate = ajv.compile<DayParams>(DayParamsSchema)

const memberParamsValidate = ajv.compile<MemberParams>(memberParamsSchema)

const memberUpdateParamsValidate = ajv.compile<MemberParams>(memberUpdateParamsSchema)

const movieParamsValidate = ajv.compile<MovieParams>(movieParamsSchema)

const movieUpdateParamsValidate = ajv.compile<MovieUpdateParams>(movieUpdateParamsSchema)

const configUpdateParamsValidate = ajv.compile<MMGCSysConfig>(configUpdateSchemas)

export {
	activityParamsValidate,
	memberParamsValidate,
	memberUpdateParamsValidate,
	activityUpdateParamsSchemaValidate,
	movieParamsValidate,
	movieUpdateParamsValidate,
	configUpdateParamsValidate,
	DayParamsSchemaValidate
}
