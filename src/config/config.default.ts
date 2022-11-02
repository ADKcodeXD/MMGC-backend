import dotEnv from 'dotenv'

const path: NormalObject = {
	default: '.env.development',
	dev: '.env.development',
	prod: '.env.production'
}
const NODE_ENV = process.env.NODE_ENV || 'default'

dotEnv.config({ path: path[NODE_ENV] })

export default process.env
