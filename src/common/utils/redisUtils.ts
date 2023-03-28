import Redis from 'ioredis'
import { Singleton } from '../decorator/decorator'
import config from '~/config/config.default'

@Singleton()
export class RedisUtils {
	private redisIntance!: Redis

	constructor() {
		this.redisIntance = new Redis({
			port: parseInt(config.REDIS_PORT || '6379'),
			host: config.REDIS_HOST || '127.0.0.1',
			password: config.REDIS_PASSWORD || '',
			username: config.REDIS_USERNAME || ''
		})
	}

	get<T>(key: string): T {
		return this.redisIntance.get(key) as T
	}

	set(key: string, value: any, time?: number) {
		if (time) {
			return this.redisIntance.set(key, value, 'EX', time)
		}
		return this.redisIntance.set(key, value)
	}

	del(key: string) {
		return this.redisIntance.del(key)
	}

	exists(key: string) {
		return this.redisIntance.exists(key)
	}
}
