declare global {
	interface NormalObject {
		[key: string]: string
	}

	interface ControllerRouter {
		url: string
		method: string
		handler: Function
		name?: string
		middleware?: any
		constructor?: Function | any
	}

	interface ParamsMeta {
		name: string
		index: number
		fn: Function
	}
}
export {}
