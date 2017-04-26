const App = getApp()

Page({
    data: {
        hidden: !0,
        index: 0,
        members: { index: 1, items: [] },
        carts: { list:[], items: [], }
    },
    onLoad(option) {
        console.log(option)
        let cartIdsList = JSON.parse(decodeURIComponent(option.cartIds))
        App.HttpService.getMembers()
            .then(data => {
                if (data.rows.length > 0) {
                    this.setData({
                        'members.items': data.rows
                    })
                }
            })
        this.setData({
            'carts.list': cartIdsList
        })
        App.HttpService.getCart({cartIds:cartIdsList})
            .then(data=>{
                console.log(data);
                if(data.rows.length>0){
                    this.setData({
                        'carts.items': data.rows
                    })
                }
            })
    },
    onShow() {
        // const address_id = this.data.address_id
        // if (address_id) {
        //     this.getAddressDetail(address_id)
        // } else {
        //     this.getDefalutAddress()
        // }
        // this.showModal()
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
})
