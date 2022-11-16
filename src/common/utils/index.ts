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
