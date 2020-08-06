var util = require('../../utils/util.js');
const config = require("../../configurl");
import Notify from '../../dist/notify/notify';
var header;
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isEdit:false,
    product:{},
    storage:{},
    loadModal:false,
    addProductUrl:"../productSelect/productSelect",
    showLocationSelect:false,
    locationList:[]
  },
  
  //选择库位
  onSelectLocation:function(event){
    that.setData({ showLocationSelect: true });
    if(event.detail.type != null){
      var product = that.data.product;
      product.toStorageLocationName = event.detail.name;
      product.toStorageLocationId = event.detail.type;
      that.setData({ 
        product: product,
      })
    }
  },
  //输入赋值
  onFieldChange(e){
    this.setData({
      [e.target.dataset.key]:e.detail
    });
  },
  //关闭类型选择
  onClose() {
    this.setData({ 
      showLocationSelect: false ,
    });
  },
  //提交
  onSubmit:function(){
    var data =that.data;
    if(data.product.id == null){
      Notify({ type: 'warning', message: '请先选择商品' ,duration: 2000});
      return ;
    }
    if(data.product.toStorageLocationId== null){
      Notify({ type: 'warning', message: '请选择货架',duration: 2000 });
      return ;
    }
    if(Number(data.product.number)<=0){
      Notify({ type: 'warning', message: '数量不能小于0',duration: 2000 });
      return ;
    }
    that.setData({
      loadModal: true
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    var productList= prevPage.data.productList;
    var product = data.product;
    product.toStorageLocationName =  product.toStorageLocationName.split('-')[0];
    productList.push(product);
    prevPage.setData({
      productList: productList
    })
    wx.navigateBack({//返回上一页
      delta: 1
    })
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
    if(options.storage!=null){
      var storage = JSON.parse(options.storage);
      that.setData({
        storage: storage
      })
    }
  
    that.setData({
      loadModal: false
    })
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
    if(that.data.product.id!=null){
      that.getLocationList();
    }
  },
  //获取库位下拉框
  getLocationList:function(){
    var id= that.data.storage.id;
    var productId = that.data.product.id;
    wx.request({
      url: config.getStorageLocationInventoryCombobox_url,
      method: 'get',
      header: header,//传在请求的header里
      data:{
        id:id,
        productId:productId
      },
      success(res) {
        if(res.data.success){
          var list = res.data.data;
          list.push({type:"0",name:'1313'})
          that.setData({
            locationList :list ,
          })
        }
      }
    })
  },
  //加载
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
        //'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
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