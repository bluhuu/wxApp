const App = getApp()
Page({
     data: {
         userInfo: {},
         items: [{
                 icon: '../../assets/images/iconfont-order.png',
                 text: '我的订单',
                 path: '/pages/order/list/index'
             },
             {
                 icon: '../../assets/images/iconfont-kefu.png',
                 text: '联系客服',
                 path: '025-52350079',
             },
             {
                 icon: '../../assets/images/iconfont-help.png',
                 text: '完善信息',
                 path: '/pages/user/personal/index',
             },
         ],
         settings: [{
                 icon: '../../assets/images/iconfont-clear.png',
                 text: '清除缓存',
                 path: '0.0KB'
             },
         ]
     },
     onLoad() {
         this.getUserInfo()
         this.getStorageInfo()
     },
     onShow() {
         console.log("我回来了！");
     },
     navigateTo(e) {
         const index = e.currentTarget.dataset.index
         const path = e.currentTarget.dataset.path

         switch (index) {
             case 1:
                 App.WxService.makePhoneCall({
                     phoneNumber: path
                 })
                 break
             default:
                 App.WxService.navigateTo(path)
         }
     },
     getUserInfo() {
         const userInfo = App.globalData.userInfo
         console.log(userInfo);
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
     },
     getStorageInfo() {
         App.WxService.getStorageInfo()
             .then(data => {
                 console.log(data)
                 this.setData({
                     'settings[0].path': `${data.currentSize}KB`
                 })
             })
     },
     bindtap(e) {
         const index = e.currentTarget.dataset.index
         const path = e.currentTarget.dataset.path

         switch (index) {
             case 0:
                 App.WxService.showModal({
                         title: '友情提示',
                         content: '确定要清除缓存吗？',
                     })
                     .then(data => data.confirm == 1 && App.WxService.clearStorage())
                 break
             default:
                 App.WxService.navigateTo(path)
         }
     },
     logout() {
         App.WxService.showModal({
                 title: '友情提示',
                 content: '确定要登出吗？',
             })
             .then(data => data.confirm == 1 && this.signOut())
     },
     signOut() {
         App.WxService.removeStorageSync('token')
         App.WxService.redirectTo('/pages/login/index')
     },
})
