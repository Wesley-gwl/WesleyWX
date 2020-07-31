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
    customer:{},
    applyList:[],
    type: -3,
    typeName:"全部",
    showTypeSelect:false,
    typeList: [
      {
        type:'-3',
        name: '全部',
      },
      {
        type:'0',
        name: '销售单',
      },
      {
        type:'1',
        name: '零售单',
      },
      {
        type:'2',
        name: '调拨销售单',
      },
      {
        type:'5',
        name: '销售退货单',
      }
    ],
    status:-1,
    statusName:"全部",
    showStatusSelect:false,
    statusList:[
      {
        status:'-1',
        name: '全部',
      },
      {
        status:'1',
        name: '待收款',
      },
      {
        status:'3',
        name: '对账中',
      },
      {
        status:'4',
        name: '完成',
      },
    ]
  },
  //查询
  onSearch(){
    this.getSaleList();
  },
  //多条件查询
  onSearchMore(){
    this.setData({ show: false });
    this.getSaleList();
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
      type: -3,
      typeName:"全部",
      status:-1,
      statusName:"全部",
      sTime: stime,
      eTime: dtime,
    });
  },
  //关闭更多条件筛选
  onCloseMore() {
    this.setData({ show: false });
    this.getSaleList();
  },
  //选择类型
  onSelectType(event){
    this.setData({ showTypeSelect: true });
    if(event.detail.type != null){
      this.setData({ typeName: event.detail.name ,type:event.detail.type});
    }
  },
  //关闭类型选择
  onCloseType(){
    this.setData({ showTypeSelect: false });
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
    this.getSaleList();
  },
  onApply:function(event){
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
        that.onDeleteApply(event);
        break;
      case 'cell':
        break;
      case 'right':
        that.onLookApplyInfo(event);
        break;
    }
    instance.close();
  },
  //删除
  onDeleteApply:function(event){
    console.log(event);
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
      url: config.deleteApply_url,
      method: 'get',
      header: header,//传在请求的header里
      data:{id:id},
      success(res) {
        if(res.data.success){
          Notify({ type: 'success', message: '删除成功' ,duration: 2000});
          that.getSaleList();
        }
      }
    })
  },
  //查看编辑详情
  onLookApplyInfo:function(event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/saleAddOrEdit/saleAddOrEdit?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    var stime = util.formatDateAdd(new Date(),-3);
    var dtime = util.formatDateAdd(new Date(),1);
    this.setData({
      sTime: stime,
      eTime: dtime,
    });
    if(header==null){
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  //获取信息
  getSaleList:function(){
    var data = that.data;
    var input ={};
    input.Filter = data.searchText;
    input.Page = data.current;
    input.Rows= data.rows;
    input.Type=data.type;
    input.FromTime = data.sTime;
    input.ToTime =data.eTime;
    input.Status = data.status;
    if(data.customer.id!=null){
      input.customerId = data.customer.id;
    }
    wx.request({
      url: config.getApplyList_url,
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
            item.orderDate = item.orderDate.substring(0, 10); //要截取时间的字符串
            if(item.deliveryDate!=null){
              item.deliveryDate = item.deliveryDate.substring(0, 10); //要截取时间的字符串
            }
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
    if(header!=null){
      this.getSaleList();
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