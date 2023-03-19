import { SponsorModel, SponsorParams } from 'Sponsor'

export class SponsorParamsEntity implements SponsorParams {
	sponsorDesc: I18N | null = null
	sponsorLogo: string | null = null
	sponsorName: I18N | null = null
}

export class SponsorModelEntity implements SponsorModel {
	sponsorId = 0
	sponsorDesc: I18N = {
		cn: ''
	}
	sponsorLogo = ''
	sponsorName: I18N = {
		cn: ''
	}
	createTime: Number | null = new Date().getTime()
}
