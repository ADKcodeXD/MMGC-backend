import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import { Context } from 'koa'
import { Controller, Ctx, PostMapping } from '~/common/decorator/decorator'
import { CosUtil } from '~/common/utils/cosutil'
import fs from 'fs'
import Result from '~/common/result'
import { B2Util } from '~/common/utils/b2utils'
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
	b2Util = new B2Util()

	@PostMapping('/uploadImg')
	async uploadImg(@Ctx() ctx: Context) {
		const file = ctx.request.files?.file as any
		const path = file.filepath as string
		const reader = fs.readFileSync(path)
		const res = await this.b2Util.uploadImg(reader, file.originalFilename)
		// 上传成功 将目录下的图片缓存删除
		const stat = fs.statSync(path)
		if (stat.isFile()) {
			fs.unlinkSync(path)
		}
		if (res) return Result.success(res)
		else return Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
	}

	@PostMapping('/uploadVideo')
	async uploadVideo(@Ctx() ctx: Context) {
		const file = ctx.request.files?.file as any
		if (file.size > 200 * 1024 * 1024) {
			return Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
		}
		const path = file.filepath as string

		if (!fs.existsSync(path)) {
			return Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
		}
		if (fs.statSync(path).isFile()) {
			const reader = fs.readFileSync(path)
			try {
				const res = await this.b2Util.uploadVideo(reader, file.originalFilename)
				if (res === RESULT_CODE.TOO_MANY_REQUEST) {
					return Result.fail(RESULT_CODE.TOO_MANY_REQUEST, RESULT_MSG.TOO_MANY_REQUEST, null)
				} else if (res) {
					return Result.success(res)
				} else {
					return Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
				}
			} finally {
				// 上传成功 将目录下的图片缓存删除
				const stat = fs.statSync(path)
				if (stat.isFile()) {
					fs.unlinkSync(path)
				}
			}
		} else {
			return Result.fail(RESULT_CODE.PARAMS_ERROR, RESULT_MSG.PARAMS_ERROR, null)
		}
	}
}
