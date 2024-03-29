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
      type :6,
      typeName:"移库单",
      status:0,
      statusName:"申请",
    },
    isLook:false,
    isEdit:false,
    statusList:[
      {
        type:0,
        name:'新建'
      },
      {
        type:1,
        name:'完成'
      },
      {
        type:1,
        name:'完成'
      },
    ],
    storageList:[],
    fromStorage:{},
    toStorage:{},
    productList:[],
    loadModal:false,
    submitText:"提交",
    showFromStorageSelect:false,
    showToStorageSelect:false,
    showStatusSelect:false,
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    }
  },
  //选择仓库
  onSelectFromStorage:function(event){
    that.setData({ showFromStorageSelect: true });
    if(event.detail.type != null){
      var storage = {
        id : event.detail.type,
        name : event.detail.name 
      }
      that.setData({ 
        fromStorage: storage,
        productList:[]
      })
    }
  },
  //选择仓库
  onSelectToStorage:function(event){
    that.setData({ showToStorageSelect: true });
    if(event.detail.type != null){
      var storage = {
        id : event.detail.type,
        name : event.detail.name 
      }
      that.setData({ 
        toStorage: storage,
        productList:[]
      })
    }
  },
  //选择状态
  onSelectStatus(event){
    that.setData({ showStatusSelect: true });
    if(event.detail.type != null){
      var apply =that.data.apply;
      apply.status = event.detail.type;
      apply.statusName = event.detail.name;
      that.setData({ 
        apply: apply,
      })
    }
  },
   //关闭类型选择
   onClose() {
    this.setData({ 
      showFromStorageSelect: false ,
      showToStorageSelect: false ,
      showTypeSelect: false ,
      showStatusSelect: false ,
    });
  },
  //修改单据日期
  DateChange(event) {
    if(that.data.isLook){
      return;
    }
    var apply =that.data.apply;
    apply.date= event.detail.value;
    this.setData({
      apply: apply
    });
  },
  //输入赋值
  onFieldChange(e){
    this.setData({
      [e.target.dataset.key]:e.detail
    });
  },
  //添加商品
  onAddProduct(){
    var toStorage = that.data.toStorage;
    var fromStorage = that.data.fromStorage;
    if(fromStorage.id==null){
      Notify({ type: 'warning', message: '请先选择出库仓库',duration: 2000 });
      return
    }
    if(toStorage.id==null){
      Notify({ type: 'warning', message: '请先选择入库仓库',duration: 2000 });
      return
    }
    wx.navigateTo({
      url: "../adjustStockApplyDetailAddOrEdit/adjustStockApplyDetailAddOrEdit?fromStorage="+JSON.stringify(fromStorage)+"&toStorage="+JSON.stringify(toStorage),
    })
  },
  //删除
  onSwichCheck:function(event){
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
        break;
      case 'cell':
        break;
      case 'right':
        that.deleteAccountCheck(event);
        break;
    }
    instance.close();
  },
  //删除
  deleteAccountCheck:function(event){
    var id = event.currentTarget.dataset.id;
    var productList = [];
    that.data.productList.forEach(e => {
      if(e.id!= id){
        productList.push(e);
      }
    });
    this.setData({
      productList: productList
    })
  },
   //修改数量
   handleChangeNumber (event) {
    var id = event.target.dataset.id;
    var productList = [];
    for (let index = 0; index < that.data.productList.length; index++) {
      const e = that.data.productList[index];
      if(e.id == id){
        e.number = event.detail;
      }
      productList.push(e);
    }
    this.setData({
      productList: productList
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
    if(data.fromStorage.id == null){
      Notify({ type: 'warning', message: '请先选择出库仓库' ,duration: 2000});
      return ;
    }
    if(data.toStorage.id == null){
      Notify({ type: 'warning', message: '请先选择入库仓库' ,duration: 2000});
      return ;
    }
    if(data.productList.length== 0){
      Notify({ type: 'warning', message: '请先添加商品',duration: 2000 });
      return ;
    }
    that.setData({
      loadModal: true
    })
    var input ={};
    var stockApply=data.apply;
    stockApply.action = 2;
    stockApply.toStorageId = data.toStorage.id;
    stockApply.toStorageName = data.toStorage.name;
    stockApply.fromStorageId = data.fromStorage.id;
    stockApply.fromStorageName = data.fromStorage.name;
    var stockApplyItems =[];
    for (let index = 0; index < data.productList.length; index++) {
      const e = data.productList[index];
      if(e.productId == null){
        e.productId = e.id;
      }
      e.productName = e.name;
      e.ProductCode = e.code;
      e.ProductSpec= e.spec;
      stockApplyItems.push(e);
    }
    input.stockApply=stockApply;
    input.stockApplyItems=stockApplyItems;
    wx.request({
      url: config.saveStockApply_url,
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
      url: config.getStockApplyForEdit_url,
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
  loadData:function(output){
    var apply = output.stockApply;
    if(apply!=null){
      if(apply.status!=0){
        that.setData({
          submitText:"返回",
          isLook:true,
          supplierUrl:"",
          accountUrl:""
        })
      }
      else{
        that.setData({
          isEdit:true
        })
      }
      var toStorage = {};
      toStorage.id = apply.toStorageId;
      toStorage.name = apply.toStorageName;
      var fromStorage={};
      fromStorage.id = apply.fromStorageId;
      fromStorage.name = apply.fromStorageName;
      apply.date = apply.date.substring(0,10);
      var productList = [];
      output.stockApplyItems.forEach(e => {
        e.name= e.productName;
        e.code = e.productCode;
        e.spec= e.productSpec;
        productList.push(e);
      });
      that.setData({
        toStorage :toStorage,
        fromStorage :fromStorage,
        apply:apply,
        productList:productList,
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
    that.getStorageList();
  },
  //获取仓库下拉框
  getStorageList:function(){
    wx.request({
      url: config.getStorageCombobox_url,
      method: 'get',
      header: header,//传在请求的header里
      success(res) {
        if(res.data.success){
          var list = res.data.data;
          list.push({type:"0",name:'1313'})
          that.setData({
            storageList :list ,
          })
        }
      }
    })
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