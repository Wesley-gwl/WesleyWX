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
    apply:{
      offsetAmount:0,
      finishAmount:0,
      residueAmount:0,
      totalAmount:0,
      type :0,
      typeName:"收款单",
      status:0,
      statusName:"待核销",
    },
    showTotalAmount:0,
    isLook:false,
    isEdit:false,
    customer:{},
    productList:[],
    loadModal:false,
    submitText:"提交",
    customerUrl:"../customer/customer",
    accountUrl:"../accountSelect/accountSelect",
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },
  //修改金额
  onTotalAmountChange(event){
    if(that.data.isLook){
      return;
    }
    var apply =that.data.apply;
    apply.totalAmount= event.detail;
    apply.residueAmount= event.detail;
    this.setData({
      apply: apply,
      showTotalAmount:event.detail*100
    });
  },
  //修改标题
  onTitleChange(event){
    if(that.data.isLook){
      return;
    }
    var apply =that.data.apply;
    apply.title= event.detail;
    this.setData({
      apply: apply,
    });
  },
  //修改备注
  onMemoChange(event){
    if(that.data.isLook){
      return;
    }
    var apply =that.data.apply;
    apply.memo= event.detail;
    this.setData({
      apply: apply,
    });
  },
  //修改单据日期
  DateChange(event) {
    if(that.data.isLook){
      return;
    }
    var apply =that.data.apply;
    apply.date= event.date.value;
    this.setData({
      apply: apply
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
    if(data.apply.title==null||data.apply.title==""){
      Notify({ type: 'warning', message: '请填写标题',duration: 2000 });
      return ;
    }
    if(data.customer.id == null){
      Notify({ type: 'warning', message: '请先选择供应商' ,duration: 2000});
      return ;
    }
    if(data.account.id== null){
      Notify({ type: 'warning', message: '请先选中账户',duration: 2000 });
      return ;
    }
    if(data.apply.totalAmount<=0){
      Notify({ type: 'warning', message: '收款金额不能小于0',duration: 2000 });
      return ;
    }
    that.setData({
      loadModal: true
    })
    var input =data.apply;
    input.accountId = data.account.id;
    input.accountName = data.account.name;
    input.customerId=data.customer.id;
    input.customerName = data.customer.name;
    input.companyName = data.customer.companyName;
    input.phoneNumber = data.customer.phoneNumber;
    wx.request({
      url: config.saveAccountPayment_url,
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
    that.setData({
      loadModal: true
    })
    if(options.id!=null){
      that.getApplyInfo(options.id);
    }
    that.setData({
      loadModal: false
    })
  },
  getApplyInfo:function(id){
    wx.request({
      url: config.getAccountPaymentForEdit_url,
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
  loadData:function(apply){
    if(apply!=null){
      if(apply.status!=0){
        that.setData({
          submitText:"返回",
          isLook:true,
          customerUrl:"",
          accountUrl:""
        })
      }
      else{
        that.setData({
          isEdit:true
        })
      }
      var customer = {};
      customer.id = apply.customerId;
      customer.name = apply.customerName;
      customer.companyName = apply.companyName;
      customer.phoneNumber = apply.phoneNumber;
      apply.date = apply.date.substring(0,10);
      var account ={
        id: apply.accountId,
        name : apply.accountName
      };
      
      that.setData({
        customer :customer,
        account : account,
        apply:apply,
        showTotalAmount:apply.totalAmount*100
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if(!(that.data.isEdit||that.data.isLook)){
      var time = util.formatDate(new Date());
      var apply =that.data.apply;
      apply.date= time;
      this.setData({
        apply: apply
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setHeader();
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