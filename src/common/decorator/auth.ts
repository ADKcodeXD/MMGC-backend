export interface AuthItem {
	funcName: string
	path: string
	target: any
	allowRoles: Array<ROLE>
}

export const authList: AuthItem[] = []

/**
 * 用于方法上的注解
 * @param allowRole 允许的角色
 * @returns
 */
export const Auth = (allowRoles: Array<ROLE> = [ROLE.GUEST], path = '') => {
	return function (target: any, name: string) {
		const item: AuthItem = {
			funcName: name,
			target: target,
			path: path,
			allowRoles: allowRoles
		}
		authList.push(item)
	}
}
