const config = require("../../configurl");
var header;
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    config:{},//url路径
    //左侧分类
    productTypeList: [],
    //商品列表
    productList:[],
    idx:1000,
    radio:''
  },
  
  //分类d点击
  getProductList(re){
    var that = this;
    var index = re.currentTarget.dataset.index;
    that.setData({ idx: index })
    var e = re.currentTarget.dataset.id;
    wx.request({
      url: config.productList_url,
      method: 'post',
      header: header,//传在请求的header里
      data:{
        ProductTypeId:e
      },
      success(res) {
        if(res.data.success){
          that.setData({
            productList:res.data.data
          });
        }
      }
    })

  },
  //查询
  onSearch:function(e){//回车触发
    var searchtext = "";
    if(e!=null){
      searchtext= e.detail;
    }
   
    var that = this;
    wx.request({
      url: config.productList_url,
      method: 'post',
      header: header,//传在请求的header里
      data:{
        Filter:searchtext
      },
      success(res) {
        if(res.data.success){
          that.setData({
            productList:res.data.data
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.config = wx.getStorageSync('config');
    wx.createSelectorQuery().selectAll('.position').boundingClientRect(function (rects) {
      that.setData({ positions:rects })
    }).exec();
  },
  //选择
  onChangeRadio(event) {
    if(event.detail == that.data.radio){
      this.setData({
        radio:'',
      });
    }
    else{
      this.setData({
        radio: event.detail,
      });
    }
  },
  //确定
  onSubmit:function(){
    if(that.data.radio==''){
      wx.navigateBack({//返回上一页
        delta: 1
      })
      return;
    }
    var list = that.data.productList;

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    for (let index = 0; index < list.length; index++) {
      const e = list[index];
      if(e.id== that.data.radio){
        prevPage.setData({
          product: e
        })
        wx.navigateBack({//返回上一页
          delta: 1
        })
        return;
      }
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
    that =this;
    var key = wx.getStorageSync("key");
    console.log(key);
    if(!key){
      wx.switchTab({
        url:'/pages/login/login'
      })
      wx.showToast({
        title: '请先登入',
        duration: 2000
      })
    }
    header = {
      'content-type': 'application/x-www-form-urlencoded',
      'sessionKey':key//读取cookie
    };
    that.GetProductType();
    that.onSearch();
  },
  GetProductType:function(){
    var that = this;
    wx.request({
      url: config.productType_url,
      method: 'get',
      header: header,//传在请求的header里
      success(res) {
        if(res.data.success){
          that.setData({
            productTypeList:res.data.data
          });
        }
      //请求成功的处理
      }
    })
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