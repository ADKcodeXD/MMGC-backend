import { MemberVo, MemberModel, MemberParams } from 'Member'
import { copyProperties } from '~/common/utils'
import { MemberVoEntity } from '~/entity/member.entity'
import { Member, Increment } from '~/model'
import BaseService from './base.service'

export default class MemberService extends BaseService {
	memberModel = Member
	increment = Increment
	static memberServiceSingleInstance: MemberService = new MemberService()

	static getInstance() {
		if (!MemberService.memberServiceSingleInstance) {
			MemberService.memberServiceSingleInstance = new MemberService()
		}
		return MemberService.memberServiceSingleInstance
	}

	async findMemberVoByMemberId(memberId: number) {
		const memberModel = await this.memberModel.findOne({ memberId: memberId })
		if (memberModel) {
			return this.copyToVo(memberModel)
		}
		return null
	}

	async findMemberByMemberId(memberId: number) {
		const memberModel = await this.memberModel.findOne({ memberId: memberId })
		return memberModel
	}

	async findMemberByToken(memberId: number) {
		const memberModel = await this.memberModel.findOne({ memberId: memberId })
		return memberModel
	}

	async save(memberParams: MemberParams) {
		const res = <IncrementType>await this.increment.findOne({ coll: 'members' })
		let id = 0
		if (!res) {
			new this.increment({ coll: 'members', currentValue: 100 }).save()
			id = 100
		} else {
			this.increment.updateOne({ coll: 'members' }, { currentValue: res.currentValue + 1 })
			id = res.currentValue
		}
	}

	copyToVo(memberModel: MemberModel) {
		const memberVo: MemberVo = new MemberVoEntity()
		copyProperties(memberModel, memberVo)
	}
}
