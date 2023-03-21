import { Model } from 'mongoose'
import { Service } from '~/common/decorator/decorator'
import { Increment } from '~/model'

@Service(true)
export default class IncrementService {
	increment = Increment

	/**
	 * 获取自增id
	 * @param collection 集合的名字
	 * @param coll 假设需要防止自增id与数据库内的id冲突 需要设置此项
	 */
	async incrementId(collection: string, coll?: { model: Model<any>; key: string }): Promise<number> {
		const res = <IncrementType>await this.increment.findOne({ coll: collection })
		let id = 0
		if (!res) {
			await new this.increment({ coll: collection, currentValue: 100 }).save()
			id = 100
		} else {
			id = res.currentValue
			// 假设有输入详细的coll参数
			if (coll) {
				const hasResult = await coll.model.findOne({ [coll.key]: id })
				if (hasResult) {
					// 获取数据库中最新的数据 以这个数据id+1的为准获取新id
					const newest = await coll.model
						.find({})
						.sort({ [coll.key]: -1 })
						.limit(1)
					id = newest[0][coll.key]
				}
			}
			id = id + 1
			await this.increment.updateOne({ coll: res.coll }, { currentValue: id })
		}
		return id
	}
}
