var util = require('../../utils/util.js');
const config = require("../../configurl");
var header;
var that;
Page({
  data: {
    searchText:'',
    eTime:'',
    sTime:'',
    show:false,
    customer:{},
    applyList:[],
    selectList:[],
  },
  //查询
  onSearch(){
    this.setData({ show: false });
    this.getAccountCanPaymentList();
  },
  //修改search控件值
  onChangeSearch(e){
    this.setData({ searchText: e.detail });
  },
  //展示更多条件筛选
  onShowMore(e){
    this.setData({ show: true });
  },
  //重置条件筛选
  clearMore(){
    var stime = util.formatDateAdd(new Date(),-3);
    var dtime = util.formatDateAdd(new Date(),1);
    this.setData({
      searchText: '',
      customer:{},
      sTime: stime,
      eTime: dtime,
    });
  },
  //修改search控件值
  onChangeSearch(e){
    this.setData({ searchText: e.detail });
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
      'sessionKey':key//读取cookie
    };
    this.getAccountCanPaymentList();
  },
  //获取信息
  getAccountCanPaymentList:function(){
    var data = that.data;
    var input ={};
    input.Filter = data.searchText;
    input.isHX = true;
    input.Type =1;
    if(data.customer.id!=null){
      input.customerId = data.customer.id;
    }
    wx.request({
      url: config.getAccountCanPaymentList_url,
      method: 'post',
      dataType: "json",
      header: header,//传在请求的header里
      data:JSON.stringify(input),
      success(res) {
        console.log(res.data);
        if(res.data.success){
          res.data.data.rows.forEach((item) => {
            item.date = item.date.substring(0, 10); //要截取时间的字符串
          })
          that.setData({
            applyList : res.data.data.rows,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that=this;
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