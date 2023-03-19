import { Context } from 'koa'
import { Controller, Ctx, GetMapping, PostMapping, Query } from '~/common/decorator/decorator'
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

	waitTingQueue = new Set()

	@PostMapping('/uploadImg')
	async uploadImg(@Ctx() ctx: Context) {
		const file = ctx.request.files?.file as any
		const path = file.filepath as string
		const reader = fs.readFileSync(path)
		const res = await this.cosUtil.uploadImg(reader, file.originalFilename)
		// 上传成功 将目录下的图片缓存删除
		const stat = fs.statSync(path)
		if (stat.isFile()) {
			fs.unlinkSync(path)
		}
		if (res) return Result.success(res)
		else return Result.paramsError()
	}

	@PostMapping('/uploadVideo')
	async uploadVideo(@Ctx() ctx: Context) {
		const file = ctx.request.files?.file as any
		if (file.size > 200 * 1024 * 1024) {
			return Result.paramsError()
		}
		const path = file.filepath as string

		if (!fs.existsSync(path)) {
			return Result.paramsError()
		}
		if (fs.statSync(path).isFile()) {
			try {
				const res = await this.cosUtil.uploadVideo(path, file.originalFilename)
				if (res) {
					return Result.success(res)
				}
			} finally {
				if (fs.existsSync(path) && fs.statSync(path).isFile()) {
					fs.unlinkSync(path)
				}
			}
			return Result.paramsError()
		} else {
			return Result.paramsError()
		}
	}

	@GetMapping('/getLoaded')
	async getLoaded(@Query('fileName') fileName: string) {
		if (!fileName) {
			return Result.paramsError()
		}
		const newFileName = decodeURIComponent(fileName)
		const res = this.cosUtil.getBackUploadProgress(newFileName)
		if (res) {
			return Result.success(res)
		} else {
			return Result.dataNotFound()
		}
	}
}
