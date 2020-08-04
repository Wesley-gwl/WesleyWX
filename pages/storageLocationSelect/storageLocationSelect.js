// pages/storageLocationSelect/storageLocationSelect.js
const config = require("../../configurl");
var header;
var that;
Page({
  data: {
    storageIndex: 0,
    locationId: '',
    list:[],
  },
  onClickNav({ detail = {} }) {
    this.setData({
      storageIndex: detail.index,
    });
  },
  onClickItem({ detail = {} }) {
    const locationId = this.data.locationId === detail.id ? '' : detail.id;
    this.setData({ locationId });
  },
  //获取仓库下拉框
  getStorageList:function(){
    wx.request({
      url: config.getStorageInfoSelectTree_url,
      method: 'get',
      header: header,//传在请求的header里
      success(res) {
        if(res.data.success&&res.data.data.length>0){
          that.setData({
            list : res.data.data,
          })
        }
      }
    })
  },
  //确定
  onSubmit(e){
    if(that.data.locationId==''){
      wx.navigateBack({//返回上一页
        delta: 1
      })
      return;
    }
    var list = that.data.list;
    var storageLocation={};
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    var storage =list[that.data.storageIndex];
    for (let index = 0; index < storage.children.length; index++) {
      const e = storage.children[index];
      if(e.id== that.data.locationId){
        storageLocation = e;
        break;
      }
    }
    prevPage.setData({
      storage:{
        type:storage.id,
        name:storage.text
      },
      storageLocation:{
        type:storageLocation.id,
        name:storageLocation.text
      }
    })
    wx.navigateBack({//返回上一页
      delta: 1
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
    that=this;
    if(header==null){
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
      header = {
        //'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'sessionKey':key//读取cookie
      };
    }
    that.getStorageList();
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