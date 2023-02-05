import mongoose from 'mongoose'
import { activitySchema, memberSchema, incrementSchema, movieSchema, configSchema, daySchema } from './schema'

const Activity = mongoose.model('Activity', activitySchema)

const Member = mongoose.model('Member', memberSchema)

const Increment = mongoose.model('Increment', incrementSchema)

const Movie = mongoose.model('Movie', movieSchema)

const Config = mongoose.model('Config', configSchema)

const Day = mongoose.model('Day', daySchema)

export { Activity, Member, Increment, Movie, Config, Day }
