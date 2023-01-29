import crypto from 'node:crypto'
import BackBlazeB2 from 'backblaze-b2'
import config from '~/config/config.default'
import { formatTime } from './moment'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import Result from '../result'
import { RESULT_CODE } from '~/types/enum'

export class B2Util {
	static b2: BackBlazeB2 = new BackBlazeB2({
		applicationKeyId: config.B2_ID || '',
		applicationKey: config.B2_KEY || ''
	})
	static isUploading = false
	path = config.B2_BASE_PATH
	videoPath = config.B2_VIDEO_PATH

	map = new Map()

	queue = new Set()

	async uploadImg(body: Buffer, fileName: string) {
		// 处理名字
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
		// 处理b2
		await B2Util.b2.authorize()
		const response = await B2Util.b2.getUploadUrl({
			bucketId: config.B2_BUCKET_ID || ''
		})
		const res = await this.smallFileUpload(body, key, response)
		if (parseInt(res) === 200) {
			return `${config.B2_SERVER_PATH}/${key}`
		}
		return null
	}

	async uploadVideo(body: Buffer, fileName: string) {
		if (this.queue.size > 5) {
			return RESULT_CODE.TOO_MANY_REQUEST
		}
		this.queue.add(fileName)
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
		this.map.set(key, 0)
		try {
			// 处理b2
			await B2Util.b2.authorize()
			// 判断大小 默认20M以上分片上传
			if (body.length > 20 * 1024 * 1024) {
				await this.bigFileUpload(body, key)
			} else {
				const response = await B2Util.b2.getUploadUrl({
					bucketId: config.B2_BUCKET_ID || ''
				})
				await this.smallFileUpload(body, key, response)
			}
		} catch (error) {
			return null
		} finally {
			this.queue.delete(fileName)
		}
		return `${config.B2_SERVER_PATH}/${key}`
	}

	async sliceParts(data: Buffer, size: number) {
		const num = Math.ceil(data.length / size)
		const arr = []
		for (let i = 0; i < num; i++) {
			const obj = {
				partsNum: i + 1,
				buf: data.subarray(i * size, i + 1 === num ? data.length : (i + 1) * size)
			}
			arr.push(obj)
		}
		return arr
	}

	uploadParts(parts: Array<{ partsNum: number; buf: Buffer }>, fileId: any) {
		const promises = parts.map(item => {
			return new Promise((resolve, reject) => {
				B2Util.b2
					.getUploadPartUrl({ fileId })
					.then(({ data }) => {
						const uploadURL = data.uploadUrl
						const authToken = data.authorizationToken
						this.uploadPart({
							partNumber: item.partsNum,
							uploadUrl: uploadURL,
							uploadAuthToken: authToken,
							data: item.buf
						})
							.then(res => {
								resolve(res)
							})
							.catch(err => {
								reject(err)
							})
					})
					.catch(reject)
			})
		})

		return Promise.all(promises)
	}

	sha1(buffer: Buffer) {
		const shasum = crypto.createHash('sha1')
		shasum.update(buffer)
		return shasum.digest('hex')
	}

	async bigFileUpload(data: Buffer, key: string) {
		try {
			// 处理大文件上传 获取文件ID
			const { data: initData } = await B2Util.b2.startLargeFile({ bucketId: config.B2_BUCKET_ID || '', fileName: key })
			const fileId = initData.fileId
			// 分片
			const parts = await this.sliceParts(data, 1024 * 1024 * 20)
			// 开始分片上传
			await this.uploadParts(parts, fileId)
			await B2Util.b2.finishLargeFile({
				fileId,
				partSha1Array: parts.map(item => this.sha1(item.buf))
			})
		} catch (error: any) {
			throw new Error(error)
		}
	}

	async smallFileUpload(data: Buffer, key: string, response: any) {
		const { status: _data } = await B2Util.b2.uploadFile({
			uploadUrl: response.data.uploadUrl,
			uploadAuthToken: response.data.authorizationToken,
			fileName: key,
			data: data
		})
		return _data
	}

	async uploadPart(args: { uploadUrl: any; uploadAuthToken: any; contentLength?: any; data: Buffer; partNumber: any; hash?: any }) {
		const options = {
			url: args.uploadUrl,
			method: 'POST',
			headers: {
				Authorization: args.uploadAuthToken,
				'Content-Length': args.contentLength || args.data.byteLength || args.data.length,
				'X-Bz-Part-Number': args.partNumber,
				'X-Bz-Content-Sha1': args.hash || (args.data ? this.sha1(args.data) : null)
			},
			data: args.data,
			maxRedirects: 0
		}
		return await axios({
			...options,
			timeout: 600000 * 2,
			onUploadProgress(progressEvent) {
				// TODO: display upload progress
				// console.log(progressEvent)
			}
		})
	}
}
