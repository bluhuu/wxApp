const App = getApp()
Page({
    data: {
        info: {
            realName: "zxy",
            mobile: "15821600339",
            email: "zxy@163.com",
            shortMsg: "zxy123"
        }
    },
    onLoad() {
        this.WxValidate = App.WxValidate({
            realName: {
                required: true,
                minlength: 2,
                maxlength: 10,
            },
            mobile: {
                required: true,
                tel: true,
            },
            email: {
                required: true,
                email: true,
            },
            shortMsg: {
                required: true,
            }
        }, {
            realName: {
                required: '请输入姓名',
            },
            mobile: {
                required: '请输入11位的手机号码',
            },
            email: {
                required: '请输入邮箱',
                email: '请输入有效的电子邮件地址',
            },
            shortMsg: {
                required: '请输入验证码',
            },
        })
        this.WxValidateMobile = App.WxValidate({
            mobile: {
                required: true,
                tel: true,
            }
        }, {
            mobile: {
                required: '请输入11位的手机号码',
            }
        })
    },
    formSubmit(e) {
        let that = this;
        if (e.detail.target.dataset.shortmsg) { // 获取验证码
            if (!this.WxValidateMobile.checkForm(e)) {
                const error = this.WxValidateMobile.errorList[0]
                App.WxService.showModal({
                    title: '提示',
                    content: `${error.msg}`,
                    showCancel: !1,
                })
                return false
            }
            console.log(e);
            App.HttpService.getTelAuthenticode({mobile:e.detail.value.mobile})
            .then(data=>{
                wx.showToast({
                  title: '短信接收中',
                  icon: 'success',
                  duration: 2000
                })
            },data=>{
                App.WxService.showModal({
                    title: '提示',
                    content: "请稍后再试",
                    showCancel: !1,
                })
            })

        } else { //提交用户信息
            if (!this.WxValidate.checkForm(e)) {
                const error = this.WxValidate.errorList[0]
                App.WxService.showModal({
                    title: '提示',
                    content: `${error.msg}`,
                    showCancel: !1,
                })
                return false
            }
            App.HttpService.setUserInfo(e.detail.value)
                .then(data=>{
                    if(data.success){
                        wx.showToast({ title: '成功', icon: 'success', duration: 2000 })
                        that.setData({ info: { realName: "", mobile: "", email: "", shortMsg: "" } })
                    }else{
                        App.WxService.showModal({
                            title: '提示',
                            content: "请稍后再试",
                            showCancel: !1,
                        })
                    }
                },data=>{
                    App.WxService.showModal({
                        title: '提示',
                        content: "请稍后再试",
                        showCancel: !1,
                    })
                })
        }
    }

});
