const App = getApp()

Page({
    data: {
        order: {
            item: {},
        },
    },
    onLoad(option) {
        this.order = App.HttpResource('/mOrderAction/query.do?orderId=:id', {id: '@id'})
        this.setData({ id: option.id })
    },
    onShow() {
        this.getOrderDetail(this.data.id)
    },
    getOrderDetail(id) {
        // App.HttpService.getOrderDetail(id)
        this.order.getAsync({id: id})
        .then(data => {
            console.log(data)
            if (data.total) {
                this.setData({
                    'order.item': data.rows
                })
            }
        })
    },
})
