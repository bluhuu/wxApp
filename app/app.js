import polyfill from 'assets/plugins/polyfill'
import WxValidate from 'helpers/WxValidate'
import HttpResource from 'helpers/HttpResource'
import HttpService from 'helpers/HttpService'
import WxService from 'helpers/WxService'
import Tools from 'helpers/Tools'
import Config from 'etc/config'

App({
	onLaunch() {
		console.log('onLaunch')
	},
	onShow() {
		console.log('onShow')
	},
	onHide() {
		console.log('onHide')
	},
	getUserInfo() {
		return this.WxService.login()
		.then(data => {
			console.log(data)
			return this.WxService.getUserInfo()
		})
		.then(data => {
			console.log(data)
			this.globalData.userInfo = data.userInfo
			return this.globalData.userInfo
		})
	},
	globalData: {
		userInfo: null
	},
	renderImage(path) {
        if (!path) return ''
        if (path.indexOf('http') !== -1) return path
        return `${this.Config.fileBasePath}${path}`
    },
	WxValidate: (rules, messages) => new WxValidate(rules, messages),
	HttpResource: (url, paramDefaults, actions, options) => new HttpResource(url, paramDefaults, actions, options).init(),
	HttpService: new HttpService,
	WxService: new WxService,
	Tools: new Tools,
	Config: Config,
})

// App({
//     onLaunch: function() {
//         console.log('App Launch');
//         //调用API从本地缓存中获取数据
//         var logs = wx.getStorageSync('logs') || [];
//         logs.unshift(Date.now());
//         wx.setStorageSync('logs', logs);
//         //
//     },
//     getUserInfo: function(cb) {
//         var that = this;
//         if (this.globalData.userInfo) {
//             typeof cb == "function" && cb(this.globalData.userInfo);
//         } else {
//             //调用登录接口
//             wx.login({
//                 success: function() {
//                     wx.getUserInfo({
//                         success: function(res) {
//                             that.globalData.userInfo = res.userInfo;
//                             typeof cb == "function" && cb(that.globalData.userInfo);
//                         }
//                     });
//                 }
//             });
//         }
//     },
//     onShow: function() {
//         console.log('App Show');
//     },
//     onHide: function() {
//         console.log('App Hide');
//     },
//     globalData: {
//         userInfo: null
//     }
// });
