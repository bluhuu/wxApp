const App = getApp()

Page({
	data: {
		logged: !1,
        remember:!1,
        name:""
	},
    onLoad() {},
    onShow() {
    	const token = App.WxService.getStorageSync('token')
        const remember = App.WxService.getStorageSync('remember')
        const name = App.WxService.getStorageSync('name')
    	this.setData({
    		logged: !!token,
            remember: !!remember,
            name:name
    	})
    	token && setTimeout(this.goIndex, 1500)
    },
    // login() {
    // 	this.signIn(this.goIndex)
    // },
    goIndex() {
    	App.WxService.switchTab({ url: '/pages/index/index' })
    },
	showModal() {
		App.WxService.showModal({
            title: '友情提示',
            content: '获取用户登录状态失败，请重新登录',
            showCancel: !1,
        })
	},
	wechatDecryptData() {
		let code

		App.WxService.login()
		.then(data => {
			console.log('wechatDecryptData', data.code)
			code = data.code
			return App.WxService.getUserInfo()
		})
		.then(data => {
			return App.HttpService.wechatDecryptData({
				encryptedData: data.encryptedData,
				iv: data.iv,
				rawData: data.rawData,
				signature: data.signature,
				code: code,
			})
		})
		.then(data => {
			console.log(data)
		})
	},
	wechatSignIn(cb) {
		if (App.WxService.getStorageSync('token')) return
		App.WxService.login()
		.then(data => {
			console.log('wechatSignIn', data.code)
			return App.HttpService.wechatSignIn({
				code: data.code
			})
		})
		.then(data => {
			console.log('wechatSignIn', data)
			if (data.meta.code == 0) {
				App.WxService.setStorageSync('token', data.data.token)
				cb()
			} else if(data.meta.code == 40029) {
				App.showModal()
			} else {
				App.wechatSignUp(cb)
			}
		})
	},
	wechatSignUp(cb) {
		App.WxService.login()
		.then(data => {
			console.log('wechatSignUp', data.code)
			return App.HttpService.wechatSignUp({
				code: data.code
			})
		})
		.then(data => {
			console.log('wechatSignUp', data)
			if (data.meta.code == 0) {
				App.WxService.setStorageSync('token', data.data.token)
				cb()
			} else if(data.meta.code == 40029) {
				App.showModal()
			}
		})
	},
	// signIn(cb) {
    //     console.log("cb",cb);
	// 	if (App.WxService.getStorageSync('token')) return
	// 	App.HttpService.signIn({
	// 		user: 'zxy',
	// 		password: '123',
	// 	})
	// 	.then(data => {
	// 		console.log(data)
	// 		if (data.success) {
	// 			App.WxService.setStorageSync('token', data.sessionId)
	// 			cb()
	// 		}
	// 	})
	// },
    formSubmit: function(e) {
        if (App.WxService.getStorageSync('token')) return

        if(this.data.remember){
            App.WxService.setStorageSync('name', e.detail.value.user)
        }else{
            wx.removeStorage({key:'name'})
        }

        App.HttpService.signIn(e.detail.value)
            .then(data => {
                if (data.success) {
                    App.WxService.setStorageSync('token', data.sessionId)
                    wx.switchTab({url:"/pages/index/index"})
                }else{
                    App.WxService.showModal({ title: '提示', content: data.msg })
                }
            })
    },
    rememberme(e){
        App.WxService.setStorageSync('remember', !this.data.remember)
        this.setData({remember:!this.data.remember})
    }
})
