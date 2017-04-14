const App = getApp()
Page({
    data: {
        userInfo: {},
        user:{ userName:'潘长江', userGender:'男', userPhone:'13770679518' },
        list: [
            {
                id: 'view',
                name: '我的资料',
                img:'../../image/personal-11.png',
                open: false,
                pages: ['view', 'scroll-view', 'swiper']
            }, {
                id: 'content',
                name: '我的咨询',
                img:'../../image/personal-12.png',
                open: false,
                pages: ['text', 'icon', 'progress']
            }, {
                id: 'form',
                name: '家族成员',
                img:'../../image/personal-13.png',
                open: false,
                pages: ['张学友', '刘丝丝', '白骨精']
            }, {
                id: 'feedback',
                name: '我的处方',
                img:'../../image/personal-14.png',
                open: false,
                pages: ['action-sheet', 'modal', 'toast', 'loading']
            }
        ]
    },
    widgetsToggle: function (e) {
        var id = e.currentTarget.id, list = this.data.list;

        for (var i = 0, len = list.length; i < len; ++i) {
            if (list[i].id == id) {
                list[i].open = !list[i].open;
            } else {
                list[i].open = false;
            }
        }
        this.setData({
            list: list
        });
    },
    memberedit:function (e) {
        console.log("eeeeeeeeeeeeee:");
        console.log(e);
        console.log(this);
        wx.showModal({
            title: '提示',
            content: '这是一个模态弹窗',
            success: function(res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        });
    },
    onLoad: function() {
        this.getUserInfo()
    },
    getUserInfo() {
        const userInfo = App.globalData.userInfo
        if (userInfo) {
            this.setData({
                userInfo: userInfo
            })
            return
        }
        App.getUserInfo()
        .then(data => {
            console.log(data)
            this.setData({
                userInfo: data
            })
        })
    }
});
