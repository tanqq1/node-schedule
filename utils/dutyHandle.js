/*
 * @Author: tanqq
 * @Date: 2021-11-18 09:31:18
 * @LastEditTime: 2021-11-18 21:06:23
 * @Desc: 值班处理函数
 */
var { readContentInFile } = require("./fileHandle.js");
var { getDateObject } = require("./dateHandle.js")


// 本周值班预览
async function dutyPreview(info) {
  const { content, mentioned_list, robotUrl } = info;
  console.log("mentioned_list", mentioned_list);
  let result = await axios.post(robotUrl, {
    msgtype: "text",
    text: {
      content: `本周值班预告: ${content} \n\n 明天到你值班啦！不要忘记哟~`,
      mentioned_list: mentioned_list,
    },
  });

  return result.data;
}

async function frontEndDuty(info) {
  const { content, mentioned_list, robotUrl } = info;

  let result = await axios.post(robotUrl, {
    msgtype: "text",
    text: {
      content: content,
      mentioned_list: mentioned_list,
    },
  });

  return result.data;
}

/** 值班周期为天函数处理 */
function dutyOnWorkWeek(dutyJson) {
  // 日提醒的逻辑，可复用现在的值班逻辑
  var dateInfo = getDateObject()
  if (!dateInfo.isWorkday) return
  if (dateInfo.isFirsyDayOnWork) {
    // 本周值班人员
    return frontEndDuty({ robotUrl: dutyJson.robotKey, content: '无情的值班机器人来提醒啦:这周到你值班了，不要忘记哟！', mentioned_list: [dutyJson.currentDuty] })
  }
  if (dateInfo.isLastWorkDayInWeek) {
    // 下周值班人员
    frontEndDuty({ robotUrl: dutyJson.robotKey, content: '无情的值班机器人来提醒啦:下周到你值班了，不要忘记哟！', mentioned_list: [dutyJson.currentDuty] })
    var nextDuty = getNextDutyPerson(dutyJson.personList, dutyJson.currentDuty)
    dutyJson.currentDuty = nextDuty
    writeContentInFile(dutyJson)
    return
  }

  return
}

/** 值班周期为周 函数处理 */
function dutyOnWorkDay(dutyJson) {
  // 则本周第一天提醒一次 & 本周最后一天做下周的值班预告;
  var dateInfo = getDateObject()
  if (!dateInfo.isWorkday) return
  // 预告
  var nextDuty = getNextDutyPerson(dutyJson.personList, dutyJson.currentDuty)

  if (dateInfo.isFirsyDayOnWork) {
    var nextWorkDuty = getNextWeekDutys(dutyJson.personList, dutyJson.currentDuty, dateInfo.workLengthInWeek)
    dutyPreview({ mentioned_list: dutyJson.currentDuty, robotUrl: dutyJson.robotKey, content: nextWorkDuty.join(',') })
  }
  if (dateInfo.isLastWorkDayInWeek) {
    frontEndDuty({ content: '无情的值班机器人来提醒了,下周第一天工作日到你值班了，不要忘记呦~', mentioned_list: [nextDuty], robotUrl: dutyJson.robotKey, })
  }

  dutyJson.currentDuty = nextDuty
  writeContentInFile(dutyJson)
}

/** 解析文件参数，判断走周提醒还是日提醒 */
function onDutyHandle(filePath) {
  var json = readContentInFile(filePath);
  if (json.period == "day") {
    dutyOnWorkDay(json);
  } else {
    dutyOnWorkWeek(json);
  }
}

/** 获取下一个值班人员 */
function getNextDutyPerson(personList, currentDuty) {
  if (!currentDuty) {
    return personList[0];
  }
  var nextDutyIndex = personList.indexOf(currentDuty) + 1;
  if (nextDutyIndex > personList.length - 1) {
    nextDutyIndex = 0;
  }
  return personList[nextDutyIndex];
}

/** 获取下周值班列表 */
function getNextWeekDutys(personList, currentDuty, count) {
  var dutyIndex = personList.findIndex(currentDuty) || 0
  var personLen = personList.length
  var endDutyIndex = dutyIndex + count + 1
  if (endDutyIndex < personLen) {
    return personList.slice(dutyIndex, endDutyIndex)
  }
  var list = personList.slice(dutyIndex, endDutyIndex)
  list.push(personList.slice(0, endDutyIndex - personLen))
  return list
}

exports = module.exports = {
  onDutyHandle,
};
