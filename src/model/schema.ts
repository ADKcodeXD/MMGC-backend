import mongoose from 'mongoose'
import { ActivityModel, DayModel } from 'Activity'
import { MemberModel } from 'Member'
import { MovieModel } from 'Movie'
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
		startTime: { type: Date, default: null },
		timesorother: {
			cn: { type: String, default: null },
			jp: { type: String, default: null },
			en: { type: String, default: null }
		},
		faq: {
			cn: { type: String, default: null },
			jp: { type: String, default: null },
			en: { type: String, default: null }
		},
		rules: {
			cn: { type: String, default: null },
			jp: { type: String, default: null },
			en: { type: String, default: null }
		}
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
		snsSite: { type: Object, default: null },
		desc: { type: String, default: '' },
		gender: { type: Number, default: 1 },
		role: { type: String, default: 'GUEST' }
	},
	{ collection: 'members' }
)

export const movieSchema = new mongoose.Schema<MovieModel>(
	{
		movieId: Number,
		movieCover: String,
		movieName: {
			cn: String,
			jp: { type: String, default: null },
			en: { type: String, default: null }
		},
		movieDesc: {
			cn: String,
			jp: { type: String, default: null },
			en: { type: String, default: null }
		},
		movieLink: {
			bilibili: { type: String, default: null },
			youtube: { type: String, default: null },
			niconico: { type: String, default: null },
			personalWebsite: { type: String, default: null },
			twitter: { type: String, default: null }
		},
		createTime: { type: Number, default: Date.now() },
		moviePlaylink: { type: Object, default: null },
		uploader: { type: Number, default: null },
		movieDownloadLink: { type: Object, default: null },
		authorId: { type: Number, default: null },
		authorName: { type: String, default: null },
		realPublishTime: { type: Date, default: null },
		expectPlayTime: { type: Date, default: null },
		activityId: { type: Number, default: null },
		day: { type: Number, default: null },
		isOrigin: { type: Number, default: 0 },
		likeNums: { type: Number, default: 0 },
		viewNums: { type: Number, default: 0 },
		commentNums: { type: Number, default: 0 },
		pollNums: { type: Number, default: 0 }
	},
	{ collection: 'movies' }
)

export const incrementSchema = new mongoose.Schema<IncrementType>(
	{
		coll: String,
		currentValue: Number
	},
	{ collection: 'increment' }
)

export const configSchema = new mongoose.Schema<MMGCSysConfig>(
	{
		currentActivityId: Number,
		skin: String,
		isVideoPlay: Boolean,
		otherSettings: String,
		configType: String
	},
	{ collection: 'configs' }
)

export const daySchema = new mongoose.Schema<DayModel>(
	{
		activityId: { type: Number, default: null },
		themeCover: { type: String, default: null },
		themeDesc: {
			cn: String,
			jp: { type: String, default: null },
			en: { type: String, default: null }
		},
		themeName: {
			cn: String,
			jp: { type: String, default: null },
			en: { type: String, default: null }
		},
		day: { type: Number, default: 0 },
		isPublic: { type: Boolean, default: true },
		sortIndex: { type: Number, default: 0 }
	},
	{ collection: 'days' }
)
