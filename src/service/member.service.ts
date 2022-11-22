import { MemberVo, MemberModel } from 'Member'
import { Singleton } from '~/common/decorator/decorator'
import { aesEncrypt, copyProperties } from '~/common/utils'
import { MemberModelEntity, MemberParamsEntity, MemberVoEntity } from '~/entity/member.entity'
import { Member } from '~/model'
import BaseService from './base.service'
import crypto from 'node:crypto'
import config from '~/config/config.default'
import IncrementService from './increment.service'

@Singleton()
export default class MemberService extends BaseService {
	memberModel = Member
	incrementService = IncrementService.getInstance()
	static getInstance() {
		console.log('dont have Singleton')
		return new this()
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

	async findMemberVoByUsername(username: string) {
		const memberModel = await this.memberModel.findOne({ username: username })
		if (memberModel) {
			return this.copyToVo(memberModel)
		}
		return memberModel
	}

	async findMemberByUsername(username: string) {
		const memberModel = await this.memberModel.findOne({ username: username })
		return memberModel
	}

	async findMemberVoByEmail(email: string) {
		const reg = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+[.a-zA-Z]+$/
		if (!reg.test(email)) {
			return null
		}
		const memberModel: MemberModel | null = await this.memberModel.findOne({ email: email })
		if (memberModel) {
			return this.copyToVo(memberModel)
		}
		return memberModel
	}

	async findMemberByToken(memberId: number) {
		const memberModel = await this.memberModel.findOne({ memberId: memberId })
		return memberModel
	}

	async save(memberParams: MemberParamsEntity) {
		const model = new MemberModelEntity()
		model.memberId = await this.incrementService.incrementId('members')
		copyProperties(memberParams, model)

		// 加密密码
		const key = crypto.scryptSync(config.AES_PASSWORD || '', config.AES_SALT || '', 16)
		const password = aesEncrypt(model.password, key)
		model.password = password

		const memDoc = new this.memberModel(model)
		const newMember = await memDoc.save()
		return this.copyToVo(newMember)
	}

	copyToVo(memberModel: MemberModel) {
		const memberVo: MemberVo = new MemberVoEntity()
		copyProperties(memberModel, memberVo)
		return memberVo
	}
}
