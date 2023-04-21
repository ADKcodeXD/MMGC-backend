import { Context } from 'koa'
import { Autowired, Controller, Ctx, GetMapping, PostMapping, Query } from '~/common/decorator/decorator'
import { CosUtil } from '~/common/utils/cosutil'
import fs from 'fs'
import Result from '~/common/result'
import { QiniuUtils } from '~/common/utils/qiniuUtils'
@Controller('/upload')
export default class UploadController {
	cosUtil = new CosUtil()

	@Autowired()
	qiniuUtils!: QiniuUtils

	waitTingQueue = new Set()

	@PostMapping('/uploadImg')
	async uploadImg(@Ctx() ctx: Context) {
		const file = ctx.request.files?.file as any
		const path = file.filepath as string
		const res = await this.qiniuUtils.uploadImg(path, file.originalFilename)
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
				const res = await this.qiniuUtils.uploadVideo(path, file.originalFilename)
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
