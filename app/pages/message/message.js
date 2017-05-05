const App = getApp()
Page({
    data: {
        members: {
            index: 1,
            items: []
        },
        msg: {
            title: "",
            content: "",
            img: " "
        }
    },
    onLoad() {
        this.getMembers()
    },
    getMembers(){
        App.HttpService.getMembers()
            .then(data => {
                console.log(data);
                if (data.rows.length > 0) {
                    this.setData({
                        'members.items': data.rows
                    })
                }else{
                    App.WxService.showModal({
                            title: '失败',
                            content: '请稍后再试',
                        })
                }
            },data=>{
                App.WxService.showModal({
                        title: '失败',
                        content: '请稍后再试',
                    })
            })
    },
    messageAction(e) {
        let that = this
        console.log(e);
        let params = {
            memberId: this.data.members.items[this.data.members.index].memberId,
            productName: e.detail.value.title,
            description: e.detail.value.content
        }
        if (this.data.msg.img === " ") {
            App.HttpService.submitOrder(params)
                .then(data => {
                    if (data.success) {
                        App.WxService.showModal({
                                title: '成功',
                                content: '提交成功',
                            })
                            .then(data => {
                                App.WxService.navigateTo("/pages/order/list/index", {
                                    orderStatus: "DFH"
                                })
                            })
                    } else {
                        App.WxService.showModal({
                                title: '失败',
                                content: '提交失败'
                            })
                            .then(data => {
                                App.WxService.switchTab({
                                    url: '/pages/index/index'
                                })
                            })
                    }
                }, data => {
                    App.WxService.showModal({
                            title: '失败',
                            content: '提交失败'
                        })
                        .then(data => {
                            App.WxService.switchTab({
                                url: '/pages/index/index'
                            })
                        })
                })
        } else {
            wx.uploadFile({
                url: App.Config.basePath + "/mPurchaseAction/submitOrder.do",
                filePath: this.data.msg.img,
                name: new Date().getTime() + "",
                header: {
                    Cookie: 'JSESSIONID=' + wx.getStorageSync('token') + ";"
                },
                formData: params,
                success: function(e) {
                    console.log(e);
                    App.WxService.showModal({
                            title: '成功',
                            content: '提交成功',
                        })
                        .then(data => {
                            App.WxService.navigateTo("/pages/order/list/index", {
                                orderStatus: "DFH"
                            })
                        })
                },
                fail: function(e) {
                    console.log(e);
                    App.WxService.showModal({
                            title: '失败',
                            content: e.errMsg
                        })
                        .then(data => {
                            App.WxService.switchTab({
                                url: '/pages/index/index'
                            })
                        })
                },
                complete: function(e) {
                    console.log("图片上传：",e);
                    that.setData({
                        msg: { title: "", content: "", img: " " }
                    })
                }
            })
        }

    },
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e)
        this.setData({
            'members.index': e.detail.value
        })
    },
    chooseImage(e) {
        let that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                var tempFilePaths = res.tempFilePaths
                that.setData({
                    'msg.img': tempFilePaths[0]
                })
            }
        })
    },
    onPullDownRefresh() {
        this.setData({
            msg: { title: "", content: "", img: " " }
        })
        this.getMembers()
        wx.stopPullDownRefresh()
    },
    formReset(e) {
    }
})
