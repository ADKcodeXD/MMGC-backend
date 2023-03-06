import { Singleton } from '../decorator/decorator'
import nodemailer from 'nodemailer'
import config from '~/config/config.default'
import { randomNum } from '.'
import logger from '~/common/utils/log4j'

@Singleton()
export class EmailUtil {
	static getInstance() {
		return new this()
	}

	private map = new Map()

	private timeMap = new Map()

	private transporter = nodemailer.createTransport({
		host: config.EMAIL_SMTP_HOST || '',
		port: parseInt(config.EMAIL_SMTP_PORT || '465') || 465,
		secure: true, // use TLS
		tls: {
			// do not fail on invalid certs
			rejectUnauthorized: false
		},
		auth: {
			user: config.EMAIL_USER,
			// 这里密码不是qq密码，是你设置的smtp授权码
			pass: config.EMAIL_PASS
		}
	})

	async sendEmail(email: string) {
		const reg = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+[.a-zA-Z]+$/
		if (!reg.test(email)) {
			throw new Error('邮箱格式错误')
		}
		let code
		if (this.map.has(email)) {
			code = this.map.get(email)
			clearTimeout(this.timeMap.get(email))
		} else {
			code = randomNum(100000, 999999)
		}
		const option = {
			from: `MMGC-邮箱验证服务 MMGC <${config.EMAIL_USER}>`, // sender address
			to: email, // list of receivers
			subject: 'MMGC-登录验证码服务 请查收你的验证码', // Subject line
			html: `<h1>MMGC 邮箱验证服务</h1>
      <p>尊敬的用户你好，您的验证码是 <strong>${code}</strong> </p>
        <p>该验证码10min内有效</p>
        <address>MMGC-黄金祭官网提供</address>
      ` // html body
		}
		try {
			const res = await this.transporter.sendMail(option)
			if (res.messageId) {
				logger.debug(`Send Success: ${code}`)
			}
		} catch (error) {
			throw new Error('邮件发送错误')
		}
		// TODO 解决定时器可能会引起的内存泄漏问题
		const timeFn = setTimeout(() => {
			this.map.delete(email)
			clearTimeout(timeFn)
		}, 1000 * 60 * 10)
		this.timeMap.set(email, timeFn)
		this.map.set(email, code)
		return 'success'
	}

	async verifyCode(email: string, code: number) {
		const reg = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+[.a-zA-Z]+$/
		if (!reg.test(email)) {
			throw new Error('邮箱格式错误')
		}
		if (code > 999999 || code < 100000) {
			throw new Error('验证码格式错误')
		}
		let flag = false
		if (this.map.has(email)) {
			if (this.map.get(email) === code) {
				flag = true
				// 删除定时器
				this.map.delete(email)
				clearTimeout(this.timeMap.get(email))
				this.timeMap.delete(email)
			} else {
				flag = false
			}
		} else {
			throw new Error('请先获取验证码')
		}
		return flag
	}
}
