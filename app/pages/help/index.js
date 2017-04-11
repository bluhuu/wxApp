var app = getApp();
Page({
    data: {
        userInfo: {},
        source: '智慧健康'
    },
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
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
