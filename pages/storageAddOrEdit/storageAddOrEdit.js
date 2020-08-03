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
    storage:{},//付款单
    storageLocationList:[],
    loadModal:false,
    submitText:"确定",
    storageLocationUrl:"../storageLocationAddOrEdit/storageLocationAddOrEdit",
  },
  //添加库位
  onAddStorage(){
    if(that.data.accountCanstorageUrl!=""){
      var url =that.data.storageLocationUrl
      wx.navigateTo({
        url:url
      })
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
        that.deleteApply(event);
        break;
      case 'cell':
        break;
      case 'right':
        that.editStorageLocation(event);
        break;
    }
    instance.close();
  },
  //删除明细
  deleteApply(event){
    var id = event.currentTarget.dataset.id;
    var newstorageLocationList = [];
    that.data.storageLocationList.forEach(e => {
      if(e.id != id){
        newstorageLocationList.push(e);
      }
    });
    that.setData({storageLocationList:newstorageLocationList});
  },
  //编辑
  editStorageLocation(event){
    var id = event.currentTarget.dataset.id;
    var data = {};
    for (let index = 0; index < that.data.storageLocationList.length; index++) {
      const e = that.data.storageLocationList[index];
      if(e.id== id){
        data= e;
        break;
      }
    }
    wx.navigateTo({
      url: '/pages/storageLocationAddOrEdit/storageLocationAddOrEdit?data=' + JSON.stringify(data),
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
      url: config.getStorageForEdit_url,
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
      var storage = output.storage;
      var storageLocationList = output.storageLocationEditDtos;
      that.setData({
        storage:storage,
        storageLocationList :storageLocationList,
      })
    }
  },
  //提交
  onSubmit:function(){
    var data =that.data;
    if(data.storage.name == null||data.storage.name == ""){
      Notify({ type: 'warning', message: '请填写名称' ,duration: 2000});
      return ;
    }
    that.setData({
      loadModal: true
    })
    var input = {};
    input.storage=data.storage;
    input.storageLocationEditDtos=data.storageLocationList;
    wx.request({
      url: config.saveStorage_url,
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
            duration:1500,//显示时长
            mask:true,//是否显示透明蒙层，防止触摸穿透，默认：false  
            icon:'success', //图标，支持"success"、"loading"  
            success:function(){ 
              wx.navigateBack({//返回上一页
                delta: 1
              })
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