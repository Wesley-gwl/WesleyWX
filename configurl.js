// var host="http://39.106.112.135:9000/";
var host="http://localhost:62115/";
var config={
   host,
   loginAuto_url:host+"api/WXLogin/WXAutoLogin",
   login_url:host+"api/WXLogin/WXLogin",
   //商品相关
   productType_url:host+"api/ProductTypeWX/GetTree"
}
module.exports=config;