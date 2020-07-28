var util = require('../../utils/util.js');
const config = require("../../configurl");
import Dialog from '../../dist/dialog/dialog';
import Notify from '../../dist/notify/notify';
var header;
var that;
Page({
  data: {
    eTime:'',
    sTime:'',
    show:false,
    searchText:'',
    customer:{},
    applyList:[],
    status:0,//新建
    radio:''
  },
  //查询
  onSearch(){
    this.getAccountCheckList();
  },
  //多条件查询
  onSearchMore(){
    this.setData({ show: false });
    this.getAccountCheckList();
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
      status:-1,
      statusName:"全部",
      sTime: stime,
      eTime: dtime,
    });
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
  //关闭更多条件筛选
  onCloseMore() {
    this.setData({ show: false });
    this.getAccountCheckList();
  },
  //提交
  onSubmit:function(){
    var data = that.data;
    if(data.radio !=''){
      var url = "../purchaseAccountCanPaymentAddOrEdit/purchaseAccountCanPaymentAddOrEdit?accountCheckId="+data.radio ;
      wx.navigateTo({
        url:url
      })
    }else{
      wx.navigateBack({//返回上一页
        delta: 1
      })
    }
   
  },
  //生命周期加载
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var stime = util.formatDateAdd(new Date(),-2);
    var dtime = util.formatDateAdd(new Date());
    this.setData({
      sTime: stime,
      eTime: dtime,
    });
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
    this.getAccountCheckList();
  },
  //获取信息
  getAccountCheckList:function(){
    var data = that.data;
    var input ={};
    input.Filter = data.searchText;
    input.FromTime = data.sTime;
    input.ToTime =data.eTime;
    input.Status = data.status;
    input.Type =1;
    if(data.customer.id!=null){
      input.customerId = data.customer.id;
    }
    wx.request({
      url: config.getAccountCheckList_url,
      method: 'post',
      dataType: "json",
      header: header,//传在请求的header里
      data:JSON.stringify(input),
      success(res) {
        if(res.data.success){
          var total = parseInt(res.data.data.total/data.rows);
          if(res.data.data.total%data.rows!=0){
            total++;
          }
          res.data.data.rows.forEach((item) => {
            item.date = item.date.substring(0, 10); //要截取时间的字符串
          })
          that.setData({
            applyList : res.data.data.rows,
            total:total
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