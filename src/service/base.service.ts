export default abstract class BaseService {
	static singletonInstance: BaseService
	static getInstance(): BaseService | null {
		return this.singletonInstance
	}

	abstract copyToVo(modelParams: any): any

	copyToVoList(modelList: Array<any>): Array<any> {
		return modelList.map(item => {
			return this.copyToVo(item)
		})
	}
}
