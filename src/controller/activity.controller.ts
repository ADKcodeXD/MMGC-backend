import { Context } from 'koa'
import { Body, Controller, Ctx, PostMapping } from '~/common/decorator/decorator'
import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import Result from '~/common/result'
import { Activity } from '~/model/index'
import { ActivityModel, ActivityParams } from 'Activity'
import { copyProperties } from '~/common/utils'
import { Validtor } from '~/middleware/ajv.middleware'
import { activityParamsValidate } from '~/common/validate/Activity'

@Controller('/activity')
export default class ActivityController {
	@PostMapping('/saveActivity', [Validtor('body', activityParamsValidate)])
	async saveActivity(@Ctx() ctx: Context, @Body() activityParam: ActivityParams) {
		const newActivity: ActivityModel | any = {}
		copyProperties(activityParam, newActivity)
		newActivity['createTime'] = new Date()
		const testModel = new Activity(newActivity)
		const { activityId } = await testModel.save()
		ctx.body = Result.success(RESULT_CODE.SUCCESS, RESULT_MSG.SUCCESS, activityId)
	}
}
