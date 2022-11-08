import mongoose from 'mongoose'
import { ActivityModel } from 'Activity'
export const activitySchema = new mongoose.Schema<ActivityModel>(
	{
		activityBackgroundImg: String,
		activityCM: Array,
		activityCover: String,
		activityId: Number,
		activityLogo: String,
		activityName: {
			cn: String,
			jp: { type: String, default: null },
			en: { type: String, default: null }
		},
		createTime: { type: Date, default: Date.now() },
		days: Number,
		desc: {
			cn: String,
			jp: { type: String, default: null },
			en: { type: String, default: null }
		},
		endTime: String,
		movieNums: Number,
		sponsorId: Array,
		staff: Map,
		startTime: String
	},
	{ collection: 'activities' }
)
