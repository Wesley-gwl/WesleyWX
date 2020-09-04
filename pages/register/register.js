const config = require("../../configurl");
import Notify from '../../dist/notify/notify';
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    loadModal:false,
  },
  //输入赋值
  onFieldChange(e){
    this.setData({
      [e.target.dataset.key]:e.detail
    });
  },
  //提交
  onSubmit:function(){
    that =this;
    var user =that.data.user;
    if(user.phoneNumber == null){
      Notify({ type: 'warning', message: '请填写手机号' ,duration: 2000});
      return ;
    }
    if(user.password== null){
      Notify({ type: 'warning', message: '请填写密码',duration: 2000 });
      return ;
    }
    if(user.password.length<6){
      Notify({ type: 'warning', message: '密码不能小于6位',duration: 2000 });
      return ;
    }
    if(user.password2== null){
      Notify({ type: 'warning', message: '请填写确认密码',duration: 2000 });
      return ;
    }
    if(user.password2!= user.password){
      Notify({ type: 'warning', message: '两次密码不一致',duration: 2000 });
      return ;
    }
    if(user.userName== null){
      Notify({ type: 'warning', message: '请填写用户名',duration: 2000 });
      return ;
    }
    if(user.company== null){
      Notify({ type: 'warning', message: '请填写公司',duration: 2000 });
      return ;
    }
    that.setData({
      loadModal: true
    })
    wx.request({
      url: config.register_url,
      method: 'post',
      dataType: "json",
      data:JSON.stringify(user),
      success(res) {
        if(res.data.success){
          that.setData({
            loadModal: false
          })
          wx.showToast({
            title: '注册成功',//提示文字
            duration:1500,//显示时长
            mask:true,//是否显示透明蒙层，防止触摸穿透，默认：false  
            icon:'success', //图标，支持"success"、"loading"  
            success:function(){ 
              setTimeout(function(){ 
                wx.switchTab({
                  url:'/pages/login/login'
                })
              },1500);
            },//接口调用成功
            fail: function () { },  //接口调用失败的回调函数  
            complete: function () { } //接口调用结束的回调函数  
          })
        }
        else{
          that.setData({
            loadModal: false
          })
          Notify({ type: 'warning', message: res.data.message ,duration: 2000});
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },
  setHeader:function(){
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})