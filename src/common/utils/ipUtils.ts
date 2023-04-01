import { Context } from 'koa'
import { Singleton } from '../decorator/decorator'

@Singleton()
export class IpUtils {
	private map: Map<string, number>
	constructor() {
		this.map = new Map()
		setInterval(() => {
			this.map.clear()
		}, 1000 * 60 * 60)
	}

	// get 获取请求ip
	public getIp(req: Context): string {
		const ip = req.request.ip
		if (!this.map.has(ip)) {
			this.map.set(ip, 1)
		} else {
			this.map.set(ip, this.map.get(ip) || 0 + 1)
		}
		return ip
	}

	public getIpRequestTimes(ip: string): number {
		if (!ip) return 0
		if (this.map.has(ip)) {
			return this.map.get(ip) || 0
		} else {
			this.map.set(ip, 1)
			return 1
		}
	}

	public getUserAgent(req: Context): string {
		return req.request.header['user-agent'] || ''
	}
}
