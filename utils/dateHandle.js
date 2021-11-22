/*
 * @Author: tanqq
 * @Date: 2021-11-18 09:33:18
 * @LastEditTime: 2021-11-18 21:22:07
 * @Desc: 日期处理函数
 */
var dayjs = require("dayjs");
var axios = require("axios");
var fs = require('fs')
var dateJsons = require('./date.json')

// 获取今天的日期， 用来判断今天是否节假日，节假日的话就不提醒了
// 获取明天的日期（或者今天之后的第一个工作日日期）
// 调休中间隔一天， 判断是否下一天跟当天是同一周， 不是同一周 提示 下周或者周几值班
// 法定节假日，提醒法定节假日

/**
 * 判断逻辑：
 * 今天是工作日吗？ 不是的话跳过
 * 今天是工作日， 今天是周一吗？是周一,那么今天作为上班第一天
 * 明天 调休吗， 下午6:30 提醒一下
 */
function getHours() {
  var date = new Date();
  var hourGap = 8; // 时区差8个小时
  var hour = date.getHours() + hourGap;

  return hour;
}

// exports.module.handler = async () => {
//   var eightDays = await getDays();

//   var today = eightDays[1];
//   if (!isWorkday(today)) return;

//   var yesterday = eightDays[0];

//   // 上午9：30提醒
//   if (isFirsyDayOnWork(yesterday, today)) {
//     // 进行本周值班预告
//     // 获取本周值班人员

//     var userLen = [].length;
//     // 本周工作天数
//     var workDayLen = eightDays.filter(
//       day => day.yearweek === today.yearweek && isWorkday(day)
//     ).length;
//     // 获取本周值班人员ids
//     // var Ids = getUserIdsWithNum(workDayLen);

//     console.log("本周值班人员。。。。", Ids);
//   }

//   var tomorrow = eightDays[2];

//   var nextDuty = "";
//   // var nextDuty = getNextUser();
//   var infoText = "";

//   console.log("下一个值班人员......", nextDuty);

//   // 下午六点半提醒
//   if (isWorkday(tomorrow)) {
//     //  明天是工作日，进行明天值班提醒
//     infoText = "明天到你值班了";
//   } else {
//     if (isLegalHolidays(tomorrow)) {
//       // 如果明天不是工作日，判断是否是法定节假日
//       // 法定节假日的话 直接 提醒 ‘XX’节后第一天你值班
//       infoText = `${tomorrow.holiday_cn}后第一天是你值班耶`;
//     } else {
//       // 不是节假日，那么直接查找明天之后的最近一天上班日期，判断是否本周，是的话提醒本周几值班
//       // 不是一周的话 提示 下周几 值班
//       var nextWorkDay = getNextWorkDay(eightDays);
//       if (isSameWeek(today, nextWorkDay)) {
//         infoText = `本周${nextWorkDay.week_cn}你值班哟`;
//       } else {
//         infoText = `下周${nextWorkDay.week_cn}你值班哟`;
//       }
//     }
//   }

//   console.log("最后的提示语......", infoText);
// };

var dateInfo = {
  today: {},
  tomorrow: {},
  yesterday: {},
  requestDay: ''
}

function getDateObject() {
  var todayDate = dayjs().format('YYYYMMDD')
  if (todayDate !== dateInfo.requestDay) {
    var todayIndex = dateJsons.findIndex(d => d.date + '' === todayDate)
    dateInfo.today = dateJsons[todayIndex]
    dateInfo.yesterday = dateJsons[todayIndex - 1]
    dateInfo.tomorrow = dateJsons[todayIndex + 1]
    dateInfo.requestDay = todayDate
    dateInfo.isLegalHolidays = isLegalHolidays(dateInfo.today)
    dateInfo.isWorkday = isWorkday(dateInfo.today)
    dateInfo.isFirsyDayOnWork = isFirsyDayOnWork(dateInfo.yesterday, dateInfo.today)
    dateInfo.isLastWorkDayInWeek = isLastWorkDayInWeek(dateInfo.today, dateInfo.yesterday)
    if (dateInfo.isFirsyDayOnWork) {
      dateInfo.workLengthInWeek = getWorkDayLenInWeek(dateInfo.today)
    }
  }

  return dateInfo
}

/**本周工作天数 */
function getWorkDayLenInWeek(today) {
  var workDate = dateJsons.filter(d => { return d.yearweek_cn == today.yearweek_cn && isWorkday(d) })
  return workDate.length
}

/** 是否法定节假日 */
function isLegalHolidays(data) {
  return data?.holiday_legal === 1;
}

// 是否节假日
function isHoliday() { }

/** 是否上班日 */
function isWorkday(data) {
  return data?.isWorkday === 1;
}

/** 是否调休, value=10 表示非调休 */
function isOverTime(data) {
  return data?.holiday_overtime !== 10;
}

/** 是否节假日当天 */
function isHolidayToday(data) {
  return data?.holiday_today === 1;
}

/** 是否同一周 */
function isSameWeek(yesterday, today) {
  return yesterday?.yearweek === today?.yearweek;
}

/**
 * 是否是本周上班第一天
 * 1、非同一周
 *  2、同一周 并且昨天是放假
 */
function isFirsyDayOnWork(yesterday, today) {
  return !isSameWeek(yesterday, today) || !isWorkday(yesterday);
}

/** 是否本周最后一天工作日 */
function isLastWorkDayInWeek(today, yesterday) {
  return isSameWeek(today, yesterday) && !isWorkday(yesterday)
}

function getNextWorkDay(days) {
  return days.find(day => isWorkday(day));
}

exports = module.exports = {
  isWorkday,
  getDateObject
};
