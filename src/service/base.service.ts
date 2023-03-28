export default abstract class BaseService {
	abstract copyToVo(modelParams: any, ...args: any[]): any

	async copyToVoList<T, V>(modelList: Array<T>, ...args: any[]): Promise<V[]> {
		const itemList: V[] = []
		for await (const item of modelList) {
			const res = await this.copyToVo(item, ...args)
			itemList.push(res)
		}
		return itemList
	}
}
