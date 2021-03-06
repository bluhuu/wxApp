const App = getApp()

Page({
    data: {
        lastX: 0,
        lastY: 0,
        activeIndex: 0,
        carts: { items: [] },
        prompt: {
            hidden: !0,
            icon: '../../assets/images/iconfont-cart-empty.png',
            title: '购物车空空如也',
            text: '可以去看看有哪些想买的',
        },
    },
    onLoad() {
        // this.order = App.HttpResource('/order/:id', {id: '@id'})
        this.carts = App.HttpResource('/mPurchaseAction/query.do/:id', {
            id: '@id'
        });
        this.updateCart = App.HttpResource('/mPurchaseAction/updateCart.do/:id', {
            id: '@id'
        });
        this.submitOrder = App.HttpResource('/mPurchaseAction/submitOrder.do/:id', {
            id: '@id'
        });
        this.onPullDownRefresh()
    },
    initData() {
        const carts = this.data.carts
        const params = carts && carts.params
        const type = params && params.type || 'all'
        this.setData({
            carts: {
                items: [],
                params: {
                    start: 0,
                    limit: 10,
                    type: type,
                    name: ""
                },
                paginate: {}
            }
        })
    },
    navigateTo(e) {
        console.log(e)
        // App.WxService.navigateTo('/pages/order/detail/index', {
        //     id: e.currentTarget.dataset.id
        // })
    },
    selected(e) {
        console.log(e.currentTarget.dataset.cartid);
        const cartid = e.currentTarget.dataset.cartid
        let items = this.data.carts.items.map((value, index, array) => {
            if (cartid === value.cartId) {
                value.selected = !value.selected
            }
            return value
        })
        this.setData({
            'carts.items': items
        })
        this.changeDataStatus()
    },
    allselected(e) {
        let items = this.data.carts.items.map((value, index, array) => {
            value.selected = !this.data.carts.allselected
            return value
        })
        this.setData({
            'carts.items': items,
            'carts.allselected': !this.data.carts.allselected
        })
        this.changeDataStatus()
    },
    getList() {
        let that = this;
        const carts = this.data.carts
        const params = carts.params
        // App.HttpService.getOrderList(params)
        this.carts.queryAsync(params)
            .then(data => {
                console.log(data)
                if (data.rows && data.rows.length > 0) {
                    carts.items = [...carts.items, ...data.rows]
                    //在product的绑定页面表格中的数量
                    carts.items = carts.items.map((value, index, array) => {
                        // value.product.memberPriceStr=App.Tools.changeTwoDecimal(value.product.memberPrice)
                        // value.totalPrice = +value.product.memberPrice * value.qty
                        // value.totalPriceStr=App.Tools.changeTwoDecimal(value.totalPrice)
                        // value.selected=true
                        return value
                    }) //

                    this.setData({
                        carts: carts,
                        'carts.params.start': that.data.carts.params.start + that.data.carts.params.limit,
                        'prompt.hidden': carts.items.length,
                        'carts.total': data.total
                    })
                    this.changeDataStatus()
                } else {
                    this.setData({
                        'prompt.hidden': carts.items.length,
                    })
                }
            })
    },
    removeCart(e) {
        let that = this
        if (!e.currentTarget.dataset.cartid)
            return
        App.HttpService.deleteCart({ cartId: e.currentTarget.dataset.cartid })
            .then(data => {
                if (data.success) {
                    App.WxService.showToast({ title: '已删除', icon: 'success', duration: 2000 })
                        .then(() => {
                            let list = that.data.carts.items.filter(val=>{
                                if(val.cartId != e.currentTarget.dataset.cartid)
                                    return true
                            })
                            that.setData({ 'carts.items':list })
                        })
                }
            })
    },
    handletouchmove: function(event) {
        const carts = this.data.carts
        let currentX = event.touches[0].pageX
        let currentY = event.touches[0].pageY
        if ((currentX - this.data.lastX) < -10 && Math.abs(currentX - this.data.lastX)/Math.abs(currentY - this.data.lastY)>4) {
            carts.items = carts.items.map((val, idx, arr) => {
                if (val.cartId == event.currentTarget.dataset.cartid){
                    val.hidden=true
                }else{
                    val.hidden=false
                }
                return val
            })
            this.data.lastX = currentX
            this.data.lastY = currentY
        } else if (((currentX - this.data.lastX) > 10 && Math.abs(currentX - this.data.lastX)/Math.abs(currentY - this.data.lastY)>4)) {
            carts.items = carts.items.map((val, idx, arr) => {
                if (val.cartId == event.currentTarget.dataset.cartid){
                    val.hidden=false
                }else{
                    val.hidden=false
                }
                return val
            })
            this.data.lastX = currentX
            this.data.lastY = currentY
        }
        this.setData({ carts: carts })
    },

    handletouchtart: function(event) {
        console.log(event)
        this.data.lastX = event.touches[0].pageX
        this.data.lastY = event.touches[0].pageY
    },
    onPullDownRefresh() {
        console.info('onPullDownRefresh')
        this.initData()
        this.getList()
        wx.stopPullDownRefresh()
    },
    onReachBottom() {
        console.info('onReachBottom')
        if (this.data.carts.total && this.data.carts.params.start >= this.data.carts.total) {
            if(this.data.carts.total>=this.data.carts.params.limit)
                wx.showToast({ title: '已到底部', icon: 'success', duration: 2000 })
            return
        }
        this.getList()
    },
    bindKeyInput(e) {
        console.log(e);
        let array = this.data.carts.items.map((val, indx, arr) => {
            if (val.cartId === e.currentTarget.dataset.cartid) {
                val.qty = e.detail.value
            }
            return val
        })
        this.setData({
            'carts.items': array
        })
        this.changeDataStatus()
    },
    bindKeyInputConfirm(e) {
        const params = {
            S_Product_ID: e.currentTarget.dataset.s_product_id,
            qty: e.detail.value
        }
        this.updateCart.getAsync(params)
            .then(data => {
                if (data.success) {
                    this.bindKeyInput(e)
                    wx.showToast({
                        title: '修改成功',
                        icon: 'success',
                        duration: 2000
                    })
                } else {
                    wx.showModal({
                        content: '修改失败'
                    })
                }
            }, data => {
                wx.showModal({
                    content: '连接失败'
                })
            })
    },
    submitOrderAction(e) {
        let orderlist = []
        this.data.carts.items.forEach((val, idx, arr) => {
            if (val.selected) {
                orderlist.push(val.cartId)
            }
        })
        if (orderlist.length > 0) {
            console.log(orderlist);
            App.WxService.redirectTo('/pages/order/confirm/index', {
                cartIds: JSON.stringify(orderlist)
            })
            // const params = { cartIds:orderlist}
            // this.submitOrder.getAsync(params)
            //     .then(data => {
            //         console.log(data);
            //     },data=>{
            //         console.log(data);
            //     })
        }
    },
    changeDataStatus() {
        const carts = this.data.carts
        carts.items = carts.items.map((value, index, array) => {
            value.product.memberPriceStr = App.Tools.changeTwoDecimal(value.product.memberPrice)
            value.totalPrice = +value.product.memberPrice * value.qty
            value.totalPriceStr = App.Tools.changeTwoDecimal(value.totalPrice)
            return value
        })

        carts.allselected = true
        let totalAmt = 0;
        let totalQty = 0;
        carts.items.forEach((value, index, array) => {
            if (!value.selected) {
                carts.allselected = false
            }
            if (value.selected) {
                totalAmt = totalAmt + value.totalPrice
                totalQty = totalQty + (+value.qty)
            }
        })
        carts.totalAmt = App.Tools.changeTwoDecimal(totalAmt)
        carts.totalQty = totalQty
        this.setData({
            carts: carts,
        })
    },
    searchinput(e) {
        this.setData({
            'carts.params.name': e.detail.value,
        })
    },
    onTapTag(e) {
        const type = e.currentTarget.dataset.type
        const index = e.currentTarget.dataset.index
        this.initData()
        this.setData({
            activeIndex: index,
            'carts.params.type': type,
        })
        this.getList()
    },
    searchfocus(e) {
        console.log(e);
    },
    searchconfirm(e) {
        if (e.detail.value) {
            this.initData()
            this.setData({
                'carts.params.name': e.detail.value,
            })
            this.getList()
        } else {
            this.initData()
            this.getList()
        }
    },
    formSubmit(e) {
        console.log(e);
        if (e.detail.value.searchvalue) {
            this.initData()
            this.setData({
                'carts.params.name': e.detail.value.searchvalue,
            })
            this.getList()
        } else {
            this.initData()
            this.getList()
        }
    },
    searchclose(e) {
        this.setData({
            'carts.params.name': "",
        })
    },
    addCart(e) {
        let that = this
        console.log(e);
        App.HttpService.addCart({
                S_Product_ID: e.currentTarget.dataset.s_product_id,
                qty: e.currentTarget.dataset.qty
            })
            .then(data => {
                if (data.success) {
                    let array = that.data.carts.items.map((val, indx, arr) => {
                        if (val.s_Product_ID === e.currentTarget.dataset.s_product_id) {
                            val.cartQty = data.data.qty
                            val.cartId = data.data.cartId
                            val.cartTotalPrice = App.Tools.changeTwoDecimal(data.data.qty * val.memberPrice)
                        }
                        return val
                    })
                    that.setData({
                        'carts.items': array
                    })
                    wx.showToast({
                        title: '添加成功',
                        icon: 'success',
                        duration: 2000
                    })
                } else {
                    wx.showModal({
                        title: '增加失败',
                        content: data.msg,
                        success: function(res) {}
                    })
                }
            })
    }
})
