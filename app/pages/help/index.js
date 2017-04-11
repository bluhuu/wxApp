var app = getApp();
Page({
    data: {
        userInfo: {},
        source: 'https://github.com/aidenzou/SmallApp'
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
