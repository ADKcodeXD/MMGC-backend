import crypto from 'node:crypto'
import BackBlazeB2 from 'backblaze-b2'
import config from '~/config/config.default'
import { formatTime } from './moment'
import { v4 as uuidv4 } from 'uuid'
import axios, { AxiosProgressEvent } from 'axios'
import { RESULT_CODE } from '~/types/enum'
import { _ } from 'ajv'

export class B2Util {
	static b2: BackBlazeB2 = new BackBlazeB2({
		applicationKeyId: config.B2_ID || '',
		applicationKey: config.B2_KEY || ''
	})
	static isUploading = false
	path = config.B2_BASE_PATH
	videoPath = config.B2_VIDEO_PATH

	map = new Map()

	waitTingQueue = new Map()

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
		if (this.waitTingQueue.size > 5) {
			return RESULT_CODE.TOO_MANY_REQUEST
		}
		if (!this.waitTingQueue.has(fileName)) {
			this.waitTingQueue.set(fileName, {
				total: body.length,
				loaded: 0,
				progress: 0,
				key: '',
				parts: [],
				id: null,
				source: axios.CancelToken.source(),
				loadedParts: null
			})
		} else {
			try {
				// 可能是 上次没传完 重新传的 终止
				const result = await this.cancelLargeFile(this.waitTingQueue.get(fileName))

				if (Array.isArray(result)) {
					// 重新走上传流程 区别在于 已经有了上传好的分片
					const item = this.waitTingQueue.get(fileName)
					item.loadedParts = result
					this.waitTingQueue.set(fileName, item)
				} else if (result) {
					// 秒传
					this.waitTingQueue.delete(fileName)
					return `${config.B2_SERVER_PATH}/${result.fileName}`
				} else {
					this.waitTingQueue.set(fileName, {
						total: body.length,
						loaded: 0,
						progress: 0,
						parts: [],
						key: '',
						id: null,
						source: axios.CancelToken.source(),
						loadedParts: null
					})
				}
			} catch (error) {
				this.waitTingQueue.delete(fileName)
				return null
			}
		}
		const reg = /(mp4)$/
		const split = fileName.split('.')
		const ext = split[split.length - 1] || ''
		if (!reg.test(ext)) {
			return null
		}
		let key = ''
		const item = this.waitTingQueue.get(fileName)
		if (!item.key) {
			key = this.getRandomUuidName(fileName)
			item.key = key
			this.waitTingQueue.set(fileName, item)
		} else {
			key = item.key
		}
		try {
			// 处理b2
			await B2Util.b2.authorize()
			// 判断大小 默认20M以上分片上传
			if (body.length > 20 * 1024 * 1024) {
				await this.bigFileUpload(body, key, fileName)
			} else {
				const response = await B2Util.b2.getUploadUrl({
					bucketId: config.B2_BUCKET_ID || ''
				})
				await this.smallFileUpload(body, key, response)
			}
		} catch (error) {
			return null
		} finally {
			this.waitTingQueue.delete(fileName)
		}
		return `${config.B2_SERVER_PATH}/${key}`
	}

	async bigFileUpload(data: Buffer, key: string, fileName: string) {
		try {
			// 处理大文件上传 获取文件ID
			const item = this.waitTingQueue.get(fileName)
			if (!item.id) {
				const { data: initData } = await B2Util.b2.startLargeFile({ bucketId: config.B2_BUCKET_ID || '', fileName: key })
				const fileId = initData.fileId
				item.id = fileId
				this.waitTingQueue.set(fileName, item)
			}
			// 分片
			const parts = await this.sliceParts(data, 1024 * 1024 * 20, fileName)
			// 开始分片上传
			await this.uploadParts(parts, item.id, fileName)
			await B2Util.b2.finishLargeFile({
				fileId: item.id,
				partSha1Array: parts.map(item => this.sha1(item.buf))
			})
		} catch (error: any) {
			throw new Error(error)
		}
	}

	async sliceParts(data: Buffer, size: number, fileName: string) {
		const num = Math.ceil(data.length / size)
		const arr = []
		const item = this.waitTingQueue.get(fileName)
		for (let i = 0; i < num; i++) {
			const obj = {
				partsNum: i + 1,
				buf: data.subarray(i * size, i + 1 === num ? data.length : (i + 1) * size)
			}
			arr.push(obj)
			// 如果当前parts拥有分片 则开启分片上传
			if (!(item.parts.length >= num)) item.parts.push({ loaded: 0, total: i + 1 === num ? data.length - i * size : size, progress: 0 })
		}
		this.waitTingQueue.set(fileName, item)
		return arr
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

	async uploadPart(args: any, fileName: string) {
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
		const item = this.waitTingQueue.get(fileName)
		const progressFn = (progressEvent: AxiosProgressEvent) => {
			const loaded = progressEvent.loaded
			if (item && item.parts.length > 0) {
				const currentParts = item.parts[args.partNumber - 1]
				currentParts.loaded = loaded
				currentParts.progress = (currentParts.loaded / currentParts.total) * 100
				item.loaded = item.parts.reduce((progress: any, item: any) => item.loaded + progress, 0)
				item.progress = ((item.loaded / item.total) * 100).toFixed(2)
				this.waitTingQueue.set(fileName, item)
			} else {
				throw new Error('abort upload')
			}
		}
		return await axios({
			...options,
			timeout: 600000 * 60,
			onUploadProgress: progressFn,
			cancelToken: item.source.token
		})
	}

	getRandomUuidName(fileName: string) {
		const split = fileName.split('.')
		const ext = split[split.length - 1] || ''
		const nameArr = [this.videoPath]
		const date = formatTime(new Date(), 'YYYY-MM')
		nameArr.push(date)
		nameArr.push(`${uuidv4()}.${ext}`)
		const key = nameArr.join('/')
		return key
	}

	getBackUploadProgress(fileName: string) {
		if (this.waitTingQueue.has(fileName)) {
			return this.waitTingQueue.get(fileName)
		} else {
			return null
		}
	}

	uploadParts(parts: Array<{ partsNum: number; buf: Buffer }>, fileId: any, fileName: string) {
		const promises = parts
			.map(item => {
				const cacheItem = this.waitTingQueue.get(fileName)
				if (cacheItem.loadedParts) {
					const part = cacheItem.loadedParts.find((part: any) => part.partNumber === item.partsNum)
					if (part) {
						cacheItem.parts[item.partsNum - 1].loaded = cacheItem.parts[item.partsNum - 1].total
						return null
					}
				}
				return new Promise((resolve, reject) => {
					B2Util.b2
						.getUploadPartUrl({ fileId })
						.then(({ data }) => {
							const uploadURL = data.uploadUrl
							const authToken = data.authorizationToken
							this.uploadPart(
								{
									partNumber: item.partsNum,
									uploadUrl: uploadURL,
									uploadAuthToken: authToken,
									data: item.buf
								},
								fileName
							)
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
			.filter(item => item)
		return new Promise((resolve, reject) => {
			Promise.all(promises)
				.then(res => {
					resolve(res)
				})
				.catch(err => {
					reject(err)
				})
		})
	}

	sha1(buffer: Buffer) {
		const shasum = crypto.createHash('sha1')
		shasum.update(buffer)
		return shasum.digest('hex')
	}

	async cancelLargeFile(item: any) {
		if (item.id) {
			await B2Util.b2.authorize()
			try {
				const { data } = await B2Util.b2.getFileInfo({ fileId: item.id })
				return data
			} catch (error) {
				if (item.source) {
					item.source.cancel('reject axios')
				}
				item.source = axios.CancelToken.source()
				const { data } = await B2Util.b2.listParts({ fileId: item.id, startPartNumber: 1, maxPartCount: 100 })
				// 获取已经上传了的分片
				return data.parts
			}
		}
		return null
	}
}
