 const App = getApp()

Page({
    data: {
        activeIndex: 0,
        navList: [],
        productList: {},
        prompt: {
            hidden: !0,
            icon: '../../../assets/images/iconfont-order-default.png',
            title: '您还没有相关的订单',
            text: '可以去看看有哪些想买的',
        },
    },
    onLoad() {
        // this.order = App.HttpResource('/order/:id', {id: '@id'})
        this.productList = App.HttpResource('/mProductAction/query.do/:id', { id: '@id' });
        this.setData({
            navList: [{
                    id: "all",
                    title: "默认"
                },{
                    id: "all",
                    title: "时间"
                },
                {
                    id: "good",
                    title: "价格",
                    img: ["/assets/images/s-ArrowUp.png","/assets/images/s-ArrowDown.png"]
                },
                {
                    id: "share",
                    title: "销量"
                },
                {
                    id: "ask",
                    title: "筛选"
                }
            ]
        })
        this.onPullDownRefresh()
    },
    initData() {
        const productList = this.data.productList
        const params = productList && productList.params
        const type = params && params.type || 'all'
        this.setData({
            productList: {
                items: [],
                params: { start: 0, limit: 10, type: type, name:""},
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
    getList() {
        let that = this;
        const productList = this.data.productList
        const params = productList.params
        // App.HttpService.getOrderList(params)
        this.productList.queryAsync(params)
            .then(data => {
                console.log(data)
                if (data.rows && data.rows.length > 0) {
                    productList.items = [...productList.items, ...data.rows]
                    //在product的绑定页面表格中的数量
                    productList.items = productList.items.map((value,index,array)=>{
                        if(!value.qty){
                            value.qty=1
                            value.memberPriceStr=App.Tools.changeTwoDecimal(value.memberPrice)
                        }
                        return value
                    })//
                    this.setData({
                        productList: productList,
                        'productList.params.start': that.data.productList.params.start + that.data.productList.params.limit,
                        'prompt.hidden': productList.items.length,
                        'productList.total': data.total
                    })
                }
            })
    },
    onPullDownRefresh() {
        console.info('onPullDownRefresh')
        this.initData()
        this.getList()
        wx.stopPullDownRefresh()
    },
    onReachBottom() {
        console.info('onReachBottom')
        if(this.data.productList.total && this.data.productList.params.start>this.data.productList.total){
            wx.showToast({ title: '已到底部', icon: 'success', duration: 2000 })
            return
        }
        this.getList()
    },
    bindKeyInput(e){
        console.log(e);
        let array = this.data.productList.items.map((val,indx,arr)=>{
            if(val.s_Product_ID === e.currentTarget.dataset.s_product_id){
                val.qty=e.detail.value
            }
            return val
        })
        this.setData({ 'productList.items':array })
    },
    searchinput(e){
        this.setData({ 'productList.params.name':e.detail.value, })
    },
    onTapTag(e) {
        const type = e.currentTarget.dataset.type
        const index = e.currentTarget.dataset.index
        this.initData()
        this.setData({ activeIndex: index, 'productList.params.type': type, })
        this.getList()
    },
    searchfocus(e){
        console.log(e);
    },
    searchconfirm(e){
        if(e.detail.value){
            this.initData()
            this.setData({ 'productList.params.name':e.detail.value, })
            this.getList()
        }else{
            this.initData()
            this.getList()
        }
    },
    formSubmit(e){
        console.log(e);
        if(e.detail.value.searchvalue){
            this.initData()
            this.setData({ 'productList.params.name':e.detail.value.searchvalue, })
            this.getList()
        }else{
            this.initData()
            this.getList()
        }
    },
    searchclose(e){
        this.setData({ 'productList.params.name':"", })
    },
    addCart(e){
        let that = this
        console.log(e);
        App.HttpService.addCart({ S_Product_ID:e.currentTarget.dataset.s_product_id, qty:e.currentTarget.dataset.qty })
        .then(data=>{
            if(data.success){
                let array = that.data.productList.items.map((val,indx,arr)=>{
                    if(val.s_Product_ID === e.currentTarget.dataset.s_product_id){
                        val.cartQty=data.data.qty
                        val.cartId=data.data.cartId
                        val.cartTotalPrice=App.Tools.changeTwoDecimal(data.data.qty*val.memberPrice)
                    }
                    return val
                })
                that.setData({ 'productList.items':array })
                wx.showToast({ title: '添加成功', icon: 'success', duration: 2000 })
            }else{
                wx.showModal({ title: '增加失败', content: data.msg, success: function(res) {} })
            }
        })
    }
})
