import mongoose from 'mongoose'
import { activitySchema, memberSchema, incrementSchema, movieSchema, configSchema, daySchema, sponsorSchema, operSchema } from './schema'

const Activity = mongoose.model('Activity', activitySchema)

const Member = mongoose.model('Member', memberSchema)

const Increment = mongoose.model('Increment', incrementSchema)

const Movie = mongoose.model('Movie', movieSchema)

const Config = mongoose.model('Config', configSchema)

const Day = mongoose.model('Day', daySchema)

const Sponsor = mongoose.model('Sponsor', sponsorSchema)

const Oper = mongoose.model('Oper', operSchema)

export { Activity, Member, Increment, Movie, Config, Day, Sponsor, Oper }
