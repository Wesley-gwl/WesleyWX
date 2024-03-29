var util = require('../../utils/util.js');
const config = require("../../configurl");
import Dialog from '../../dist/dialog/dialog';
import Notify from '../../dist/notify/notify';
var header;
var that;
Page({
  data: {
    current:1,//分页页数
    total:0,//总页数
    rows:10,//一页的行数
    show:false,
    searchText:'',
    storageList:[],
  },
  //查询
  onSearch(){
    this.getStorageList();
  },
  //修改search控件值
  onChangeSearch(e){
    this.setData({ searchText: e.detail });
  },
  //展示更多条件筛选
  onShowMore(e){
    this.setData({ show: true });
  },
  //新增
  addStorage(){
    this.setData({ show: false });
    wx.navigateTo({
      url:"../storageAddOrEdit/storageAddOrEdit"
    })
  },
  //关闭更多条件筛选
  onCloseMore() {
    this.setData({ show: false });
    this.getStorageList();
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
    this.getStorageList();
  },
  onSwichCheck:function(event){
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
        that.deleteStorage(event);
        break;
      case 'cell':
        break;
      case 'right':
        that.onLookStorageInfo(event);
        break;
    }
    instance.close();
  },
  //删除
  deleteStorage:function(event){
    var id = event.currentTarget.dataset.id;
    var apply = {};
    that.data.storageList.forEach(e => {
      if(e.id == id){
        apply = e;
      }
    });
    Dialog.confirm({
      title: '提示',
      message: '是否要删除这条数据'
    }).then(() => {
      that.DeleteApply(id);
      Dialog.close();
    }).catch(() => {
      Dialog.close();
    });;
  },
  DeleteApply:function(id){
    wx.request({
      url: config.deleteStorage_url,
      method: 'post',
      dataType:"json",
      header: header,//传在请求的header里
      data:JSON.stringify({id:id}),
      success(res) {
        if(res.data.success){
          Notify({ type: 'success', message: '删除成功' ,duration: 2000});
          that.getStorageList();
        }
      }
    })
  },
  //查看编辑详情
  onLookStorageInfo:function(event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/storageAddOrEdit/storageAddOrEdit?id=' + id ,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
   
  },
  //获取信息
  getStorageList:function(){
    var data = that.data;
    var input ={};
    input.Filter = data.searchText;
    input.Page = data.current;
    input.Rows= data.rows;
    wx.request({
      url: config.getStorageList_url,
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
          that.setData({
            storageList : res.data.data.rows,
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
    if(header==null){
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
    }
    
    this.getStorageList();
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