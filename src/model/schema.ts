import mongoose from 'mongoose'
import { ActivityModel } from 'Activity'
import { MemberModel } from 'Member'
export const activitySchema = new mongoose.Schema<ActivityModel>(
	{
		activityBackgroundImg: { type: String, default: null },
		activityCM: { type: Array, default: null },
		activityCover: String,
		activityId: Number,
		activityLogo: String,
		activityName: {
			cn: String,
			jp: { type: String, default: null },
			en: { type: String, default: null }
		},
		createTime: { type: Date, default: Date.now() },
		days: { type: Number, default: null },
		desc: {
			cn: String,
			jp: { type: String, default: null },
			en: { type: String, default: null }
		},
		endTime: { type: Date, default: null },
		movieNums: { type: Number, default: 0 },
		sponsorId: { type: Array, default: [] },
		staff: { type: Map, default: null },
		startTime: { type: Date, default: null }
	},
	{ collection: 'activities' }
)

export const memberSchema = new mongoose.Schema<MemberModel>(
	{
		username: String,
		password: String,
		memberName: String,
		memberId: Number,
		email: String,
		createTime: { type: Number, default: Date.now() },
		avatar: { type: String, default: null },
		snsSite: { type: Map, default: null },
		desc: { type: String, default: '' },
		gender: { type: Number, default: 1 },
		role: { type: String, default: 'GUEST' }
	},
	{ collection: 'members' }
)
