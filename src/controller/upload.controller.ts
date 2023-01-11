import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import { Context } from 'koa'
import { Controller, Ctx, PostMapping } from '~/common/decorator/decorator'
import { CosUtil } from '~/common/utils/cosutil'
import fs from 'fs'
import Result from '~/common/result'

@Controller('/upload')
export default class UploadController {
	static singletonInstance: UploadController = new UploadController()
	static getInstance() {
		if (!UploadController.singletonInstance) {
			UploadController.singletonInstance = new UploadController()
		}
		return UploadController.singletonInstance
	}

	cosUtil = new CosUtil()

	@PostMapping('/uploadImg')
	async uploadImg(@Ctx() ctx: Context) {
		const file = ctx.request.files?.file as any
		const path = file.filepath as string
		const reader = fs.createReadStream(path)
		const res = await this.cosUtil.uploadImg(reader, file.originalFilename)
		// 上传成功 将目录下的图片缓存删除
		const stat = fs.statSync(path)
		if (stat.isFile()) {
			fs.unlinkSync(path)
		}
		if (res) return Result.success(RESULT_CODE.SUCCESS, RESULT_MSG.SUCCESS, res)
		else return Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
	}

	@PostMapping('/uploadVideo')
	async uploadVideo(@Ctx() ctx: Context) {
		const file = ctx.request.files?.file as any
		if (file.size > 150 * 1024 * 1024) {
			return Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
		}
		const path = file.filepath as string

		if (!fs.existsSync(path)) {
			return Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
		}
		if (fs.statSync(path).isFile()) {
			const reader = fs.createReadStream(path)
			const res = await this.cosUtil.uploadVideo(reader, file.originalFilename)
			// 上传成功 将目录下的图片缓存删除
			const stat = fs.statSync(path)
			if (stat.isFile()) {
				fs.unlinkSync(path)
			}
			if (res) return Result.success(RESULT_CODE.SUCCESS, RESULT_MSG.SUCCESS, res)
		} else {
			return Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
		}
	}
}
