var app = getApp();
Page({
    data: {
        userInfo: {},
        user:{
            userName:'赵山河',
            userGender:'男',
            userPhone:'13770679518'
        },
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
                pages: ['button', 'checkbox', 'form', 'input', 'label', 'picker', 'radio', 'slider', 'switch']
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
    onLoad: function() {
        var that = this;
        app.getUserInfo(function(userInfo) {
            that.setData({
                userInfo: userInfo
            });
        });
    }
});
