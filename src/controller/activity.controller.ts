import { Body, Controller, DeleteMapping, GetMapping, Param, PostMapping, PutMapping, QueryAll } from '~/common/decorator/decorator'
import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import Result from '~/common/result'
import { Activity } from '~/model/index'
import { ActivityModel, ActivityParams, ActivityUpdateParams, ActivityVo } from 'Activity'
import { copyProperties } from '~/common/utils'
import { Validtor } from '~/middleware/ajv.middleware'
import { activityParamsValidate, activityUpdateParamsSchemaValidate } from '~/common/validate/validate'
import ActivityService from '~/service/activity.service'
import { ActivityModelEntity } from '~/entity/activity.entity'

@Controller('/activity')
export default class ActivityController {
	static singletonInstance: ActivityController = new ActivityController()
	static getInstance() {
		if (!ActivityController.singletonInstance) {
			ActivityController.singletonInstance = new this()
		}
		return ActivityController.singletonInstance
	}
	activityService = ActivityService.getInstance()

	@PostMapping('/saveActivity', [Validtor('body', activityParamsValidate)])
	async saveActivity(@Body() activityParam: ActivityParams) {
		const res = await this.activityService.findActivityVoByActivityId(activityParam.activityId)
		if (res) {
			return Result.fail<null>(RESULT_CODE.DATA_REPEAT, RESULT_MSG.DATA_REPEAT, null)
		}
		const newActivity: ActivityModel = new ActivityModelEntity()
		copyProperties(activityParam, newActivity)
		const activityDocument = new Activity(newActivity)
		const { activityId } = await activityDocument.save()
		return Result.success(activityId)
	}

	@GetMapping('/getActivityDetail/:activityId')
	async getActivityDetail(@Param('activityId') activityId: number) {
		if (!activityId) {
			return Result.fail<null>(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
		}
		const res = await this.activityService.findActivityVoByActivityId(activityId)
		if (res) return Result.success<ActivityVo>(res)
		return Result.fail<null>(RESULT_CODE.DATA_NOTFOUND, RESULT_MSG.DATA_NOTFOUND, null)
	}

	@PutMapping('/updateActivity', [Validtor('body', activityUpdateParamsSchemaValidate)])
	async updateActivity(@Body() activityParams: ActivityUpdateParams) {
		if (!activityParams.activityId) {
			return Result.fail<null>(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
		}
		const res = await this.activityService.findActivityVoByActivityId(activityParams.activityId)
		if (!res) {
			return Result.fail<null>(RESULT_CODE.DATA_NOTFOUND, RESULT_MSG.DATA_NOTFOUND, null)
		}
		const updateRes = await this.activityService.updateByActivityId(activityParams)

		if (updateRes) return Result.success<number>(updateRes)
		return Result.fail<null>(RESULT_CODE.DATA_NOTFOUND, RESULT_MSG.DATA_NOTFOUND, null)
	}

	@DeleteMapping('/deleteActivity/:activityId')
	async deleteActivity(@Param('activityId') activityId: number) {
		if (!activityId) {
			return Result.fail<null>(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
		}
		const res = await this.activityService.findActivityVoByActivityId(activityId)
		if (!res) {
			return Result.fail<null>(RESULT_CODE.DATA_NOTFOUND, RESULT_MSG.DATA_NOTFOUND, null)
		}
		await this.activityService.deleteByActivityId(activityId)
		return Result.success<null>(null)
	}

	@GetMapping('/getActivityList')
	async getActivityList(@QueryAll() pageParams: PageParams) {
		const res = await this.activityService.findActivityList(pageParams)
		return Result.success(res)
	}
}
