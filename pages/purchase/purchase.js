
Page({
  data: {
    
  },
  onShow: function () {
    var key = wx.getStorageSync("key");
    console.log(key);
    if(!key){
      wx.switchTab({
        url:'/pages/login/login'
      })
      wx.showModal({
        title: '提示',
        content: '请先登入',
        duration: 2000
      })
    }
    var header;
    header = {
      'content-type': 'application/x-www-form-urlencoded',
      'sessionKey':key//读取cookie
    };
    // wx.request({
    //   url: realURL,
    //   method: method,
    //   header: header,//传在请求的header里
    //   data: datas,
    //   success(res) {
    //   //请求成功的处理
    //   }
    // )}
  },
  onLoad:function(){
    
  }
});