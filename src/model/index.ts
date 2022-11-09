import mongoose from 'mongoose'
import { activitySchema, memberSchema } from './schema'

const Activity = mongoose.model('Activity', activitySchema)

const Member = mongoose.model('Member', memberSchema)

export { Activity, Member }
