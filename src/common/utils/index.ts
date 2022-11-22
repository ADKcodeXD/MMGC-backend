import crypto from 'node:crypto'

/**
 * 复制对象属性 但是是浅复制 会copy引用 假设sourceObj中没有的键值对 不会复制到targetObj 且targetObj严格匹配sourceObj所拥有的的key且复制
 * @param sourceObj 源复制对象
 * @param targetObj 目标对象
 * @returns 返回一个复制好的对象
 */
export const copyProperties = <T>(sourceObj: NormalObject, targetObj: NormalObject): T => {
	for (const key in sourceObj) {
		if (Object.hasOwnProperty.call(targetObj, key)) {
			targetObj[key] = sourceObj[key]
		}
	}
	return targetObj as T
}
/**
 * 生成一个随机数 符合区间内 为整形
 * @param min 最小数字
 * @param max 最大数字
 * @returns 随机数
 */
export const randomNum = (min: number, max: number): number => {
	return Math.floor(Math.random() * max - min) + min
}

/**
 * 根据config里的数据进行加密
 * @param data 加密数据
 * @param key 使用password以及salt生成的key值
 * @returns string
 */
export const aesEncrypt = (data: string, key: Buffer) => {
	// Defininf iv
	const iv = Buffer.alloc(16, 0)
	const cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
	let crypted = cipher.update(data, 'utf8', 'hex')
	crypted += cipher.final('hex')
	return crypted
}

/**
 * 解密数据
 * @param encrypted 需要解密的数据
 * @param key 使用password以及salt生成的key值
 * @param iv 提前生成好的iv
 * @returns
 */
export const aesDecrypt = (encrypted: string, key: Buffer) => {
	const iv = Buffer.alloc(16, 0)
	const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
	let decrypted = decipher.update(encrypted, 'hex', 'utf8')
	decrypted += decipher.final('utf8')
	return decrypted
}
