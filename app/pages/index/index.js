//index.js
//获取应用实例
var App = getApp();
Page({
    data: {
        // 轮播
        images: [],
        indicatorDots: true, //是否显示面板指示点
        vertical: false, //是否可以纵向滑动
        autoplay: true, //是否自动切换
        interval: 3000, //自动切换时间间隔
        duration: 1200, //滑动动画时长
        // nav
        navs: [{
            image: '../../assets/images/nav-01.png',
            text: '商品查询',
            path: '../search/search'
        }, {
            image: '../../assets/images/nav-02.png',
            text: '我的订单',
            path: '../order/list/index'
        }, {
            image: '../../assets/images/nav-03.png',
            text: '问药',
            path: '../message2/message'
        }, {
            image: '../../assets/images/nav-04.png',
            text: '购物车',
            path: '../cart/cart'
        }],
        prompt: {
            hidden: !0,
            icon: '/assets/images/iconfont-order-default.png',
            title: '您还没有相关的订单',
            text: '可以去看看有哪些想买的',
        },
    },

    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        });
    },
    onShareAppMessage: function() {
        return {
            title: '你的样子',
            path: '/page/user?id=123'
        }
    },
    swiperchange: function(e) {
        //FIXME: 当前页码
        //console.log(e.detail.current)
    },
    initData() {
        let that = this
        const order = this.data.order
        const params = order && order.params
        const type = params && params.type || 'DFH'
        this.swipers.queryAsync()
            .then(data => {
                let images = []
                if (data.rows.length > 0) {
                    data.rows.forEach((val, idx, arr) => {
                        for (const k of Object.keys(val)) {
                            images.push(App.renderImage(val[k]))
                        }
                    })
                    // images.push("/assets/images/4.jpg")
                    if (images.length > 0) {
                        that.setData({
                            images: images
                        })
                    }
                } else {
                    App.WxService.showModal({
                        title: '提示',
                        content: "请稍后再试",
                        showCancel: !1,
                    })
                }
            }, data => {
                App.WxService.showModal({
                    title: '提示',
                    content: "请稍后再试",
                    showCancel: !1,
                })
            })
        this.setData({
            order: {
                items: [],
                params: {
                    start: 0,
                    limit: 5,
                    orderStatus: type,
                },
                paginate: {}
            }
        })
    },
    onLoad: function() {
        this.order = App.HttpResource('/mOrderAction/query.do/:id', {
            id: '@id'
        });
        this.swipers = App.HttpResource('/mIndexAction/query.do');
        console.log('onLoad');
        var that = this;
        //调用应用实例的方法获取全局数据
        App.getUserInfo(function(userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            });
        });
        this.onPullDownRefresh()
    },
    go: function(event) {
        console.log(event);
        wx.navigateTo({
            url: event.currentTarget.dataset.path,
            fail: () => {
                wx.switchTab({
                    url: event.currentTarget.dataset.path,
                })
            }
        });
    },
    DFHOrderAction(e) {
        App.WxService.navigateTo("../order/list/index", {
            orderStatus: "DFH"
        })
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
                    order.items = order.items.map((value, index, array) => {
                        if (!!value.orderAmt) {
                            value.orderAmtStr = App.Tools.changeTwoDecimal(value.orderAmt)
                        }
                        return value
                    }) //
                    this.setData({
                        order: order,
                        'prompt.hidden': order.items.length,
                        'order.params.start': this.data.order.params.start + this.data.order.params.limit,
                        'order.total': data.total
                    })
                }else{
                    this.setData({
                        'prompt.hidden': order.items.length,
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
    onShow(){
        // this.onPullDownRefresh()
    },
    onReachBottom() {
        console.info('onReachBottom')
        if (this.data.order.total && this.data.order.params.start >= this.data.order.total) {
            wx.showToast({
                title: '已到底部',
                icon: 'success',
                duration: 2000
            })
            return
        }
        this.getList()
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/order/detail/index', {
            id: e.currentTarget.dataset.id
        })
    },
});
