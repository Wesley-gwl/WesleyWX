const config = require("../../configurl");

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
    else{
      wx.request({
        url: config.loginVerify_url,
        method: 'get',
        header:  {
          'sessionKey':key
        },//传在请求的header里
        success(res) {
          if(res.data.success==false){
            wx.switchTab({
              url:'/pages/login/login'
            })
            wx.showModal({
              title: '提示',
              content: '请先登入',
              duration: 2000
            })
          }
        }
      })
    }
  },
  onLoad:function(){
    
  }
});