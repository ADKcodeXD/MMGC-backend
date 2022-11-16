import mongoose from 'mongoose'
import { activitySchema, memberSchema, incrementSchema } from './schema'

const Activity = mongoose.model('Activity', activitySchema)

const Member = mongoose.model('Member', memberSchema)

const Increment = mongoose.model('Increment', incrementSchema)

export { Activity, Member, Increment }
