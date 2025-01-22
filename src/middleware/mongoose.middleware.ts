import { Context } from 'koa'
import mongoose from 'mongoose'
import config from '../config/config.default'
import logger from '~/common/utils/log4j'

export default async (ctx: Context, next: any) => {
	mongoose.connect(`${config.MONGO_PATH}/${config.MONGO_COLLECTION}`, {
		auth: {
			username: config.MONGO_USERNAME || undefined,
			password: config.MONGO_PASSWORD || undefined
		}
	})

	const db = mongoose.connection

	db.on('error', () => logger.error('Connected Error'))
	db.once('open', function () {
		logger.info('Connected to MongoDB')
	})
	await next()
}

