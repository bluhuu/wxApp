import Tools from 'Tools'
import es6 from '../assets/plugins/es6-promise'

class Service {
    constructor() {
        this.__init()
    }
    __init() {
    	this.tools = new Tools
    	this.__initDefaults()
    	this.__initMethods()
    }
    __initDefaults() {
        this.noPromiseMethods = [
			'stopRecord',
			'pauseVoice',
			'stopVoice',
			'pauseBackgroundAudio',
			'stopBackgroundAudio',
			'showNavigationBarLoading',
			'hideNavigationBarLoading',
			'createAnimation',
			'createContext',
			'hideKeyboard',
			'stopPullDownRefresh',
		]

		this.instanceSource = {
            method: Object.keys(wx)
        }
    }

    __initMethods() {
        for(let key in this.instanceSource) {
			this.instanceSource[key].forEach((method, index) => {
				this[method] = (...args) => {
					if (this.noPromiseMethods.indexOf(method) !== -1 || method.substr(0, 2) === 'on' || /\w+Sync$/.test(method)) {
						return wx[method](...args)
					}
	                return this.__defaultRequest(method, ...args)
	            }
			})
		}

		this.navigateTo = (url, params) => {
	        const $$url = this.tools.buildUrl(url, params)
	    	return new es6.Promise((resolve, reject) => {
	    		wx.navigateTo({
	    			url: $$url,
					success: res => resolve(res),
		            fail: res => reject(res),
				})
	    	})
	    }

	    this.redirectTo = (url, params) => {
	        const $$url = this.tools.buildUrl(url, params)
	    	return new es6.Promise((resolve, reject) => {
	    		wx.redirectTo({
	    			url: $$url,
					success: res => resolve(res),
		            fail: res => reject(res),
				})
	    	})
	    }
    }

    __defaultRequest(method = '', obj = {}) {
    	return new es6.Promise((resolve, reject) => {
    		obj.success = (res) => resolve(res)
    		obj.fail = (res) => reject(res)
    		wx[method](obj)
    	})
    }
}

export default Service
