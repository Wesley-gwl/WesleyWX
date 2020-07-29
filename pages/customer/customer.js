const config = require("../../configurl");
var header;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    config:{},//url路径
    //左侧分类
    customerTypeList: [],
    //商品列表
    customerList:[],
    idx:1000,
    radio: '1',
    customerIndex:-1
  },
  //分类d点击
  getCustomerList(re){
    var that = this;
    var index = re.currentTarget.dataset.index;
    that.setData({ idx: index })
    var e = re.currentTarget.dataset.id;
    wx.request({
      url: config.customerList_url,
      method: 'post',
      header: header,//传在请求的header里
      data:{
        CustomerTypeId:e,
        IgnoreType:0
      },
      success(res) {
        if(res.data.success){
          that.setData({
            customerList:res.data.data,
            customerIndex:-1,
            radio: '1'
          });
        }
      }
    })
    },
    onSearch:function(e){//回车触发
      var searchtext = "";
      if(e!=null){
        searchtext= e.detail;
      }
      var that = this;
      wx.request({
        url: config.customerList_url,
        method: 'post',
        header: header,//传在请求的header里
        data:{
          Filter:searchtext,
          IgnoreType:1
        },
        success(res) {
          if(res.data.success){
            that.setData({
              customerList:res.data.data
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
    onSubmit:function(){
      var that = this;
      var customer ={};
      if(that.data.customerIndex!=-1&&that.data.customerList.length>0){
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
       
        that.data.customerList.forEach(e => {
          if(e.index == that.data.customerIndex){
            customer = e;
          }
        });
        console.log(customer);
        prevPage.setData({
          customer: customer
        })
      }
    
      wx.navigateBack({//返回上一页
        delta: 1
      })
    },
    onClick(event) {
      var data= event.currentTarget.dataset;
      console.log(data);
      this.setData({
        radio:data.name,
        customerIndex:data.index
      });
      console.log(this.data.radio);
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
        wx.showToast({
          title: '请先登入',
          duration: 2000
        })
      }
      header = {
        'content-type': 'application/x-www-form-urlencoded',
        'sessionKey':key//读取cookie
      };
      that.GetCustomerType();
      that.onSearch();
    },
    GetCustomerType:function(){
      var that = this;
      wx.request({
        url: config.customerType_url,
        method: 'get',
        header: header,//传在请求的header里
        success(res) {
          if(res.data.success){
            that.setData({
              customerTypeList:res.data.data
            });
          }
        //请求成功的处理
        }
      })
    },
  /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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