import { Context } from 'koa'
import mongoose from 'mongoose'
import config from '../config/config.default'

export default async (ctx: Context, next: any) => {
	mongoose.connect(`${config.MONGO_PATH}/${config.MONGO_COLLECTION}`, {
		auth: {
			username: config.MONGO_USERNAME || undefined,
			password: config.MONGO_PASSWORD || undefined
		}
	})

	const db = mongoose.connection

	db.on('error', console.error.bind(console, 'connection error:'))
	db.once('open', function () {
		console.log('connected to MongoDB')
	})
	await next()
}
