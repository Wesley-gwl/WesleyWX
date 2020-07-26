var util = require('../../utils/util.js');
const config = require("../../configurl");
import Notify from '../../dist/notify/notify';
var header;
var that;
Page({
  data: {
    eTime:'',
    sTime:'',
    show:false,
    searchText:'',
    customerId:'',
    productName:'',
    productId:'',
    applyList:[],//加载行
    selectList:[],//选中行
    totalPrice:0
  },
  //查询
  onSearch(){
    this.getPurchaseList();
  },
  //多条件查询
  onSearchMore(){
    this.setData({ show: false });
    this.getPurchaseList();
  },
  //选择状态
  onSelectStatus(event){
    this.setData({ showStatusSelect: true });
    if(event.detail.status != null){
      this.setData({ statusName: event.detail.name ,status:event.detail.status});
    }
  },
  //关闭状态选择
  onCloseStatus(){
    this.setData({ showStatusSelect: false });
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
  //关闭更多条件筛选
  onCloseMore() {
    this.setData({ show: false });
    this.getPurchaseList();
  },
  //分页按钮
  onPaged ({ detail }) {
    const type = detail.type;
    if (type === 'next') {
        this.setData({
            current: this.data.current + 1
        });
    } else if (type === 'prev') {
        this.setData({
            current: this.data.current - 1
        });
    }
    this.getPurchaseList();
  },
  //选中
  switchChange:function(event) {
    var isCheck= event.detail.value;
    var data = that.data;
    var select = {};
    //先找到数据
    var id = event.currentTarget.dataset.id;
    for (let index = 0; index < data.applyList.length; index++) {
      if(data.applyList[index].applyItemId==id){
        select = data.applyList[index];
        break;
      } 
    }
    if(isCheck){
      data.selectList.push(select);
    }
    else{
      var newlist =[];
      data.selectList.forEach(e => {
        if(e.applyItemId!=id){
          newlist.push(e);
        }
      });
      that.setData({
        selectList:newlist
      })
    }
    that.calculateTotalPrice();
  },
  //全选
  onSelectAll:function(event){
    var isCheck= event.detail.value;
    var data =that.data;
    var newList = [];
    data.applyList.forEach(e => {
      e.isCheck =isCheck;
      newList.push(e);
    });
    that.setData({
      selectList:(isCheck?data.applyList:[]),
      applyList:newList
    })
    that.calculateTotalPrice();
  },
  //计算总价
  calculateTotalPrice:function(){
    var totalPrice = 0;
    that.data.selectList.forEach(e => {
      totalPrice+=e.totalPrice;
    });
    that.setData({
      totalPrice:totalPrice*100
    })
  },
  //提交
  onSubmit:function(){
    var that = this;
    var list = that.data.selectList;
    if(list.length>0)
      var result = [];
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      if(prevPage.data.applyList.length > 0){
        result = prevPage.data.applyList;
      }
      list.forEach(p => {
        var isExist = false;
        for (let i = 0; i < prevPage.data.applyList.length; i++) {
          const element = prevPage.data.applyList[i];
          if(element.applyItemId==p.applyItemId){
            isExist=true;
            break;
          }
        }
        if(!isExist){
          result.push(p);
        }
      });
      prevPage.setData({
        applyList: result
      })
      wx.navigateBack({//返回上一页
        delta: 1
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var stime = util.formatDateAdd(new Date(),-3);
    var dtime = util.formatDateAdd(new Date(),1);
    this.setData({
      sTime: stime,
      eTime: dtime,
    });
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
      'sessionKey':key
    };
    this.getPurchaseList();
  },
  //获取信息
  getPurchaseList:function(){
    var data = that.data;
    var input ={};
    input.Filter = data.searchText;
    input.FromTime = data.sTime;
    input.ToTime = data.eTime;
    input.customerId = data.customerId;
    input.customerType =2;
    wx.request({
      url: config.getAccountNotCheckPurchase_url,
      method: 'post',
      dataType:"json",
      header: header,//传在请求的header里
      data:input,
      success(res) {
        if(res.data.success){
          if( res.data.data.length == 0){
            Notify({ type: 'primary', message: '无数据',duration: 2000 });
          }
          else{
            res.data.data.forEach((item) => {
              item.orderDate = item.orderDate.substring(0, 10); //要截取时间的字符串
            })
            that.setData({
              applyList : res.data.data,
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    if(options.customerId!=null){
      that.setData({
        customerId: options.customerId
      })
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