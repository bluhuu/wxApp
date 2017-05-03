//js
Page({
  data: {
    lastX: 0,
    lastY: 0,
    text : "没有滑动",
  },
  handletouchmove: function(event) {
    console.log(event)
    let currentX = event.touches[0].pageX
    let currentY = event.touches[0].pageY

    console.log(currentX)
    console.log(this.data.lastX)
    let text = ""
    if ((currentX - this.data.lastX) < 0)
      text = "向左滑动"
    else if (((currentX - this.data.lastX) > 0))
      text = "向右滑动"

    //将当前坐标进行保存以进行下一次计算
    this.data.lastX = currentX
    this.data.lastY = currentY
    this.setData({
      text : text,
    });
  },

  handletouchtart:function(event) {
    console.log(event)
    this.data.lastX = event.touches[0].pageX
    this.data.lastY = event.touches[0].pageY
  },
  handletap:function(event) {
    console.log(event)
  },
})
