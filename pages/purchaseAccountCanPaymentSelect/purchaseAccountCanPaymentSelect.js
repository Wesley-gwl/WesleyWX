var util = require('../../utils/util.js');
const config = require("../../configurl");
import Notify from '../../dist/notify/notify';
var header;
var that;
Page({
  data: {
    searchText:'',
    eTime:'',
    sTime:'',
    show:false,
    customerId:'',
    applyList:[],
    selectList:[],
    showHXTotalAmount:0,
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
    var dtime = util.formatDateAdd(new Date(),3);
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
  //修改金额
  onChangeAmount(e){
    var list = that.data.applyList;
    var selectList = that.data.selectList;
    var id= e.currentTarget.dataset.id;
    var amount = e.detail;
    var select={};
    var newApplyList =[];
    //找到对应的数据
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      if(item.id == id){
        select = item;
        select.HXAmount = amount;
        break;
      }
    }
    var isChagne=false;
    //判断selectList是否存在
    if(selectList.length>0){
      for (let index = 0; index < selectList.length; index++) {
        const item = selectList[index];
        if(item.id == id){
          isChagne=true;
          item.HXAmount = amount;
        }
        if(item.HXAmount!=0){
          newApplyList.push(item);
        }
      }
      if(!isChagne){
        newApplyList.push(select);
      }
    }else{
      newApplyList.push(select);
    }
    
    that.setData({selectList:newApplyList});
    that.getShowHXTotalAmount();
  },
  //计算总金额
  getShowHXTotalAmount(){
    var selectList = that.data.selectList;
    var showHXTotalAmount =0;
    for (let index = 0; index < selectList.length; index++) {
      const item = selectList[index];
      showHXTotalAmount+=Number(item.HXAmount);
    }
    that.setData({showHXTotalAmount:showHXTotalAmount*100});
  },
  //提交
  onSubmit(){
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
          if(element.id==p.id){
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    var stime = util.formatDateAdd(new Date(),-3);
    var dtime = util.formatDateAdd(new Date(),3);
    this.setData({
      sTime: stime,
      eTime: dtime,
    });
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
    if(options.customerId!=""){
      that.setData({ customerId: options.customerId });
      that.getAccountCanPaymentList();
    }
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  //获取信息
  getAccountCanPaymentList:function(){
    var data = that.data;
    var input ={};
    input.Filter = data.searchText;
    input.FormTime = data.sTime;
    input.ToTime=data.eTime;
    input.isHX = true;
    input.Type = 1;
    if(data.customerId!=null){
      input.customerId = data.customerId;
    }
    wx.request({
      url: config.getListByPageOfAccountHX_url,
      method: 'post',
      dataType: "json",
      header: header,//传在请求的header里
      data:JSON.stringify(input),
      success(res) {
        if(res.data.success&& res.data.data.total>0){
          res.data.data.rows.forEach((item) => {
            item.date = item.date.substring(0, 10); //要截取时间的字符串
          })
          that.setData({
            applyList : res.data.data.rows,
          })
        }
        else{
          Notify({ type: 'primary', message: '没有数据',duration: 2000 });
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