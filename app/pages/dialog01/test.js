//index.js
//获取应用实例
var inputinfo = "";
var app = getApp()
Page({
  data: {
    animationData:"",
    showModalStatus:false
  },

  onLoad: function () {

  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  clickbtn:function(){
    if(this.data.showModalStatus){
      this.hideModal();
    }else{
      this.showModal();
    }
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  click_cancel:function(){
    console.log("点击取消");
     this.hideModal();
  },
  click_ok:function(){
    console.log("点击了确定===，输入的信息为为==",inputinfo);
      this.hideModal();
  },
  input_content:function(e){
    console.log(e);
    inputinfo = e.detail.value;
  }

})
