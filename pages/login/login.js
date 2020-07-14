const APP_ID = 'wx7feabb69bfb3d907';//输入小程序appid  
const APP_SECRET = '40c3f8609b20c4ef5dc00192d130478e';//输入小程序app_secret 
var CODE = ''
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key
Page({
  data: {
    userName: '',
    password: '',
  },
  onLoad:function(){
    this.getOpenId();
  },
  // 获取输入账号 
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 登录 
  login: function () {
    if (this.data.userName.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'loading',
        duration: 2000
      })
    } 
    wx.request({
      url: 'http://localhost:62115/api/WXLogin/WXLogin',
      data: {
        openId: OPEN_ID,
        sessionKey: SESSION_KEY,
        userName: this.data.userName,
        password: this.data.password
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.success == true) {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateTo({
            url: '../page/home/home'
          })
        }
        else {
          wx.showModal({
            title: '登入失败',
            content: res.data.message
          })
        }
      }
    })
  },
  //获取openId
  getOpenId:function(){
    wx.login({
      success: function (res) {
        wx.request({
          //获取openid接口  
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: APP_ID,
            secret: APP_SECRET,
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          method: 'GET',
          success: function (res) {
            OPEN_ID = res.data.openid;//获取到的openid  
            SESSION_KEY = res.data.session_key;//获取到session_key  
            console.log(res.data)
          }
        })
      }
    })
   
  },
})

