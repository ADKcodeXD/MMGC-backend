import { Context } from 'koa'
import { Body, Controller, Ctx, GetMapping, Param, PostMapping } from '~/common/decorator/decorator'
import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import Result from '~/common/result'
import { Activity } from '~/model/index'
import { ActivityModel, ActivityParams } from 'Activity'
import { copyProperties } from '~/common/utils'
import { Validtor } from '~/middleware/ajv.middleware'
import { activityParamsValidate } from '~/common/validate/activity.validate'
import ActivityService from '~/service/activity.service'

@Controller('/activity')
export default class ActivityController {
	/**
	 * 新建活动接口 需要注意 activity的id需要自己创建
	 * @param ctx
	 * @param activityParam ActivityParams类型
	 */
	@PostMapping('/saveActivity', [Validtor('body', activityParamsValidate)])
	async saveActivity(@Ctx() ctx: Context, @Body() activityParam: ActivityParams) {
		const activityService = ActivityService.getInstance()
		const res = await activityService.findActivityByActivityId(activityParam.activityId)
		if (res) {
			ctx.body = Result.fail(RESULT_CODE.DATA_REPEAT, RESULT_MSG.DATA_REPEAT, null)
		}
		const newActivity: ActivityModel | any = {}
		copyProperties(activityParam, newActivity)
		const activityDocument = new Activity(newActivity)
		const { activityId } = await activityDocument.save()
		ctx.body = Result.success(RESULT_CODE.SUCCESS, RESULT_MSG.SUCCESS, activityId)
	}

	/**
	 * 根据activityId 获取相对应的实体类
	 * @param ctx
	 * @param activityId
	 */
	@GetMapping('/getActivityDetail/:activityId')
	async getActivityDetail(@Ctx() ctx: Context, @Param('activityId') activityId: number) {
		if (!activityId) {
			ctx.body = Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
		}
		const activityService = ActivityService.getInstance()
		const res = await activityService.findActivityByActivityId(activityId)
		if (res) ctx.body = Result.success(RESULT_CODE.SUCCESS, RESULT_MSG.SUCCESS, res)
		else ctx.body = Result.fail(RESULT_CODE.DATA_NOTFOUND, RESULT_MSG.DATA_NOTFOUND, null)
	}
}
