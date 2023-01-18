import mongoose from 'mongoose'
import { activitySchema, memberSchema, incrementSchema, movieSchema, configSchema } from './schema'

const Activity = mongoose.model('Activity', activitySchema)

const Member = mongoose.model('Member', memberSchema)

const Increment = mongoose.model('Increment', incrementSchema)

const Movie = mongoose.model('Movie', movieSchema)

const Config = mongoose.model('Config', configSchema)

export { Activity, Member, Increment, Movie, Config }
