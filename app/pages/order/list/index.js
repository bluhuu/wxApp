const App = getApp()

Page({
    data: {
        activeIndex: 0,
        navList: [],
        order: {},
        prompt: { hidden: !0, icon: '../../../assets/images/iconfont-order-default.png', title: '您还没有相关的订单', text: '可以去看看有哪些想买的', },
    },
    onLoad() {
        this.order = App.HttpResource('/mOrderAction/query.do/:id', { id: '@id' });
        this.setData({ navList: [{ name: '全部订单', _id: '', }, { name: '待发货', _id: 'DFH', }, { name: '已完成', _id: 'YWC', }, ] })
        this.onPullDownRefresh()
    },
    initData() {
        const order = this.data.order
        const params = order && order.params
        const type = params && params.type || 'all'
        this.setData({ order: { items: [], params: { start : 0, limit: 10, orderStatus : type, }, paginate: {} } })
    },
    navigateTo(e) {
        console.log(e)
        // App.WxService.navigateTo('/pages/order/detail/index', {
        //     id: e.currentTarget.dataset.id
        // })
    },
    getList() {
        const order = this.data.order
        const params = order.params
        // App.HttpService.getOrderList(params)
        this.order.queryAsync(params)
        .then(data => {
            console.log(data)
            if (data.rows && data.rows.length > 0) {
                order.items = [...order.items, ...data.rows]
                //在product的绑定页面表格中的数量
                order.items = order.items.map((value,index,array)=>{
                    if(!!value.orderAmt){
                        value.orderAmtStr=App.Tools.changeTwoDecimal(value.orderAmt)
                    }
                    return value
                })//
                this.setData({
                    order: order,
                    'prompt.hidden': order.items.length,
                    'order.params.start': this.data.order.params.start + this.data.order.params.limit,
                    'order.total': data.total
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
        if(this.data.order.total && this.data.order.params.start>this.data.order.total){
            wx.showToast({ title: '已到底部', icon: 'success', duration: 2000 })
            return
        }
        this.getList()
    },
    onTapTag(e) {
        console.log(e);
        const orderStatus = e.currentTarget.dataset.type
        const index = e.currentTarget.dataset.index
        this.initData()
        this.setData({ activeIndex: index, 'order.params.orderStatus': orderStatus, })
        this.getList()
    },
})
