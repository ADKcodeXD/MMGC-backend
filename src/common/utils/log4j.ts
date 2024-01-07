import * as log4js from 'log4js'

const levels = {
	trace: log4js.levels.TRACE,
	debug: log4js.levels.DEBUG,
	info: log4js.levels.INFO,
	warn: log4js.levels.WARN,
	error: log4js.levels.ERROR,
	fatal: log4js.levels.FATAL
}

log4js.configure({
	appenders: {
		console: { type: 'console' },
		info: {
			type: 'file',
			filename: 'logs/logs.log'
		},
		error: {
			type: 'dateFile',
			filename: 'logs/log',
			pattern: 'yyyy-MM-dd.log',
			alwaysIncludePattern: true // 设置文件名称为 filename + pattern
		}
	},
	categories: {
		default: { appenders: ['console'], level: 'debug' },
		info: {
			appenders: ['info', 'console'],
			level: 'info'
		},
		error: {
			appenders: ['error', 'console'],
			level: 'error'
		},
		record: {
			appenders: ['info'],
			level: 'info'
		}
	}
})

export default {
	debug: (content: string) => {
		const logger = log4js.getLogger('default')
		logger.level = levels.debug
		logger.info(content)
	},
	error: (content: string) => {
		const logger = log4js.getLogger('error')
		logger.level = levels.error
		logger.error(content) // 使用 error 方法来记录错误日志
	},
	info: (content: string) => {
		const logger = log4js.getLogger('info')
		logger.level = levels.info
		logger.info(content)
	},
	record: (content: string) => {
		const logger = log4js.getLogger('record')
		logger.level = levels.info
		logger.info(content)
	}
}
