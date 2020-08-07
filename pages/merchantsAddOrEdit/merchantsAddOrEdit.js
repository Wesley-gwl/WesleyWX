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
    customer:{
      type :2,
      typeName:"来往单位",
      status:0,
    },
    isEdit:false,
    typeList:[],
    paymentTypeList:[
      {type:0,name:'天结'},
      {type:1,name:'当月结'},
      {type:2,name:'月结'},
      {type:3,name:'季结'},
      {type:4,name:'其他'},
      {type:4,name:'其他'},
    ],
    gradeList:[
      {type:3,name:'VIP'},
      {type:2,name:'好'},
      {type:1,name:'较好'},
      {type:0,name:'一般'},
      {type:-1,name:'较差'},
      {type:-2,name:'差'},
      {type:-3,name:'非常差'},
      {type:-3,name:'非常差'},
    ],
    loadModal:false,
    showTypeSelect:false,
    showPaymentTypeSelect:false,
    showGradeSelect:false,
  },
  //选择类型
  onSelectType:function(event){
    that.setData({ showTypeSelect: true });
    if(event.detail.type != null){
      that.setData({ 
       ['customer.customerTypeId']:event.detail.type,
       ['customer.customerTypeName']:event.detail.name,
      })
    }
  },
  //选择结算方式
  onSelectPaymentType:function(event){
    that.setData({ showPaymentTypeSelect: true });
    if(event.detail.type != null){
      that.setData({ 
        ['customer.paymentType']:event.detail.type,
        ['customer.paymentTypeName']:event.detail.name,
       })
    }
  },
  //选择等级
  onSelectGrade(event){
    that.setData({ showGradeSelect: true });
    if(event.detail.type != null){
      that.setData({ 
        ['customer.grade']:event.detail.type,
        ['customer.gradeName']:event.detail.name,
      })
    }
  },
  //关闭类型选择
  onClose() {
    this.setData({ 
      showPaymentTypeSelect: false ,
      showGradeSelect: false ,
      showTypeSelect: false ,
    });
  },
  //输入赋值
  onFieldChange(e){
    this.setData({
      [e.target.dataset.key]:e.detail
    });
  },
  //获取分类下拉框
  GetCustomerType:function(){
    wx.request({
      url: config.getCustomerTypeList_url,
      method: 'get',
      header: header,//传在请求的header里
      data:{type:2},
      success(res) {
        if(res.data.success&& res.data.data.length>0){
          var list = [];
          res.data.data.forEach(e => {
            list.push({
              type:e.id,
              name:e.name
            });
          });
          list.push({type:0,name:'1231'});
          that.setData({
            customerTypeList:list
          });
        }
      //请求成功的处理
      }
    })
  },
  //提交
  onSubmit:function(){
    var customer =that.data.customer;
    if(customer.companyName == null){
      Notify({ type: 'warning', message: '请填写公司' ,duration: 2000});
      return ;
    }
    if(customer.name == null){
      Notify({ type: 'warning', message: '请填写联系人' ,duration: 2000});
      return ;
    }
    if(customer.phoneNumber== null){
      Notify({ type: 'warning', message: '请填写联系电话',duration: 2000 });
      return ;
    }
    if(customer.customerTypeId== null){
      Notify({ type: 'warning', message: '请选择客户分类',duration: 2000 });
      return ;
    }
    if(customer.paymentType== null){
      Notify({ type: 'warning', message: '请选择结算方式',duration: 2000 });
      return ;
    }
    if(customer.grade== null){
      Notify({ type: 'warning', message: '请选择客户等级',duration: 2000 });
      return ;
    }
    that.setData({
      loadModal: true
    })
    var input ={};
    input.customer=customer;
    wx.request({
      url: config.saveCustomer_url,
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
    if(options.customer!=null){
      var customer = JSON.parse(options.customer);
      that.setData({
        customer:customer
      })
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
    this.setHeader();
    that.GetCustomerType();
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