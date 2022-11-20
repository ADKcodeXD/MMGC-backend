import KoaBody from 'koa-body'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const body = KoaBody({
	multipart: true, // 支持文件上传
	// encoding: 'gzip',
	formidable: {
		uploadDir: path.join(process.cwd(), '/public'), // 设置文件上传目录
		keepExtensions: true, // 保持文件的后缀
		maxFieldsSize: 200 * 1024 * 1024,
		filename(name, ext) {
			return `${uuidv4()}.${ext}`
		}
	}
})

export default body
