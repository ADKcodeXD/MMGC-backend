import { Singleton } from '~/common/decorator/decorator'
import { Increment } from '~/model'

@Singleton()
export default class IncrementService {
	static getInstance() {
		console.log('dont have Singleton')
		return new this()
	}

	increment = Increment

	/**
	 * 获取自增id
	 * @param collection 集合的名字
	 */
	async incrementId(collection: string): Promise<number> {
		const res = <IncrementType>await this.increment.findOne({ coll: collection })
		let id = 0
		if (!res) {
			await new this.increment({ coll: collection, currentValue: 100 }).save()
			id = 100
		} else {
			await this.increment.updateOne({ coll: res.coll }, { currentValue: res.currentValue + 1 })
			id = res.currentValue
		}

		return id
	}
}
