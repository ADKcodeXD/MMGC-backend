import mongoose from 'mongoose'
import { ActivityModel } from 'Activity'
export const activity = new mongoose.Schema<ActivityModel>({
	activityBackgroundImg: String,
	activityCM: Array,
	activityCover: String,
	activityId: Number,
	activityLogo: String,
	activityName: Map,
	createTime: Date,
	days: Number,
	desc: Map,
	endTime: String,
	movieNums: Number,
	sponsorId: Array,
	staff: Map,
	startTime: String
})
