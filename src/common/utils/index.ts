/**
 * 复制对象属性 但是是浅复制 会copy引用
 * @param sourceObj 源复制对象
 * @param targetObj 目标对象
 * @returns 返回一个复制好的对象
 */
export const copyProperties = (sourceObj: NormalObject, targetObj: NormalObject): NormalObject => {
	for (const key in sourceObj) {
		if (Object.prototype.hasOwnProperty.call(sourceObj, key)) {
			targetObj[key] = sourceObj[key]
		}
	}
	return targetObj
}
