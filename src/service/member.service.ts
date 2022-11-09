import { MemberVo, MemberModel } from 'Member'
import { copyProperties } from '~/common/utils'
import { formatTime } from '~/common/utils/moment'
import { Member } from '~/model'

export default class MemberService {
	memberModel = Member
	static memberServiceSingleInstance: MemberService = new MemberService()

	static getInstance() {
		if (!MemberService.memberServiceSingleInstance) {
			MemberService.memberServiceSingleInstance = new MemberService()
		}
		return MemberService.memberServiceSingleInstance
	}

	async findMemberVoByMemberId(memberId: number) {
		const memberModel = await this.memberModel.findOne({ memberId: memberId })
		return memberModel
	}

	copyToVo(memberModel: MemberModel) {
		const memberVo: MemberVo = <MemberVo>{}
		copyProperties(memberModel, memberVo)
	}
}
