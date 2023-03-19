import { Body, Controller, DeleteMapping, GetMapping, Param, PostMapping, PutMapping, Query, QueryAll } from '~/common/decorator/decorator'
import Result from '~/common/result'
import { Activity, Day } from '~/model/index'
import { ActivityModel, ActivityParams, ActivityUpdateParams, ActivityVo, DayModel, DayParams } from 'Activity'
import { copyProperties } from '~/common/utils'
import { Validtor } from '~/middleware/ajv.middleware'
import { activityParamsValidate, activityUpdateParamsSchemaValidate, DayParamsSchemaValidate } from '~/common/validate/validate'
import ActivityService from '~/service/activity.service'
import DayService from '~/service/day.service'
import { ActivityModelEntity, DayParamsEntity } from '~/entity/activity.entity'
import { Auth } from '~/common/decorator/auth'

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
	dayService = DayService.getInstance()

	@PostMapping('/saveActivity', [Validtor('body', activityParamsValidate)])
	@Auth([ROLE.ADMIN, ROLE.SUBADMIN], '/saveActivity')
	async saveActivity(@Body() activityParam: ActivityParams) {
		const res = await this.activityService.findActivityVoByActivityId(activityParam.activityId)
		if (res) {
			return Result.dataNotFound()
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
			return Result.paramsError()
		}
		const res = await this.activityService.findActivityVoByActivityId(activityId)
		if (res) return Result.success<ActivityVo>(res)
		return Result.dataNotFound()
	}

	@PutMapping('/updateActivity', [Validtor('body', activityUpdateParamsSchemaValidate)])
	@Auth([ROLE.ADMIN, ROLE.SUBADMIN, ROLE.COMMITTER, ROLE.GROUPMEMBER], '/updateActivity')
	async updateActivity(@Body() activityParams: ActivityUpdateParams) {
		if (!activityParams.activityId) {
			return Result.paramsError()
		}
		const res = await this.activityService.findActivityVoByActivityId(activityParams.activityId)
		if (!res) {
			return Result.dataNotFound()
		}
		const updateRes = await this.activityService.updateByActivityId(activityParams)

		if (updateRes) return Result.success<number>(updateRes)
		return Result.dataNotFound()
	}

	@DeleteMapping('/deleteActivity/:activityId')
	@Auth([ROLE.ADMIN, ROLE.SUBADMIN], '/deleteActivity')
	async deleteActivity(@Param('activityId') activityId: number) {
		if (!activityId) {
			return Result.paramsError()
		}
		const res = await this.activityService.findActivityVoByActivityId(activityId)
		if (!res) {
			return Result.dataNotFound()
		}
		await this.activityService.deleteByActivityId(activityId)
		return Result.success<null>(null)
	}

	@GetMapping('/getActivityList')
	async getActivityList(@QueryAll() pageParams: PageParams) {
		const res = await this.activityService.findActivityList(pageParams)
		return Result.success(res)
	}

	@PostMapping('/saveDay', [Validtor('body', DayParamsSchemaValidate)])
	@Auth([ROLE.ADMIN, ROLE.SUBADMIN, ROLE.COMMITTER, ROLE.GROUPMEMBER], '/saveDay')
	async saveDay(@Body() dayParams: DayParams) {
		if (!dayParams.day || !dayParams.activityId) {
			return Result.paramsError()
		}
		if (await this.dayService.findDayDetail(dayParams.activityId, dayParams.day)) {
			return Result.dataRepeat()
		}
		const newDay: DayModel = new DayParamsEntity()
		copyProperties(dayParams, newDay)
		const activityDocument = new Day(newDay)
		await activityDocument.save()
		return Result.success(null)
	}

	@GetMapping('/getDays')
	async getDays(@Query('activityId') activityId: number) {
		if (!activityId) {
			return Result.paramsError()
		}
		const res = await this.dayService.findDaysByActivityId(activityId, false)
		if (res) {
			return Result.success(res)
		}
		return Result.dataNotFound()
	}

	@GetMapping('/getDaysAll')
	@Auth([ROLE.ADMIN, ROLE.SUBADMIN, ROLE.COMMITTER, ROLE.GROUPMEMBER], '/getDaysAll')
	async getDaysAll(@Query('activityId') activityId: number) {
		if (!activityId) {
			return Result.paramsError()
		}
		const res = await this.dayService.findDaysByActivityId(activityId, true)
		if (res) {
			return Result.success(res)
		}
		return Result.dataNotFound()
	}

	@PutMapping('/updateDay', [Validtor('body', DayParamsSchemaValidate)])
	@Auth([ROLE.ADMIN, ROLE.SUBADMIN, ROLE.COMMITTER, ROLE.GROUPMEMBER], '/updateDay')
	async updateDay(@Body() dayParams: DayParams) {
		if (!dayParams.activityId) {
			return Result.paramsError()
		}
		await this.dayService.updateDay(dayParams)
		return Result.success(null)
	}

	@DeleteMapping('/deleteDay')
	@Auth([ROLE.ADMIN, ROLE.SUBADMIN, ROLE.COMMITTER, ROLE.GROUPMEMBER], '/deleteDay')
	async deleteDay(@Body() dayParams: { activityId: number; day: number }) {
		if (!dayParams.activityId || !dayParams.day) {
			return Result.paramsError()
		}
		await this.dayService.deleteDay(dayParams)
		return Result.success(null)
	}
}
