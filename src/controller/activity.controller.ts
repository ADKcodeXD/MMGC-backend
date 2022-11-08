import { Context } from 'koa'
import { Body, Controller, Ctx, PostMapping } from '~/common/decorator/decorator'
import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import Result from '~/common/result'
import { Activity } from '~/model/index'
import { ActivityModel, ActivityParams } from 'Activity'
import { copyProperties } from '~/common/utils'

@Controller('/activity')
export default class ActivityController {
	@PostMapping('/saveActivity')
	async save(@Ctx() ctx: Context, @Body() activityParam: ActivityParams) {
		const newActivity: ActivityModel = {
			activityId: 0,
			activityName: { cn: 'a' }
		}
		copyProperties(activityParam, newActivity)
		newActivity['createTime'] = new Date()
		const testModel = new Activity(newActivity)
		testModel.save()
		ctx.body = Result.success(RESULT_CODE.SUCCESS, RESULT_MSG.SUCCESS, null)
	}
}
