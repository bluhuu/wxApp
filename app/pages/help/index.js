const App = getApp()
Page({
    data: {
        objectArray: [
              {id: 5, unique: 'unique_5'},
              {id: 4, unique: 'unique_4'},
              {id: 3, unique: 'unique_3'},
              {id: 2, unique: 'unique_2'},
              {id: 1, unique: 'unique_1'},
              {id: 0, unique: 'unique_0'},
            ],
        numberArray: [1, 2, 3, 4],
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
    },
    switch: function(e) {
    const length = this.data.objectArray.length
    for (let i = 0; i < length; ++i) {
      const x = Math.floor(Math.random() * length)
      const y = Math.floor(Math.random() * length)
      const temp = this.data.objectArray[x]
      this.data.objectArray[x] = this.data.objectArray[y]
      this.data.objectArray[y] = temp
    }
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  addToFront: function(e) {
    const length = this.data.objectArray.length
    this.data.objectArray = [{id: length, unique: 'unique_' + length}].concat(this.data.objectArray)
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  addNumberToFront: function(e){
    this.data.numberArray = [ this.data.numberArray.length + 1 ].concat(this.data.numberArray)
    this.setData({
      numberArray: this.data.numberArray
    })
  }
});
