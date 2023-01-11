import config from '~/config/config.default'
import { formatTime } from './moment'
import COS from 'cos-nodejs-sdk-v5'
import { v4 as uuidv4 } from 'uuid'

export class CosUtil {
	static cos: COS = new COS({
		SecretId: config.SECRET_ID,
		SecretKey: config.SECRET_KEY
	})
	static isUploading = false
	path = config.COS_BASE_PATH
	videoPath = config.COS_VIDEO_PATH

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

	async uploadVideo(body: Buffer | any, fileName: string) {
		if (CosUtil.isUploading) {
			return null
		}
		CosUtil.isUploading = true
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
		try {
			res = await CosUtil.cos.putObject({
				Bucket: config.BUCKET_NAME || '' /* 填入您自己的存储桶，必须字段 */,
				Region: config.REGION || '' /* 存储桶所在地域，例如ap-beijing，必须字段 */,
				Key: key /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
				Body: body /* 必须 */
			})
		} finally {
			CosUtil.isUploading = false
		}
		if (res.statusCode === 200) {
			return `${config.COS_SERVER_PATH}/${key}`
		}
		return null
	}
}
