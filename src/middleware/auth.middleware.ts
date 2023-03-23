import { Context } from 'koa'
import { authList } from '~/common/decorator/auth'
import Result from '~/common/result'
import ContainerInstance from '~/common/utils/container'
import MemberService from '~/service/member.service'

export default async (ctx: Context, next: Function) => {
	const memberService = ContainerInstance.get<MemberService>('MemberService')

	for (const item of authList) {
		const path = `${item.target.constructor.prefix}${item.path}`
		if (ctx.path.indexOf(path) !== -1) {
			let member
			if (ctx.state.user) {
				member = await memberService.findMemberVoByMemberId(ctx.state.user.memberId, true)
			} else {
				member = null
			}
			if (!member) {
				if (!item.allowRoles.includes(ROLE.ALL)) {
					ctx.status = 403
					ctx.body = Result.noAuth()
					return
				}
			} else {
				if (item.allowRoles.includes(ROLE.ALL)) {
					await next()
					return
				}
				if (item.allowRoles.includes((member.role as ROLE) || ROLE.ALL)) {
					await next()
					return
				}
				ctx.status = 403
				ctx.body = Result.noAuth()
				return
			}
		}
	}
	await next()
}
