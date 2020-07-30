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
    isLook:false,
    isEdit:false,
    payment:{},//付款单
    applyList:[],
    loadModal:false,
    submitText:"确定",
    showHXTotalAmount:0,
    accountPaymentUrl:"../purchaseAccountPaymentSelect/purchaseAccountPaymentSelect",
    accountCanPaymentUrl:"../purchaseAccountCanPaymentSelect/purchaseAccountCanPaymentSelect",
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },
  //选择单据按钮
  onSelectApply(){
    if(that.data.payment.id==null){
      Notify({ type: 'warning', message: '请先选择对账单',duration: 2000 });
      return
    }else{
      if(that.data.accountCanPaymentUrl!=""){
        var url =that.data.accountCanPaymentUrl+"?customerId="+that.data.payment.customerId;
        wx.navigateTo({
          url:url
        })
      }
    }
  },
  //输入赋值
  onFieldChange(e){
    this.setData({
      [e.target.dataset.key]:e.detail
    });
  },
  onSwichCheck:function(event){
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
        break;
      case 'cell':
        break;
      case 'right':
        that.deleteApply(event);
        break;
    }
    instance.close();
  },
  //删除明细
  deleteApply(event){
    var id = event.currentTarget.dataset.id;
    var newApplyList = [];
    that.data.applyList.forEach(e => {
      if(e.id != id){
        newApplyList.push(e);
      }
    });
    that.setData({applyList:newApplyList});
    that.getShowHXTotalAmount();
  },
  //修改金额
  onChangeAmount(e){
    var list = that.data.applyList;
    var id= e.currentTarget.dataset.id;
    var amount = e.detail;
    var newApplyList =[];
    //判断selectList是否存在
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      if(item.id == id){
        item.HXAmount = amount;
      }
      newApplyList.push(item);
    }
    that.setData({applyList:newApplyList});
    that.getShowHXTotalAmount();
  },
  //计算总金额
  getShowHXTotalAmount(){
    var selectList = that.data.applyList;
    var showHXTotalAmount =0;
    if(selectList.length>0){
      for (let index = 0; index < selectList.length; index++) {
        const item = selectList[index];
        showHXTotalAmount+=Number(item.HXAmount);
      }
    }
    that.setData({showHXTotalAmount:showHXTotalAmount*100});
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
    if(options.accountCheckId!=null){
      that.getAddApplyInfo(options.accountCheckId);
    }
    if(options.id!=null){
      that.getApplyInfo(options.id);
    }
    that.setData({
      loadModal: false
    })
  },
  getApplyInfo:function(id){
    wx.request({
      url: config.getAccountHXForEdit_url,
      method: 'get',
      header: header,//传在请求的header里
      data:{id:id},
      success(res) {
        if(res.data.success){
          return that.loadData(res.data.data);
        }
        else{
          Notify({ type: 'warning', message: res.data.message ,duration: 2000});
          return null;
        }
      }
    })
  },
  //加载编辑查看数据
  loadData:function(output){
    if(output!=null){
      var payment = output.accountHX;
      var applyList = output.accountHXDetails;
      that.setData({
        submitText:"返回",
        isLook:true,
        accountPaymentUrl:"",
        accountCanPaymentUrl:""
      })
      payment = payment.accountPayment;
      var list=[];
      var showHXTotalAmount =0;
      applyList.forEach(e => {
        var temp = e.accountCanPayment;
        temp.HXAmount = e.amount;
        showHXTotalAmount+= Number(e.amount);
        temp.date = temp.date.substring(0,10);
        list.push(temp);
      });
      that.setData({
        payment:payment,
        applyList :list,
        showHXTotalAmount:showHXTotalAmount*100
      })
    }
  },
  //加载新增数据
  getAddApplyInfo:function(accountCheckId){
    wx.request({
      url: config.getAccountCanPaymentAddInfo_url,
      method: 'get',
      header: header,//传在请求的header里
      data:{id:accountCheckId},
      success(res) {
        if(res.data.success){
          var output =res.data.data;
          console.log(output)
          output.accountCanPayment.date = output.accountCanPayment.date.substring(0,10);
          output.accountCanPayment.accountCheckDate= output.accountCanPayment.accountCheckDate.substring(0,10);
          output.accountCheckDetails.forEach(e => {
            e.orderDate =  e.orderDate.substring(0,10);
          });
          that.setData({
            apply:output.accountCanPayment,
            applyList :output.accountCheckDetails,
            status :output.accountCanPayment.status,
            statusName:output.accountCanPayment.statusName,
            type : output.accountCanPayment.type,
            typeName:output.accountCanPayment.typeName,
            customerPaymentType :output.accountCanPayment.customerPaymentType,
            customerPaymentTypeName :output.accountCanPayment.customerPaymentTypeName
          })
        }
        else{
          Notify({ type: 'warning', message: res.data.message ,duration: 2000});
        }
      }
    })
  },
  //提交
  onSubmit:function(){
    if(that.data.isLook){
      wx.navigateBack({//返回上一页
        delta: 1
        })
      return;
    }
    var data =that.data;
    console.log(data);
    if(data.payment.id == null){
      Notify({ type: 'warning', message: '请先选择付款单' ,duration: 2000});
      return ;
    }
    if(data.showHXTotalAmount==0){
      Notify({ type: 'warning', message: '请先选择付款单，金额合计不能为0' ,duration: 2000});
      return ;
    }
    if(data.payment.residueAmount< (data.showHXTotalAmount/100)){
      Notify({ type: 'warning', message: '核销金额不能大于付款单剩余核销金额' ,duration: 2000});
      return ;
    }
    that.setData({
      loadModal: true
    })
    var input = {};
    var AccountHX ={};
    AccountHX.AccountPaymentId = data.payment.id;
    AccountHX.AccountId = data.payment.accountId;
    AccountHX.AccountName = data.payment.accountName;
    AccountHX.Type =1;
    AccountHX.TotalAmount = data.showHXTotalAmount/100;
    var AccountHXDetails = [];
    data.applyList.forEach(item => {
      if(item.HXAmount>0){
        var detail={};
        detail.AccountCanPaymentId = item.id;
        detail.Amount=item.HXAmount;
        detail.TotalAmount = item.totalAmount;
        detail.ResidueAmount = item.residueAmount;
        detail.FinishAmount = item.finishAmount;
        detail.offsetAmount = item.offsetAmount;
        AccountHXDetails.push(detail);
      }
    });
    input.AccountHX=AccountHX;
    input.AccountHXDetails=AccountHXDetails;
    wx.request({
      url: config.saveAccountHX_url,
      method: 'post',
      dataType: "json",
      header: header,//传在请求的header里
      data:JSON.stringify(input),
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
              if(that.data.isEdit){
                wx.navigateBack({//返回上一页
                  delta: 1
                  })
                return;
              }
              setTimeout(function(){ 
                wx.switchTab({//返回上一页
                  url:"../purchase/purchase"
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if(!(that.data.isEdit||that.data.isLook)){
      var time = util.formatDate(new Date());
      this.setData({
        date: time,
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setHeader();
    if(that.data.isLook){
      return;
    }
    this.getShowHXTotalAmount();
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