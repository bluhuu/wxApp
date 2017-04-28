const App = getApp()

Page({
    data: {
        assent: !1
    },
    onLoad() {
        this.WxValidate = App.WxValidate({
            userName: {
                required: true,
                minlength: 3,
            },
            password: {
                required: true,
                minlength: 6,
                maxlength: 16,
            },
            confirmPasd: {
                required: true,
                equalTo: 'password',
                minlength: 6,
                maxlength: 16,
            },
        }, {
            userName: {
                required: '请输入用户名',
            },
            password: {
                required: '请输入6-16位数字字母组合密码',
            },
            confirmPasd: {
                required: '请输入确认密码',
            },
        })
    },
    onShow() {},
    goIndex() {
        App.WxService.switchTab({
            url: '/pages/index/index'
        })
    },
    formSubmit(e) {
        if (!this.WxValidate.checkForm(e)) {
            const error = this.WxValidate.errorList[0]
            App.WxService.showModal({
                title: '提示',
                content: `${error.msg}`,
                showCancel: !1,
            })
            return false
        }
        wx.request({
            url: App.Config.basePath + '/mCenterAction/registerPerson.do',
            data: e.detail.value,
            header: { 'content-type': 'application/json' },
            success: function(res) {
                if(res.success){
                    App.WxService.showModal({
                        title:'提示',
                        content: "注册成功",
                        showCancel: !1,
                    }).then(data=>{
                        App.WxService.navigateTo('/pages/login/index')
                    })
                }else{
                    App.WxService.showModal({
                        title:'失败',
                        content: res.data.msg || "注册失败，请重试！",
                        showCancel: !1,
                    })
                }
            },
            fail: function(res) {
                App.WxService.showModal({
                    title:'提示',
                    content: "注册失败，请重试！",
                    showCancel: !1,
                })
            },
            complete: function(res) {
                console.log("-----------complete-------------");
                console.log(res)
            },
        })
    },
    assent(e) {
        this.setData({
            assent: !this.data.assent
        })
    }
})
