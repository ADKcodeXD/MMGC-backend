import { MemberVo, MemberModel } from 'Member'
import { Singleton } from '~/common/decorator/decorator'
import { aesEncrypt, copyProperties, pageQuery } from '~/common/utils'
import { MemberModelEntity, MemberParamsEntity, MemberVoEntity } from '~/entity/member.entity'
import { Member } from '~/model'
import BaseService from './base.service'
import crypto from 'node:crypto'
import config from '~/config/config.default'
import IncrementService from './increment.service'
import { formatTime } from '~/common/utils/moment'

@Singleton()
export default class MemberService extends BaseService {
	memberModel = Member
	incrementService = IncrementService.getInstance()
	static getInstance() {
		console.log('dont have Singleton')
		return new this()
	}

	async findMemberVoByMemberId(memberId: number, needDetail = false) {
		const memberModel = await this.memberModel.findOne({ memberId: memberId })
		if (memberModel) {
			return this.copyToVo(memberModel, needDetail)
		}
		return null
	}

	async findMemberVoListByMemberIds(memberIds: number[], needDetail = false) {
		const memberList = await this.memberModel.find({ memberId: { $in: memberIds } })
		if (memberList) {
			return this.copyToVoList(memberList, needDetail)
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

	/**
	 * 默认会过滤掉memberVo里的role
	 * @param pageParams
	 * @param needRole 假设需要role 则传true
	 * @returns
	 */
	async findMemberList(pageParams: PageParams, needRole = false) {
		let filter = {}
		if (pageParams.keyword) {
			const reg = new RegExp(pageParams.keyword, 'i')
			filter = {
				$or: [{ memberName: { $regex: reg } }]
			}
		}
		const res = await pageQuery(pageParams, this.memberModel, filter)
		return {
			result: await this.copyToVoList(res.result, needRole),
			page: res.page,
			total: res.total
		}
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
		return this.copyToVo(newMember, true)
	}

	async batchDelete(memberIds: Array<number>) {
		await this.memberModel.deleteMany({ memberId: { $in: memberIds } })
		return true
	}

	async updateUser(memberParams: MemberVo) {
		if (!memberParams.memberId) {
			return false
		}
		const res = await this.findMemberByUsername(memberParams.username)
		if (res && res?.memberId !== memberParams.memberId) {
			return false
		}
		delete memberParams.createTime
		await this.memberModel.updateOne({ memberId: memberParams.memberId }, memberParams)
		return true
	}

	async addMember(memberParams: MemberVo) {
		const newMember = new MemberModelEntity()

		copyProperties(memberParams, newMember)

		const key = crypto.scryptSync(config.AES_PASSWORD || '', config.AES_SALT || '', 16)
		const password = aesEncrypt(newMember.password, key)
		newMember.password = password

		newMember.memberId = await this.incrementService.incrementId('members')
		const res = await this.memberModel.create(newMember)
		return this.copyToVo(res, true)
	}

	copyToVo(memberModel: MemberModel, needDetail = true) {
		const memberVo: MemberVo = new MemberVoEntity()
		copyProperties(memberModel, memberVo)
		if (!needDetail) {
			memberVo.role = null
			memberVo.email = null
			memberVo.createTime = null
		}
		memberVo.createTime = formatTime(memberVo.createTime || '')
		return memberVo
	}
}
