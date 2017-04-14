Page({
    data: {

        foodList: [],
        detailFood: {},
        modalHidden: true,
        foodList: [{
                id: 1,
                title: "黑胡椒意酱面",
                cost: 45,
                desc: "进口意大利通心粉制作，搭配有机番茄秘制酱汁。",
                icon: "https://fuss10.elemecdn.com/8/05/0b0f3719bf1c9c1673ed69e262888jpeg.jpeg",
                num: 0
            },
            {
                id: 2,
                title: "吉士意大利虾仁面",
                cost: 40,
                desc: "进口意大利通心粉制作，搭配进口地中海大虾仁。",
                icon: "https://fuss10.elemecdn.com/4/df/ff64bc5b06893a12aafb1e94f8b31jpeg.jpeg",
                num: 0
            },
            {
                id: 3,
                title: "牛排意大利面",
                cost: 38,
                desc: "进口意大利通心粉制作，搭配新鲜酱汁牛排和甜糯玉米。",
                icon: "https://fuss10.elemecdn.com/3/42/70aae8406958d22657c5772e2412ejpeg.jpeg",
                num: 0
            },
            {
                id: 4,
                title: "香炸鸡翅",
                cost: 12,
                desc: "有机食品，绿色农场放心肉源",
                icon: "https://fuss10.elemecdn.com/e/0e/df4f9d07b191d34ceddc3fedd88dcjpeg.jpeg",
                num: 0
            },
            {
                id: 5,
                title: "一品寿司",
                cost: 22,
                desc: "百分百手工，百分百口味，来自东海岸的问候。",
                icon: "https://fuss10.elemecdn.com/8/53/353cf146fc9cab79479efcfb6e88ajpeg.jpeg",
                num: 0
            },
            {
                id: 6,
                title: "水果拼盘",
                cost: 16,
                desc: "新鲜时蔬，源自生活的百味奇珍。",
                icon: "https://fuss10.elemecdn.com/0/b9/42b68495a09ec2e501ec3eaa36c6ejpeg.jpeg",
                num: 0
            },
            {
                id: 7,
                title: "巧手三明治",
                cost: 22,
                desc: "好吃不贵，明治选择。",
                icon: "https://fuss10.elemecdn.com/a/fe/0d647946855f76e9dcdfbedfcad61jpeg.jpeg",
                num: 0
            },
            {
                id: 8,
                title: "培根焗饭",
                cost: 26,
                desc: "好吃不解释，真的不解释。",
                icon: "https://fuss10.elemecdn.com/9/de/30676686cf98d88961eb69f1f3083jpeg.jpeg",
                num: 0
            }

        ],
        //订单数据
        orderList: {},
        orderNum: 0,
        orderCost: 0,
        toastHidden: true,
        //轮播图
        imgUrls: [
            'https://fuss10.elemecdn.com/d/c0/56cfcdabba9fec97a3307b571ca8cjpeg.jpeg',
            'https://fuss10.elemecdn.com/6/f2/5cd85b966281a8d545c34019d0fd1jpeg.jpeg',
            'https://fuss10.elemecdn.com/e/55/b00aef689cb424aaaeae9d50d3e76jpeg.jpeg',
            'https://fuss10.elemecdn.com/a/88/98d10d5580ce28db07673e28726ccjpeg.jpeg'
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 4000,
        duration: 1000,
        //picker
        foodTypes: ['全部菜品', '披萨', '面条', '水果', '寿司', '三明治'],
        foodTypesIndex: 0,
        rankTypes: ['综合排序', '热度', '价格', '好评', '时间'],
        rankTypesIndex: 0
    },
    onLoad: function(options) {
        var appInstance = getApp();
        var t_foodList = appInstance.globalData.foodList;
        var t_arr;
        for (var i = 0; i < t_foodList.length; i++) {
            if (i % 2 == 0) {
                this.data.foodList.push(t_arr); //整理成二维数据，方便显示
                t_arr = [];
            }
            t_arr.push(t_foodList[i]);
        }
        console.log("t_arr",t_arr);
    },
    //关闭食品详情弹窗
    closeModal: function(e) {
        this.setData({
            modalHidden: true
        });
    },
    //展示食品详情弹窗
    imageClick: function(e) {
        console.log(e);
        var dataset = e.currentTarget.dataset;
        var appInstance = getApp();
        var t_foodList = appInstance.globalData.foodList;
        //设置数据，自动刷新界面
        this.setData({
            modalHidden: false,
            detailFood: t_foodList[dataset.index],
            detailIndex: dataset.index
        });
    },
    //提交订单
    sublimitClick: function(e) {
        //订单列表 传参
        var agrs = JSON.stringify(this.data.orderList);
        console.log(agrs);
        wx.navigateTo({
            url: '../order/order?order=' + agrs
        })
    },
    //加入到购物车
    addCartClick: function(e) {
        var dataset = e.currentTarget.dataset;
        this.changeNum(dataset.index, true);

        this.setData({ toastHidden: false });
        //1s后关闭
        var _this = this;
        setTimeout(function() {
            _this.setData({ toastHidden: true });
        }, 1000);
        this.closeModal();
    },
    //增加数量
    addClick: function(e) {
        var dataset = e.currentTarget.dataset;
        this.changeNum(dataset.index, true);
    },
    //减少数量
    reduceClick: function(e) {
        var dataset = e.currentTarget.dataset;
        this.changeNum(dataset.index, false);
    },
    changeNum: function(index, bool) {
        var appInstance = getApp();
        var t_food = appInstance.globalData.foodList[index];
        var orderList = this.data.orderList;
        var obj = orderList[t_food.id];
        //如果存在，则数量变化
        if (obj) {
            if (bool) {
                obj.num = obj.num + 1;
            } else {
                if (obj.num > 0) {
                    obj.num = obj.num - 1;
                } else {
                    return; //已经减少为0
                }
            }
        } else {
            if (bool) {
                //不存在，点击增加，则写入一条订单数据，数量默认1
                obj = {
                    id: t_food.id,
                    num: 1,
                    cost: t_food.cost,
                    title: t_food.title
                };
                this.data.orderList[t_food.id] = obj;
            } else {
                return; //不存在，并且点击的是减少
            }
        }
        var order_num = 0;
        var order_cost = 0;
        for (var k in orderList) {
            order_num = orderList[k].num + order_num; //计算总数量
            order_cost = order_cost + orderList[k].cost * orderList[k].num; //计算总价格
        }
        this.setData({
            orderList: orderList,
            orderNum: order_num,
            orderCost: order_cost
        });
    },
    //食品类型
    foodTypeChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        this.setData({
            foodTypesIndex: e.detail.value
        });
    },
    //排序类型
    rankTypeChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        this.setData({
            rankTypesIndex: e.detail.value
        });
    },

});
