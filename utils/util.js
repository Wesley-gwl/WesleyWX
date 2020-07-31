//年月日 时分秒
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//年月日
const formatDate = date =>{
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-') 
}

//年月日 每个月按30天来算，2月份特殊处理
const formatDateAdd = (date,addMonth=0, addDay=0 )=>{
  var year = date.getFullYear()
  var month = 0
  var day = 0
  if(addDay>0){
    var dayTotal = parseInt(date.getDate() + addDay);
    if(dayTotal%30!=0){
      day =parseInt(dayTotal%30)
      addMonth+=parseInt(dayTotal/30)
    }
    else{
      day=30;
    }
  }else if(addDay==0)
  {
    day=parseInt(date.getDate());
  } 
 else{
    var dayTotal = parseInt(date.getDate() + addDay);
    if(dayTotal%30!=0){
      day =30+parseInt(dayTotal%30)
      addMonth+=(parseInt(dayTotal/30)-1)
    }
    else{
      day=30;
    }
  }
  if( addMonth>0){
    var monthTotal = parseInt(date.getMonth() + 1+ addMonth)
    if(monthTotal%12!=0){
      year += parseInt(monthTotal/12)
      month =  parseInt(monthTotal%12)
    }
    else{
      month=12
    }
  }else if(addMonth == 0){
    month =parseInt(date.getMonth()) + 1
  }
  else{
    var monthTotal = parseInt(date.getMonth() + 1+ addMonth);
    if(monthTotal<0){
      if(monthTotal%12!=0){
        year += parseInt(monthTotal/12);
        month =date.getMonth() + 1+ parseInt(monthTotal%12)
      }
      else{
        month = 12
      }
    }else{
      month = monthTotal
    }
  }
  if(month ==2&&(day ==29 ||day==30||day==31)){
    month=3;
    day = 1;
  }
  if((month==4||month==6||month==9||month==11)&&day==31){
    day =30;
  }
  return [year, month, day].map(formatNumber).join('-') 
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//计算两个时间差天数
const colDateDifference=(date1,date2)=>{
  var temp1 = new Date(date1.replace(/-/g,"/"));
  var temp2 = new Date(date2.replace(/-/g,"/"));
  return parseInt((temp1.getTime()-temp2.getTime())/(1000*60*60*24));
}
module.exports = {
  formatTime: formatTime,
  formatDate:formatDate,
  formatDateAdd:formatDateAdd,
  colDateDifference:colDateDifference,
}
