// @libs/di/Container.ts
class Container {
	private ContainerMap = new Map<string | symbol, any>()

	public set = (id: string | symbol, value: any): void => {
		this.ContainerMap.set(id, value)
	}

	public get = <T>(id: string | symbol): T => {
		return this.ContainerMap.get(id) as T
	}

	public has = (id: string | symbol): Boolean => {
		return this.ContainerMap.has(id)
	}
}

const ContainerInstance = new Container()
export default ContainerInstance
