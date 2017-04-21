//index.js
//获取应用实例
var app = getApp();
Page({
    data: {
        // 轮播
        images: [
            '../../assets/images/slibe01.png',
            '../../assets/images/slibe01.png',
            '../../assets/images/slibe01.png',
        ],
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
            text: '咨询服务'
        }, {
            image: '../../assets/images/nav-04.png',
            text: '健康档案'
        }, {
            image: '../../assets/images/nav-05.png',
            additionImage: '../../assets/images/building.png',
            text: '我要问诊',
            addition: true
        }, {
            image: '../../assets/images/nav-06.png',
            additionImage: '../../assets/images/building.png',
            text: '健康商城',
            addition: true
        }, {
            image: '../../assets/images/nav-07.png',
            additionImage: '../../assets/images/building.png',
            text: '健康知识',
            addition: true
        }, {
            image: '../../assets/images/nav-08.png',
            text: '即将上线'
        }],
        // item
        items: [{
            date: '2016-2-16',
            prescriptionId: 'TCF0023',
            prescriptionState: '煎制中',
            orgName: '仙林社区卫生服务中心',
            decoctType: '代煎',
            otcType: '普通处方',
            image: '../../assets/images/QRCode.png'
        }, {
            date: '2016-2-16',
            prescriptionId: 'TCF0023',
            prescriptionState: '煎制中',
            orgName: '仙林社区卫生服务中心',
            decoctType: '代煎',
            otcType: '普通处方',
            image: '../../assets/images/QRCode.png'
        }, {
            date: '2016-2-16',
            prescriptionId: 'TCF0023',
            prescriptionState: '煎制中',
            orgName: '仙林社区卫生服务中心',
            decoctType: '代煎',
            otcType: '普通处方',
            image: '../../assets/images/QRCode.png'
        }]
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

    onLoad: function() {
        console.log('onLoad');
        var that = this;
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            });
        });
    },
    go: function(event) {
        console.log(event);
        wx.navigateTo({
            url: event.currentTarget.dataset.path,
            fail:()=>{ wx.switchTab({url: event.currentTarget.dataset.path,}) }
        });
    }
});
