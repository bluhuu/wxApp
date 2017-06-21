import __config from '../etc/config'
import WxResource from 'WxResource'

class HttpResource {
    constructor(url, paramDefaults, actions, options) {
        Object.assign(this, { url, paramDefaults, actions, options, })
    }
    init() {
        const resource = new WxResource(this.setUrl(this.url), this.paramDefaults, this.actions, this.options)
        resource.setDefaults({ interceptors: this.setInterceptors() })
        return resource
    }
    setUrl(url) { return `${__config.basePath}${url}` }
    setInterceptors() {
        return [{
            request: (request) => {
                request.header = request.header || {}
                request.requestTimestamp = new Date().getTime()
                if (request.url.indexOf('/elink_scm_purchase') !== -1 && wx.getStorageSync('token')) {
                    request.header.Cookie = 'JSESSIONID=' + wx.getStorageSync('token') + ";"
                }
                wx.showToast({ title: '加载中', icon: 'loading', duration: 10000, mask: !0, })
                return request
            },
            requestError: (requestError) => {
                wx.hideToast()
                return requestError
            },
            response: (response) => {
                response.responseTimestamp = new Date().getTime()
                if(response.data.msg === "会话超时或未登录！") {
                    wx.removeStorageSync('token')
                    wx.redirectTo({ url: '/pages/login/index' })
                }
                wx.hideToast()
                return response
            },
            responseError: (responseError) => {
                wx.hideToast()
                return responseError
            },
        }]
    }
}

export default HttpResource
