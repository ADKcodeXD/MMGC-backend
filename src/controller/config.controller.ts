import { Body, Controller, GetMapping, PostMapping } from '~/common/decorator/decorator'
import Result from '~/common/result'
import { Config } from '~/model'
import config from '~/config/config.default'
import { MMGCSysConfigEntity } from '~/entity/global'
import { copyProperties } from '~/common/utils'
import { Validtor } from '~/middleware/ajv.middleware'
import { configUpdateParamsValidate } from '~/common/validate/validate'
import { Auth } from '~/common/decorator/auth'

@Controller('/config')
export default class ConfigController {
	@GetMapping('/getConfig')
	async getConfig() {
		const res = await Config.findOne({ configType: config.SYS_CONFIG })
		if (!res) {
			const model = new MMGCSysConfigEntity()
			model.currentActivityId = 2022
			model.skin = ''
			model.isVideoPlay = true
			model.otherSettings = ''
			model.configType = 1
			await new Config(model).save()
			return Result.success(model)
		} else {
			const model = new MMGCSysConfigEntity()
			copyProperties(res, model)
			return Result.success(model)
		}
	}

	@PostMapping('/updateConfig', [Validtor('body', configUpdateParamsValidate)])
	@Auth([ROLE.ADMIN, ROLE.SUBADMIN, ROLE.COMMITTER, ROLE.GROUPMEMBER], '/updateConfig')
	async updateConfig(@Body() body: MMGCSysConfig) {
		if (!body.configType) {
			await Config.updateOne({ configType: config.SYS_CONFIG }, body)
		} else {
			await Config.updateOne({ configType: body.configType }, body)
		}
		return Result.success(null)
	}
}
