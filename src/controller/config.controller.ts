import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import { Body, Controller, GetMapping, PostMapping } from '~/common/decorator/decorator'
import Result from '~/common/result'
import { Config } from '~/model'
import config from '~/config/config.default'
import { MMGCSysConfigEntity } from '~/entity/global'
import { copyProperties } from '~/common/utils'
import { Validtor } from '~/middleware/ajv.middleware'
import { configUpdateParamsValidate } from '~/common/validate/validate'

@Controller('/config')
export default class ConfigController {
	static singletonInstance: ConfigController = new ConfigController()
	static getInstance() {
		if (!ConfigController.singletonInstance) {
			ConfigController.singletonInstance = new this()
		}
		return ConfigController.singletonInstance
	}

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
	async updateConfig(@Body() body: MMGCSysConfig) {
		if (!body.configType) {
			await Config.updateOne({ configType: config.SYS_CONFIG }, body)
		} else {
			await Config.updateOne({ configType: body.configType }, body)
		}
		Result.success(null)
	}
}
