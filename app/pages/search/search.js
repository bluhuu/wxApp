var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');

var navList = [
    { id: "all", title: "时间", img: "/image/s-ArrowDown.png" },
    { id: "good", title: "价格", img: "/image/s-ArrowDown.png" },
    { id: "share", title: "销量", img: "/image/s-ArrowDown.png" },
    { id: "ask", title: "筛选" }
];

var productList=[
    {
        ProductName:"【本草纲目】 小儿咳喘灵颗粒",
        productSpec:"10g*10袋",
        manufacturer:"李时珍医药集团有限公司",
        productStyle:"冲剂",
        productId:"",
        uomName:"盒",
        isBasicMedicine:"",
        saleUnit:"10",
        bundle:"中/大包装",
        certificateNo:"",
        poPrice:"4.60",
        salePrice:"10.00",
        qtyMsg:"",
        nearValDate:"",
        isPromotion:"",
        isInsurance:"",
        isOTC:""
    },
    {
        ProductName:"【绿叶】 小儿咳喘灵颗粒",
        productSpec:"10g*10袋",
        manufacturer:"李时珍医药集团有限公司",
        productStyle:"冲剂",
        productId:"",
        uomName:"盒",
        isBasicMedicine:"",
        saleUnit:"10",
        bundle:"中/大包装",
        certificateNo:"",
        poPrice:"4.60",
        salePrice:"10.00",
        qtyMsg:"",
        nearValDate:"",
        isPromotion:"",
        isInsurance:"",
        isOTC:""
    },
    {
        ProductName:"【葵花】 小儿咳喘灵颗粒",
        productSpec:"10g*10袋",
        manufacturer:"李时珍医药集团有限公司",
        productStyle:"冲剂",
        productId:"",
        uomName:"盒",
        isBasicMedicine:"",
        saleUnit:"10",
        bundle:"中/大包装",
        certificateNo:"",
        poPrice:"4.60",
        salePrice:"10.00",
        qtyMsg:"",
        nearValDate:"",
        isPromotion:"",
        isInsurance:"",
        isOTC:""
    },
    {
        ProductName:"【远大黄石】 小儿咳喘灵颗粒",
        productSpec:"10g*10袋",
        manufacturer:"李时珍医药集团有限公司",
        productStyle:"冲剂",
        productId:"",
        uomName:"盒",
        isBasicMedicine:"",
        saleUnit:"10",
        bundle:"中/大包装",
        certificateNo:"",
        poPrice:"4.60",
        salePrice:"10.00",
        qtyMsg:"",
        nearValDate:"",
        isPromotion:"",
        isInsurance:"",
        isOTC:""
    }
];

Page({
    data: {
        activeIndex: -1,
        navList: navList,
        title: '话题列表',
        postsList: [],
        productList:[],
        hidden: false,
        page: 1,
        limit: 20,
        tab: 'all'
    },

    onLoad: function() {
        this.getData();
    },

    onPullDownRefresh: function() {
        this.getData();
        console.log('下拉刷新', new Date());
    },


    onReachBottom: function() {
        this.lower();
        console.log('上拉刷新', new Date());
    },

    // 点击获取对应分类的数据
    onTapTag: function(e) {
        var that = this;
        var tab = e.currentTarget.id;
        var index = e.currentTarget.dataset.index == this.data.activeIndex ? -1 : e.currentTarget.dataset.index;
        that.setData({
            activeIndex: index,
            tab: tab,
            page: 1
        });
        if (tab !== 'all') {
            that.getData({
                tab: tab
            });
        } else {
            that.getData();
        }
    },

    //获取文章列表数据
    getData: function() {
        var that = this;
        var tab = that.data.tab;
        var page = that.data.page;
        var limit = that.data.limit;
        var ApiUrl = Api.topics + '?tab=' + tab + '&page=' + page + '&limit=' + limit;

        that.setData({
            hidden: false
        });

        if (page == 1) {
            that.setData({
                postsList: []
            });
        }

        Api.fetchGet(ApiUrl, (err, res) => {
            //更新数据
            that.setData({
                postsList: that.data.postsList.concat(res.data.map(function(item) {
                    item.last_reply_at = util.getDateDiff(new Date(item.last_reply_at));
                    return item;
                }))
            });

            setTimeout(function() {
                that.setData({
                    hidden: true
                });
            }, 300);
        })
    },

    // 滑动底部加载
    lower: function() {
        console.log('滑动底部加载', new Date());
        var that = this;
        that.setData({
            page: that.data.page + 1
        });
        if (that.data.tab !== 'all') {
            this.getData({
                tab: that.data.tab,
                page: that.data.page
            });
        } else {
            this.getData({
                page: that.data.page
            });
        }
    },
    bindKeyInput(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.detail.value)
        if (total < 0 || total > 100) return
        this.putCartByUser(id, {
            total: total
        })
    },
    decrease(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.currentTarget.dataset.total)
        if (total == 1) return
        this.putCartByUser(id, {
            total: total - 1
        })
    },
    increase(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.currentTarget.dataset.total)
        if (total == 100) return
        this.putCartByUser(id, {
            total: total + 1
        })
    }

})
