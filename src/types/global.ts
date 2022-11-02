declare global {
	interface NormalObject {
		[key: string]: string
	}

	interface ControllerRouter {
		url: string
		method: string
		middleware?: any
		handler?: () => void | any
		constructor?: Function | any
	}
}
export {}
