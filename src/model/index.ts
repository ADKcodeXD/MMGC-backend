import mongoose from 'mongoose'
import { activity } from './schema'

const Activity = mongoose.model('Activity', activity)

export { Activity }
