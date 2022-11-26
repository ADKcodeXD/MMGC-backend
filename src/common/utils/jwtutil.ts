import jwt from 'jsonwebtoken'
import { MemberVo } from 'Member'

export const createJsonWebToken = (payload: string | MemberVo | Object | any, secret: string, expireTime: number) => {
	const obj = { ...payload }
	const token = jwt.sign(obj, secret, {
		expiresIn: expireTime
	})
	return token
}

export const verifyToken = (token: string, secret: string) => {
	const payLoad = jwt.verify(token, secret)
	return payLoad
}
