const config = require("../../configurl");
import Notify from '../../dist/notify/notify';
var header;
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    product:{
      status:0,
      salesPrice:0,
      purchasePrice:0,
      tradePrice:0
    },
    isEdit:false,
    productTypeList:[],
    loadModal:false,
    showTypeSelect:false,
  },
  //选择类型
  onSelectType:function(event){
    that.setData({ showTypeSelect: true });
    if(event.detail.type != null){
      that.setData({ 
       ['product.productTypeId']:event.detail.type,
       ['product.productTypeName']:event.detail.name,
      })
    }
  },
 
  //关闭类型选择
  onClose() {
    this.setData({ 
      showTypeSelect: false ,
    });
  },
  //输入赋值
  onFieldChange(e){
    this.setData({
      [e.target.dataset.key]:e.detail
    });
  },
  //获取分类下拉框
  GetproductType:function(){
    wx.request({
      url: config.productType_url,
      method: 'get',
      header: header,//传在请求的header里
      data:{type:0},
      success(res) {
        if(res.data.success&& res.data.data.length>0){
          var list = [];
          res.data.data.forEach(e => {
            list.push({
              type:e.id,
              name:e.name
            });
          });
          list.push({type:0,name:'1231'});
          that.setData({
            productTypeList:list
          });
        }
      //请求成功的处理
      }
    })
  },
  //提交
  onSubmit:function(){
    var product =that.data.product;
    if(product.name == null){
      Notify({ type: 'warning', message: '请填写名称' ,duration: 2000});
      return ;
    }
    if(product.spec== null){
      Notify({ type: 'warning', message: '请填写规格',duration: 2000 });
      return ;
    }
    if(product.productTypeId== null){
      Notify({ type: 'warning', message: '请选择客户分类',duration: 2000 });
      return ;
    }
    if(product.unit== null){
      Notify({ type: 'warning', message: '请填写单位',duration: 2000 });
      return ;
    }
    if(product.purchasePrice<0){
      Notify({ type: 'warning', message: '请填写进货价',duration: 2000 });
      return ;
    }
    if(product.salesPrice<0){
      Notify({ type: 'warning', message: '请填写批发价',duration: 2000 });
      return ;
    }
    if(product.tradePrice<0){
      Notify({ type: 'warning', message: '请填写零售价',duration: 2000 });
      return ;
    }
    that.setData({
      loadModal: true
    })
    wx.request({
      url: config.saveProduct_url,
      method: 'post',
      dataType: "json",
      header: header,//传在请求的header里
      data:JSON.stringify(product),
      success(res) {
        if(res.data.success){
          that.setData({
            loadModal: false
          })
          wx.showToast({
            title: '操作成功',//提示文字
            duration:1000,//显示时长
            mask:true,//是否显示透明蒙层，防止触摸穿透，默认：false  
            icon:'success', //图标，支持"success"、"loading"  
            success:function(){ 
              setTimeout(function(){ 
                wx.navigateBack({//返回上一页
                delta: 1
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
    that = this;
    that.setHeader();
    if(options.product!=null){
      var product = JSON.parse(options.product);
      that.setData({
        product:product
      })
    }
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
    that.GetproductType();
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