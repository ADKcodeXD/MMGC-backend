import KoaBody from 'koa-body'
import path from 'path'

const body = KoaBody({
	multipart: true, // 支持文件上传
	encoding: 'gzip',
	formidable: {
		uploadDir: path.join(__dirname, 'public/upload/'), // 设置文件上传目录
		keepExtensions: true, // 保持文件的后缀
		maxFieldsSize: 2 * 1024 * 1024 // 文件上传大小
	}
})

export default body
