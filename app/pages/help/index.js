const App = getApp()
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
