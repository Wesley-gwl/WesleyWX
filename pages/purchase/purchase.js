// pages/purchase.js
Page({
  data:{
    isShowSideslip: false,
    sideslipMenuArr: ['嘿嘿', '哈哈', '啊啊啊', '通通通', '啪啪啪', '嘿嘿嘿', '哒哒哒']
  },
  show: function() {
    this.setData({
      isShowSideslip: true
    })
  },
  offSideslipMen: function(){
    this.setData({
      isShowSideslip: false
    })
  }
  ,
  itemClick: function(e) {
    var tapId = e.currentTarget.id;
    var index = this;
    for (var i = 0; i < index.data.sideslipMenuArr.length;i++){
      if (tapId == i){
        wx.showToast({
          title: index.data.sideslipMenuArr[i],
          icon: 'none',
          image: '',
          duration: 1000,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    }
  }
})