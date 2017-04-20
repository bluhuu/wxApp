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
                    img: ["/images/s-ArrowUp.png","/images/s-ArrowDown.png"]
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
    addCart(e){
        console.log(e);
    }
})
