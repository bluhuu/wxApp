const App = getApp()

Page({
    data: {
        hidden: !0,
        index: 0,
        members: { index: 1, items: [] },
        carts: { list:[], items: [], }
    },
    onLoad(option) {
        let cartIdsList = JSON.parse(decodeURIComponent(option.cartIds))
        this.submitOrder = App.HttpResource('/mPurchaseAction/submitOrder.do/:id', { id: '@id' });
        //---temp
        // let cartIdsList = [1001658, 1001659, 1001660, 1001661, 1001662];
        //
        App.HttpService.getMembers()
            .then(data => {
                if (data.rows.length > 0) {
                    this.setData({ 'members.items': data.rows })
                }
            })
        this.setData({
            'carts.list': cartIdsList
        })
        App.HttpService.getCart({cartIds:cartIdsList})
            .then(data=>{
                if(data.rows.length>0){
                    let totalQty = 0
                    let totalAmt = 0
                    data.rows.forEach((val,idx,arr)=>{
                        totalQty += val.qty
                        totalAmt += val.qty*val.product.memberPrice
                    })
                    this.setData({
                        'carts.items': data.rows,
                        'carts.totalQty':totalQty,
                        'carts.totalAmt':App.Tools.changeTwoDecimal(totalAmt)
                    })
                }
            })
    },
    onShow() {

    },
    redirectTo(e) {
        console.log(e)
        App.WxService.redirectTo('/pages/address/confirm/index', {
            ret: this.data.address_id
        })
    },
    getDefalutAddress() {
        App.HttpService.getDefalutAddress()
            .then(data => {
                console.log(data)
                if (data.meta.code == 0) {
                    this.setData({
                        address_id: data.data._id,
                        'address.item': data.data,
                    })
                } else {
                    this.showModal()
                }
            })
    },
    showModal() {
        App.WxService.showModal({
                title: '友情提示',
                content: '没有收货地址，请先设置',
            })
            .then(data => {
                console.log(data)
                if (data.confirm == 1) {
                    App.WxService.redirectTo('/pages/address/add/index')
                } else {
                    App.WxService.navigateBack()
                }
            })
    },
    getAddressDetail(id) {
        App.HttpService.getAddressDetail(id)
            .then(data => {
                console.log(data)
                if (data.meta.code == 0) {
                    this.setData({
                        'address.item': data.data
                    })
                }
            })
    },
    addOrder() {
        const address_id = this.data.address_id
        const params = {
            items: [],
            address_id: address_id,
        }
        this.data.carts.items.forEach(n => {
            params.items.push({
                id: n.goods._id,
                total: n.total,
            })
        })
        console.log(params)
        App.HttpService.postOrder(params)
            .then(data => {
                console.log(data)
                if (data.meta.code == 0) {
                    App.WxService.redirectTo('/pages/order/detail/index', {
                        id: data.data._id
                    })
                }
            })
    },
    clear() {
        App.HttpService.clearCartByUser()
            .then(data => {
                console.log(data)
            })
    },
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e)
        this.setData({
            'members.index': e.detail.value
        })
    },
    submitOrderAction(e){
        let orderlist=this.data.carts.list

        if(orderlist.length>0 && this.data.members.items.length>0){
            const params = {
                cartIds:orderlist,
                memberId:this.data.members.items[this.data.members.index].memberId
            }
            this.submitOrder.getAsync(params)
                .then(data => {
                    if(data.success){
                        App.WxService.showModal({ title: '成功', content: '订单提交成功', })
                            .then(data=>{
                                App.WxService.switchTab({url:'/pages/index/index'})
                            })
                    }else{
                        App.WxService.showModal({ title: '失败', content: '订单提交失败' })
                            .then(data=>{
                                App.WxService.switchTab({url:'/pages/index/index'})
                            })
                    }
                },data=>{
                    App.WxService.showModal({ title: '失败', content: '订单提交失败' })
                        .then(data=>{
                            App.WxService.switchTab({url:'/pages/index/index'})
                        })
                })
        }
    }
})
