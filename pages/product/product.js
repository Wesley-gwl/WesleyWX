const config = require("../../configurl");

// pages/product/product.js
var header;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    config:{},//url路径
   
    //左侧分类
    leftList: [
      {
        title: '销售单',
        index:'0',
        id:'100'
      },
      {
        title: '调货销售单',
        index:'1',
        id:'101'
      },
      {
        title: '零售单',
        index:'2',
        id:'102'
      },
      {
        title: '销售退货单',
        index:'3',
        id:'103'
      }

    ],
    idx: 0,
    scrollTop: 0,
    toView:'position0',
    //商品列表
    productlist:[{
      index:"0",
      id:"1",
      name:"轻座开关1",
      code:"123",
      spec:"456",
      number:"0",
      price:"3"
    },
    {
      index:"1",
      id:"13333333",
      name:"轻座开关2",
      code:"234",
      spec:"456",
      number:"0",
      price:"3"
    },
    {
      index:"2",
      id:"13333333",
      name:"轻座开关2",
      code:"234",
      spec:"456",
      number:"0",
      price:"3"
    },
    {
      index:"3",
      id:"13333333",
      name:"轻座开关2",
      code:"234",
      spec:"456",
      number:"0",
      price:"3"
    },
    {
      index:"4",
      id:"13333333",
      name:"轻座开关2",
      code:"234",
      spec:"456",
      number:"0",
      price:"3"
    },
    {
      index:"5",
      id:"13333333",
      name:"轻座开关2",
      code:"234",
      spec:"456",
      number:"0",
      price:"3"
    },
    {
      index:"6",
      id:"13333333",
      name:"轻座开关2",
      code:"234",
      spec:"456",
      number:"0",
      price:"3"
    },
    {
      index:"7",
      id:"13333333",
      name:"轻座开关2",
      code:"234",
      spec:"456",
      number:"0",
      price:"3"
    },
    {
      index:"8",
      id:"13333333",
      name:"轻座开关2",
      code:"234",
      spec:"456",
      number:"0",
      price:"3"
    }
  ]
  },
  //修改数量
  handleChangeNumber (e ) {
    var index = e.target.dataset.index;
    var mText = 'productlist['+ index +'].number';
    this.setData({
      [mText]: e.detail.value
    })
  },
  //修改金额
  handleChangePrice (e ) {
    var index = e.target.dataset.index;
    var mText = 'productlist['+ index +'].price';
    this.setData({
      [mText]: e.detail.value
    })
  },
  //分类
  switchClassfun(e){
    var e = e.currentTarget.dataset.index;
    this.setData({ idx: e, toView: 'position' + e })
  },
  //分类绑定
  bindscrollfunc(e){
    var arr = [];
    for(var item of this.data.positions){
      if (item.top <= e.detail.scrollTop + 2){
        arr.push(item)
      }
    }
    this.setData({ idx:arr[arr.length-1].dataset.index })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.config = wx.getStorageSync('config');
    var query = wx.createSelectorQuery();
    wx.createSelectorQuery().selectAll('.position').boundingClientRect(function (rects) {
      that.setData({ positions:rects })
    }).exec();
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
    var that =this;
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
      'content-type': 'application/x-www-form-urlencoded',
      'sessionKey':key//读取cookie
    };
    that.loadProductType();
  },
  loadProductType:function(){
    wx.request({
      url: config.productType_url,
      method: 'get',
      header: header,//传在请求的header里
      success(res) {
        console.log(res);
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