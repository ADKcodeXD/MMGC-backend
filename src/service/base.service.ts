export default abstract class BaseService {
	abstract copyToVo(modelParams: any, ...args: any[]): any

	async copyToVoList(modelList: Array<any>, ...args: any[]): Promise<any[]> {
		const itemList: any[] = []
		for await (const item of modelList) {
			const res = await this.copyToVo(item, ...args)
			itemList.push(res)
		}
		return itemList
	}
}
