import { Context } from 'koa'
import { Controller, RequestMapping } from '~/common/decorator/decorator'
import { REQUEST_METHOD, RESULT_CODE, RESULT_MSG } from '~/types/enum'
import Result from '~/vo/result'
import { Activity } from '~/model/index'

@Controller('/activity')
export default class ActivityController {
	@RequestMapping({ url: '/save', method: REQUEST_METHOD.GET })
	async save(ctx: Context) {
		const activity: Activity = {
			activityId: 2022,
			activityName: 'ceshi',
			createTime: new Date(),
			sponsorId: '123',
			sponsorName: 'nihao',
			days: 10,
			movieNums: 50
		}
		const testModel = new Activity(activity)
		testModel.save()
		ctx.body = Result.success(RESULT_CODE.SUCCESS, RESULT_MSG.SUCCESS, null)
	}
}
