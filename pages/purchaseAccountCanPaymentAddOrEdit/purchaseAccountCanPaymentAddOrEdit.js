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
    showPaymentTypeSelect: false,
    paymentTypeList:[{
      type:'0',
      name: '天结',
    },
    {
      type:'1',
      name: '当月结',
    },
    {
      type:'2',
      name: '月结',
    },
    {
      type:'3',
      name: '季结',
    },
    {
      type:'4',
      name: '其他',
    },
    {
      type:'4',
      name: '其他',
    }],
    showTicketTypeSelect: false,
    ticketTypeList:[
      {
        type:'0',
        name: '不开票',
      },
      {
        type:'1',
        name: '普通发票',
      },
      {
        type:'2',
        name: '增值发票',
      },
      {
        type:'3',
        name: '其他发票',
      },
      {
        type:'3',
        name: '其他发票',
      }
    ],
    memo:"",
    apply:{},
    applyList:[],
    loadModal:false,
    submitText:"提交",
    checkUrl:"../purchaseAccountCheckSelect/purchaseAccountCheckSelect",
    purchaseUrl:"../purchaseNotCheckList/purchaseNotCheckList",
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
    if(that.data.customer.id==null){
      Notify({ type: 'warning', message: '请先选择供应商',duration: 2000 });
      return
    }else{
      if(that.data.purchaseUrl!=""){
        var url =that.data.purchaseUrl+"?customerId="+that.data.customer.id;
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
  //选择结算方式
  onSelectPaymentType(event){
    this.setData({ showPaymentTypeSelect: true });
    var apply = that.data.apply;
    apply.customerPaymentTypeName=event.detail.name ;
    apply.customerPaymentType=event.detail.type ;
   
    if(apply.accountCheckId != null&&event.detail.type!=null){
      wx.request({
        url: config.getPaymentDays_url,
        method: 'get',
        header: header,//传在请求的header里
        data:{
          type :event.detail.type,
          accountCheckDate: apply.accountCheckDate
        },
        success(res) {
          if(res.data.success){
            var re =res.data.data;
            apply.paymentDays =re.paymentDays;
            apply.date = re.date.substring(0,10);
            that.setData({ 
              apply: apply
            })
          }
        }
      })
    }
    else{
      this.setData({ 
        apply: apply
      })
    }
  },
  //选择开票方式
  onSelectTicketType(event){
    this.setData({ showTicketTypeSelect: true });
    var apply = that.data.apply;
    apply.ticketTypeName=event.detail.name ;
    apply.ticketType=event.detail.type ;
    if(event.detail.type != null){
      this.setData({ 
        apply: apply
      })
    }
  },
  //关闭类型选择
  onClose() {
    this.setData({ 
      showTicketTypeSelect: false ,
      showPaymentTypeSelect:false
    });
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
    if(data.apply.accountCheckId == null){
      Notify({ type: 'warning', message: '请先选择采购对账单' ,duration: 2000});
      return ;
    }
    that.setData({
      loadModal: true
    })
    var input = {};
    input.AccountCanPayment = data.apply;
    input.AccountCanPayment.memo = data.memo;
    wx.request({
      url: config.saveAccountCanPayment_url,
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
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
      url: config.getAccountCanPaymentForEdit_url,
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
      var apply = output.accountCanPayment;
      if(apply.status!=0){
        that.setData({
          submitText:"返回",
          isLook:true,
          checkUrl:"",
          productUrl:""
        })
      }
      else{
        that.setData({
          isEdit:true
        })
      }
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