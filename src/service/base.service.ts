export default abstract class BaseService {
	abstract copyToVo(modelParams: any, ...args: any[]): any

	copyToVoList(modelList: Array<any>, ...args: any[]): Array<any> {
		return modelList.map(item => {
			return this.copyToVo(item, args)
		})
	}
}
