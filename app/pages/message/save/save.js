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
            img:""
        }
    },
    onLoad() {
        App.HttpService.getMembers()
            .then(data => {
                console.log(data);
                if (data.rows.length > 0) {
                    this.setData({
                        'members.items': data.rows
                    })
                }
            })
    },
    messageAction(e) {
        let params = {
            memberId:this.data.members.items[this.data.members.index].memberId,
            productName:e.detail.value.title,
            description:e.detail.value.content
        }
        console.log(e);
        App.HttpService.submitOrder(params)
            .then(data => {
                if(data.success){
                    App.WxService.showModal({ title: '成功', content: '提交成功', })
                        .then(data=>{
                            App.WxService.switchTab({url:'/pages/index/index'})
                        })
                }else{
                    App.WxService.showModal({ title: '失败', content: '提交失败' })
                        .then(data=>{
                            App.WxService.switchTab({url:'/pages/index/index'})
                        })
                }
            },data=>{
                App.WxService.showModal({ title: '失败', content: '提交失败' })
                    .then(data=>{
                        App.WxService.switchTab({url:'/pages/index/index'})
                    })
            })

    },
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e)
        this.setData({
            'members.index': e.detail.value
        })
    },
    chooseImage(e){
        let that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                var tempFilePaths = res.tempFilePaths
                that.setData({ 'msg.img': tempFilePaths[0] })
            }
        })
    }
})
