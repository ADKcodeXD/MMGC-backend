export default abstract class BaseService {
	abstract copyToVo(modelParams: any): any

	copyToVoList(modelList: Array<any>): Array<any> {
		return modelList.map(item => {
			return this.copyToVo(item)
		})
	}
}
