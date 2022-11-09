import { Context } from 'koa'
import { Body, Controller, Ctx, GetMapping, Param, PostMapping } from '~/common/decorator/decorator'
import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import Result from '~/common/result'
import { Activity } from '~/model/index'
import { ActivityModel, ActivityParams, ActivityVo } from 'Activity'
import { copyProperties } from '~/common/utils'
import { Validtor } from '~/middleware/ajv.middleware'
import { activityParamsValidate } from '~/common/validate/activity.validate'
import ActivityService from '~/service/activity.service'

@Controller('/activity')
export default class ActivityController {
	static activityService = ActivityService.getInstance()

	@PostMapping('/saveActivity', [Validtor('body', activityParamsValidate)])
	async saveActivity(@Body() activityParam: ActivityParams) {
		const res = await ActivityController.activityService.findActivityByActivityId(activityParam.activityId)
		if (res) {
			return Result.fail(RESULT_CODE.DATA_REPEAT, RESULT_MSG.DATA_REPEAT, null)
		}
		const newActivity: ActivityModel = <ActivityModel>{}
		copyProperties(activityParam, newActivity)
		const activityDocument = new Activity(newActivity)
		const { activityId } = await activityDocument.save()
		return Result.success(RESULT_CODE.SUCCESS, RESULT_MSG.SUCCESS, activityId)
	}

	@GetMapping('/getActivityDetail/:activityId')
	async getActivityDetail(@Param('activityId') activityId: number) {
		if (!activityId) {
			return Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
		}
		const res = await ActivityController.activityService.findActivityByActivityId(activityId)
		if (res) return Result.success(RESULT_CODE.SUCCESS, RESULT_MSG.SUCCESS, res)
		return Result.fail(RESULT_CODE.DATA_NOTFOUND, RESULT_MSG.DATA_NOTFOUND, null)
	}
}
