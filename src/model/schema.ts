import mongoose from 'mongoose'

export const activity = new mongoose.Schema({
	activityId: Number,
	activityName: String,
	createTime: Date,
	sponsorId: String,
	sponsorName: String,
	days: Number,
	movieNums: Number
})
