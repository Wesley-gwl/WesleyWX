const config = require("../../configurl");
var header;
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isEdit:false,
    storageLocation:{
      shLength:10,
      shWidth:10,
      shHeight:10,
      sry:0,
      srx:0,
      code:"自动生成"
    },//货架
    loadModal:false,
  },
  
  //输入赋值
  onFieldChange(e){
    this.setData({
      [e.target.dataset.key]:e.detail
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setHeader();
    that.setData({
      loadModal: true
    })
    if(options.data!=null){
      var location = JSON.parse(options.data);
      that.setData({
        storageLocation:location,
      })
    }
    that.setData({
      loadModal: false
    })
  },
  //提交
  onSubmit:function(){
    var data =that.data;
    console.log(data.storageLocation);
    if(data.storageLocation.name == null){
      Notify({ type: 'warning', message: '请填写名称' ,duration: 2000});
      return ;
    }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    var list =[];
    if(data.storageLocation.id!=null){
        for (let index = 0; index < prevPage.data.storageLocationList.length; index++) {
          const e = prevPage.data.storageLocationList[index];
          if(e.id== data.storageLocation.id){
            var temp =data.storageLocation;
            temp.storageId = e.id;
            list.push(temp);
          }else{
            list.push(e);
          }
        }
    }else{
      list=prevPage.data.storageLocationList;
      list.push(data.storageLocation);
    }
    prevPage.setData({
      storageLocationList: list
    })
    wx.navigateBack({//返回上一页
      delta: 1
      })
    return;
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
    this.setHeader();
  },
  setHeader:function(){
    if(header==null||header=={}){
      var key = wx.getStorageSync("key");
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
        'sessionKey':key//读取cookie
      };
    }
    
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