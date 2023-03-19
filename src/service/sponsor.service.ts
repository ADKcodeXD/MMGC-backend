import { pageQuery } from '~/common/utils'
// write a service for sponsor

import { SponsorModel, SponsorParams, SponsorUpdateParams } from 'Sponsor'
import { Singleton } from '~/common/decorator/decorator'
import Result from '~/common/result'
import { copyProperties } from '~/common/utils'
import { SponsorModelEntity } from '~/entity/sponsor.entity.'
import { Sponsor } from '~/model'
import BaseService from './base.service'
import IncrementService from './increment.service'
import { formatTime } from '~/common/utils/moment'

@Singleton()
export default class SponsorService extends BaseService {
	static singleton: SponsorService = new SponsorService()

	static getInstance() {
		if (!SponsorService.singleton) {
			SponsorService.singleton = new this()
		}
		return SponsorService.singleton
	}

	sponsorModel = Sponsor
	incrementService = IncrementService.getInstance()

	async findSponsorList(pageParams: PageParams) {
		const res = await pageQuery(pageParams, this.sponsorModel)

		return {
			result: await this.copyToVoList(res.result, false),
			page: res.page,
			total: res.total
		}
	}

	async findSponsorBySponsorId(sponsorId: number) {
		const sponsorModel = await this.sponsorModel.findOne({ sponsorId: sponsorId })
		if (sponsorModel) {
			return this.copyToVo(sponsorModel)
		}
		return null
	}

	async updateSponsor(sponsorParams: SponsorUpdateParams) {
		if (!sponsorParams.sponsorId) {
			return Result.paramsError()
		}
		const model = await this.sponsorModel.findOne({ sponsorId: sponsorParams.sponsorId })
		if (!model) {
			return Result.paramsError()
		}
		const updateModel = new SponsorModelEntity()
		copyProperties(sponsorParams, updateModel)
		const res = await this.sponsorModel.updateOne({ sponsorId: sponsorParams.sponsorId }, updateModel)
		return res || null
	}

	async save(sponsorParams: SponsorParams) {
		const model = new SponsorModelEntity()
		copyProperties(sponsorParams, model)
		model.sponsorId = await this.incrementService.incrementId('sponsors', { model: Sponsor, key: 'sponsorId' })
		model.createTime = Date.now()
		const res = await new Sponsor(model).save()
		return res || null
	}

	async deleteSponsor(sponsorId: number) {
		if (!sponsorId) {
			return null
		}
		const res = await this.sponsorModel.deleteOne({ sponsorId: sponsorId })
		return res || null
	}

	copyToVo(model: SponsorModel) {
		model.createTime = formatTime(model.createTime)
		return model
	}
}
