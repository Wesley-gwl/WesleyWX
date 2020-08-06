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
    rows:5,//一页的行数
    eTime:'',
    sTime:'',
    show:false,
    searchText:'',
    applyList:[],
    status:-1,
    statusName:"全部",
    showStorageSelect:false,
    storageList:[],
    storage:{},
    showStatusSelect:false,
    statusList:[
      {
        type:'-1',
        name: '全部',
      },
      {
        type:'0',
        name: '申请',
      },
      {
        type:'1',
        name: '完成',
      },
    ],
    showTypeSelect:false,
    typeList:[ {
      type:1,
      name:'销售出库单'
    },
    {
      type:2,
      name:'采购退货入库单'
    },
    {
      type:5,
      name:'其他出库单'
    }]
  },
  //查询
  onSearch(){
    this.setData({ show: false });
    this.getStockApplyList();
  },
  //选择状态
  onSelectStatus:function(event){
    this.setData({ showStatusSelect: true });
    if(event.detail.type != null){
      this.setData({ 
        status: event.detail.type,
        statusName:event.detail.name 
      })
    }
  },
  //选择类型
  onSelectType(event){
    that.setData({ showTypeSelect: true });
    if(event.detail.type != null){
      that.setData({ 
        type : event.detail.type,
        typeName :event.detail.name
      })
    }
  },
  //选择仓库
  onSelectStorage:function(event){
    that.setData({ showStorageSelect: true });
    if(event.detail.type != null){
      var storage = {
        id : event.detail.type,
        name : event.detail.name 
      }
      that.setData({ 
        storage: storage,
      })
    }
  },
  //关闭类型选择
  onClose() {
    this.setData({ 
      showStatusSelect: false ,
      showTypeSelect: false ,
      showStorageSelect: false ,
    });
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
    var stime = util.formatDateAdd(new Date(),-2);
    var dtime = util.formatDateAdd(new Date(),1);
    this.setData({
      searchText: '',
      storage:{},
      status:-1,
      statusName:"全部",
      type:-1,
      typeName:"全部",
      sTime: stime,
      eTime: dtime,
    });
  },
  //关闭更多条件筛选
  onCloseMore() {
    this.setData({ show: false });
    this.getStockApplyList();
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
    this.getStockApplyList();
  },
  onSwichCheck:function(event){
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
        that.deleteAccountCheck(event);
        break;
      case 'cell':
        break;
      case 'right':
        that.onLookAccountCheckInfo(event);
        break;
    }
    instance.close();
  },
  //删除
  deleteAccountCheck:function(event){
    var id = event.currentTarget.dataset.id;
    var apply = {};
    that.data.applyList.forEach(e => {
      if(e.id == id){
        apply = e;
      }
    });
    if(apply.status !=0){
      Notify({ type: 'warning', message: '此状态无法删除' ,duration: 2000});
      return;
    }
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
      url: config.deleteStockApply_url,
      method: 'post',
      dataType:"json",
      header: header,//传在请求的header里
      data:JSON.stringify({id:id}),
      success(res) {
        if(res.data.success){
          Notify({ type: 'success', message: '删除成功' ,duration: 2000});
          that.getStockApplyList();
        }
      }
    })
  },
  //查看编辑详情
  onLookAccountCheckInfo:function(event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/outStockApplyAddOrEdit/outStockApplyAddOrEdit?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var stime = util.formatDateAdd(new Date(),-2);
    var dtime = util.formatDateAdd(new Date(),1);
    this.setData({
      sTime: stime,
      eTime: dtime,
    });
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
   
  },
  //获取信息
  getStockApplyList:function(){
    var data = that.data;
    var input ={};
    input.Filter = data.searchText;
    input.Page = data.current;
    input.Rows= data.rows;
    input.FromTime = data.sTime;
    input.ToTime =data.eTime;
    input.Status = data.status;
    input.Type = data.type;
    input.ApplyAction =  1;
    if(data.storage.id!=null){
      input.storageId = data.storage.id;
    }
    wx.request({
      url: config.getStockApplyList_url,
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
    this.getStockApplyList();
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
          that.setData({
            storageList :list ,
          })
        }
      }
    })
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