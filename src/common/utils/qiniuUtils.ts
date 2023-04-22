import { v4 as uuidv4 } from 'uuid'
import { Singleton } from '../decorator/decorator'
import config from '~/config/config.default'
import qiniu from 'qiniu'
import { formatTime } from './moment'

@Singleton()
export class QiniuUtils {
	private bucket: string
	private accessKey: string
	private secretKey: string
	private cdnLink: string
	path = config.COS_BASE_PATH
	videoPath = config.COS_VIDEO_PATH

	uploadList = new Map<string, any>()

	constructor() {
		this.accessKey = config.QINIU_ACCESS_KEY || ''
		this.secretKey = config.QINIU_SECRET_KEY || ''
		this.bucket = config.QINIU_BUCKET || ''
		this.cdnLink = config.QINIU_CDN_LINK || ''
	}

	getUptoken() {
		const mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey)
		const putPolicy = new qiniu.rs.PutPolicy({
			scope: this.bucket
		})
		return putPolicy.uploadToken(mac)
	}

	uploadFile(key: string, filePath: string) {
		const uploadToken = this.getUptoken()
		const conf = new qiniu.conf.Config() as any
		// 空间对应的机房
		conf.zone = qiniu.zone.Zone_z2 //华东区
		// 是否使用https域名
		conf.useHttpsDomain = true
		// 上传是否使用cdn加速
		conf.useCdnDomain = true
		const formUploader = new qiniu.form_up.FormUploader(conf)
		const putExtra = new qiniu.form_up.PutExtra()
		return new Promise((reslove, reject) => {
			formUploader.putFile(uploadToken, key, filePath, putExtra, (respErr, respBody, respInfo) => {
				if (respErr) {
					throw respErr
				}
				if (respInfo.statusCode === 200) {
					reslove(respBody)
				} else {
					reject(respBody)
				}
			})
		})
	}

	breakpointUploadVideo(key: string, filePath: string) {
		const uploadToken = this.getUptoken()
		const conf = new qiniu.conf.Config() as any
		// 空间对应的机房
		conf.zone = qiniu.zone.Zone_z2 //华东区
		// 是否使用https域名
		conf.useHttpsDomain = true
		// 上传是否使用cdn加速
		conf.useCdnDomain = true
		const formUploader = new qiniu.resume_up.ResumeUploader(conf)
		const putExtra = new qiniu.resume_up.PutExtra()
		putExtra.fname = key
		putExtra.version = 'v2'
		putExtra.partSize = 10 * 1024 * 1024
		return new Promise((reslove, reject) => {
			formUploader.putFile(uploadToken, key, filePath, putExtra, (respErr, respBody, respInfo) => {
				if (respErr) {
					throw respErr
				}
				if (respInfo.statusCode === 200) {
					reslove(respBody)
				} else {
					reject(respBody)
				}
			})
		})
	}

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

		const res = await this.uploadFile(key, body)
		if (res) {
			return `${config.QINIU_CDN_LINK}/${key}`
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
		try {
			res = await this.breakpointUploadVideo(key, filePath)
		} finally {
			this.uploadList.delete(fileName)
		}
		if (res) {
			return `${config.QINIU_CDN_LINK}/${key}`
		}
		return null
	}
}
