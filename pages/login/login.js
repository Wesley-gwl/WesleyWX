import Toast from '../../dist/toast/toast';
import Notify from '../../dist/notify/notify';
const app = getApp();
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key

Page({
  //数据
  data: {
    config:{},//url路径
    userName: '',
    password: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    menuitems: [
      // { text: '完善信息', url: '../userinfo/userinfo', icon: '../../images/message.png', tips: '' },
      { text: '注销', bindtap: 'logout', icon: '../../images/logout.png', tips: '' },
    ]
  },
  //页面加载
  onLoad: function (options) {
    var that = this;
    if (app.globalData.userInfo) {
      that.setUserInfo(app.globalData.userInfo);
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setUserInfo(res.userInfo);
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          that.setUserInfo(res.userInfo);
        }
      })
    }
  },
  //页面加载，只加载一次
  onReady:function(){
    this.data.config = wx.getStorageSync('config');
    console.log(this.config);
    this.setData({
      indexHidden:true
    })
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
    var that = this;
    if (that.data.userName.length == 0 || that.data.password.length == 0) {
      Toast.fail('用户名和密码不能为空');
      return;
    } 
    wx.request({
      url: that.data.config.login_url,
      data: {
        openId: OPEN_ID,
        sessionKey: SESSION_KEY,
        userName: that.data.userName,
        password: that.data.password
      },
      method: 'POST',
      success: function (res) {
        if (res.data.success == true) {
          Notify({ type: 'success', message: '登入成功' });
          //设置sessionkey
          wx.setStorageSync('key', SESSION_KEY);
           that.setData({
              loginHidden:true,
              indexHidden:false
            })
        }
        else {
          Toast.fail(res.data.message);
        }
      }
    })
  },
  //注册
  register:function(){
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },
  //获取openId默认登入
  getOpenId:function(){
    var that= this;
    wx.login({
      success: function (res) {
        wx.request({
          //获取openid接口  
          url:  that.data.config.getWXOpenID_url,
          data: {
            code:res.code
          },
          method: 'GET',
          success: function (res) {
            OPEN_ID = res.data.data.openid;//获取到的openid  
            SESSION_KEY = res.data.data.session_key;//获取到session_key 
            wx.request({
              url:  that.data.config.loginAuto_url,
              data: {
                openId: OPEN_ID,
                sessionKey: SESSION_KEY,
              },
              method: 'POST',
              success: function (res) {
                if (res.data.success == true) {
                  Notify({ type: 'success', message: '登入成功' });
                  //设置sessionkey
                  wx.setStorageSync('key', SESSION_KEY);
                  that.setData({
                    loginHidden:true,
                    indexHidden:false
                  })
                }
              }
            }) 
          }
        })
      }
    })
  },
  //获取微信头像名称
  getUserInfo: function (e) {
    this.setUserInfo(e.detail.userInfo);
  },
  //设置微信头像名称
  setUserInfo: function (userInfo) {
    if (userInfo != null) {
      app.globalData.userInfo = userInfo
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    }
  },
  //注销
  logout:function(){
    wx.showToast({
      title: '注销成功',
      icon: 'success',
      duration: 2000
    });
    this.setData({
      loginHidden:false,
      indexHidden:true,
      userName:"",
      password:""
    })
    wx.removeStorageSync('key')
  }
})

