import mongoose from 'mongoose'
import { activitySchema } from './schema'

const Activity = mongoose.model('Activity', activitySchema)

export { Activity }
