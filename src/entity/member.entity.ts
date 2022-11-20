import { MemberModel, MemberParams, MemberVo } from 'Member'

export class MemberModelEntity implements MemberModel {
	avatar: string | null = null
	createTime = Date.now()
	desc: string | null = null
	email: string | null = null
	gender: number | null = null
	memberId = NaN
	memberName = ''
	password = ''
	role: string | null = null
	snsSite: Sns | null = null
	username = ''
}

export class MemberVoEntity implements MemberVo {
	memberId = 0
	memberName = ''
	username = ''
	avatar: string | null = null
	desc: string | null = null
	gender: number | null = null
	snsSite: Sns | null = null
}

export class MemberParamsEntity implements MemberParams {
	username = ''
	verifyCode = 0
	memberName = ''
	password = ''
	email = ''
	avatar: string | null = null
	desc: string | null = null
	gender: number | null = null
	snsSite: Sns | null = null
}
