import config from '~/config/config.default'
import { formatTime } from './moment'
import COS from 'cos-nodejs-sdk-v5'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

export class CosUtil {
	static cos: COS = new COS({
		SecretId: config.SECRET_ID,
		SecretKey: config.SECRET_KEY
	})
	static isUploading = false
	path = config.COS_BASE_PATH
	videoPath = config.COS_VIDEO_PATH

	uploadList = new Map<string, COS.ProgressInfo | null>()

	async uploadImg(body: Buffer | any, fileName: string) {
		const reg = /(png|jpg|gif|jpeg|webp|jfif)$/
		const ext = fileName.split('.')[1] || ''
		if (!reg.test(ext)) {
			return null
		}
		const nameArr = [this.path]
		const date = formatTime(new Date(), 'YYYY-MM')
		nameArr.push(date)
		nameArr.push(`${uuidv4()}.${ext}`)
		const key = nameArr.join('/')
		const res = await CosUtil.cos.putObject({
			Bucket: config.BUCKET_NAME || '' /* 填入您自己的存储桶，必须字段 */,
			Region: config.REGION || '' /* 存储桶所在地域，例如ap-beijing，必须字段 */,
			Key: key /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
			Body: body /* 必须 */
		})
		if (res.statusCode === 200) {
			return `${config.COS_SERVER_PATH}/${key}`
		}
		return null
	}

	async uploadVideo(filePath: string, fileName: string) {
		if (this.uploadList.size > 5) {
			throw new Error('上传对象过多 请稍后重试')
		}
		this.uploadList.set(fileName, null)
		const reg = /(mp4)$/
		const split = fileName.split('.')
		const ext = split[split.length - 1] || ''
		if (!reg.test(ext)) {
			return null
		}
		const nameArr = [this.videoPath]
		const date = formatTime(new Date(), 'YYYY-MM')
		nameArr.push(date)
		nameArr.push(`${uuidv4()}.${ext}`)
		const key = nameArr.join('/')
		let res = null
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this
		try {
			const stream = fs.createReadStream(filePath)
			const file = fs.statSync(filePath)
			res = await CosUtil.cos.putObject({
				Bucket: config.BUCKET_NAME || '' /* 填入您自己的存储桶，必须字段 */,
				Region: config.REGION || '' /* 存储桶所在地域，例如ap-beijing，必须字段 */,
				Key: key /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
				Body: stream /* 必须 */,
				ContentLength: file.size,
				onProgress: function (progressData) {
					that.uploadList.set(fileName, progressData)
				}
			})
		} finally {
			this.uploadList.delete(fileName)
		}
		if (res.statusCode === 200) {
			return `${config.COS_SERVER_PATH}/${key}`
		}
		return null
	}

	getBackUploadProgress(fileName: string) {
		const item = this.uploadList.get(fileName)
		if (item) {
			return {
				progress: (item.percent * 100).toFixed(2)
			}
		} else {
			return null
		}
	}
}
