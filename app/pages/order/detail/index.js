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
                let item=data.rows[0]
                //在product的绑定页面表格中的数量
                if(item.orderAmt){
                    item.orderAmtStr = App.Tools.changeTwoDecimal(item.orderAmt)
                }
                if(item.dateOrder){
                    item.dateOrderStr = App.Tools.formatDate(App.Tools.parseDate(item.dateOrder, 'yyyy-MM-dd HH:mm:ss'))
                }
                item.lines = item.lines.map((value,index,array)=>{
                    if(!!value.price){
                        value.priceStr=App.Tools.changeTwoDecimal(value.price)
                    }
                    if(!!value.product.images){
                        value.images=[]
                        JSON.parse(value.product.images).forEach((val,idx,arr)=>{
                            value.images.push(App.renderImage("/" + val.image))
                        })
                    }
                    return value
                })//
                let total = 0;
                item.lines.forEach((value,index,array)=>{
                    total =total + value.qty;
                })
                item.qty=total;
                this.setData({ 'order.item': item })
            }
        })
    },
})
