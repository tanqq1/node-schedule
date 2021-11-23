/*
 * @Author: tanqq
 * @Date: 2021-11-18 09:31:18
 * @LastEditTime: 2021-11-22 18:54:04
 * @Desc: 值班处理函数
 */
var { readContentInFile, writeContentInFile } = require("./fileHandle.js");
var { getDateObject } = require("./dateHandle.js");
var axios = require("axios");

// 本周值班预览
function dutyPreview(info) {
  const { content, mentioned_list, robotUrl } = info;
  // console.log("info.........", info)
  try {
    axios
      .post(robotUrl, {
        msgtype: "text",
        text: {
          content: `本周值班预告: ${content} \n\n 明天到你值班啦！不要忘记哟~`,
          mentioned_list: mentioned_list,
        },
      })
      .then(res => {
        console.log("res......", res.data);
      });
  } catch (error) {
    console.log("post error......", error);
  }
}

function frontEndDuty(info) {
  const { content, mentioned_list, robotUrl } = info;

  axios.post(robotUrl, {
    msgtype: "text",
    text: {
      content: content,
      mentioned_list: mentioned_list,
    },
  }).then(res => {
    console.log("值班提醒发送成功.....", res.data);
  });

}

/** 值班周期为天函数处理 */
function dutyOnWorkWeek(dutyJson) {
  // 日提醒的逻辑，可复用现在的值班逻辑
  var dateInfo = getDateObject();
  if (!dateInfo.isWorkday) return;
  if (dateInfo.isFirstDayOnWork) {
    // 本周值班人员
    return frontEndDuty({
      robotUrl: dutyJson.robotKey,
      content: "无情的值班机器人来提醒啦:这周到你值班了，不要忘记哟！",
      mentioned_list: [dutyJson.currentDuty],
    });
  }
  var nextDuty = getNextDutyPerson(dutyJson.personList, dutyJson.currentDuty);
  if (dateInfo.isLastWorkDayInWeek) {
    // 下周值班人员
    frontEndDuty({
      robotUrl: dutyJson.robotKey,
      content: "无情的值班机器人来提醒啦:下周到你值班了，不要忘记哟！",
      mentioned_list: [nextDuty.id],
    });
    dutyJson.currentDuty = nextDuty.id;
    dutyJson.personList = JSON.stringify(dutyJson.personList)
    writeContentInFile(dutyJson);
    return;
  }

  return;
}

/** 值班周期为周 函数处理 */
function dutyOnWorkDay(dutyJson) {
  try {
    // 则本周第一天提醒一次 & 本周最后一天做下周的值班预告;
    var dateInfo = getDateObject();
    if (!dateInfo.isWorkday) return;
    // 预告
    var nextDuty = getNextDutyPerson(dutyJson.personList, dutyJson.currentDuty);

    if (dateInfo.isFirstDayOnWork) {
      var content = ''
      var nextWorkDuty = getNextWeekDuty(
        dutyJson.personList,
        dutyJson.currentDuty,
        dateInfo.workLengthInWeek
      );

      console.log("nextWorkDuty", nextWorkDuty)
      for (var i = 0; i < nextWorkDuty.length; i++) {
        content += nextWorkDuty[i].name + ','
      }
      dutyPreview({
        mentioned_list: dutyJson.currentDuty,
        robotUrl: dutyJson.robotKey,
        content: content,
      });
    } else if (dateInfo.isLastWorkDayInWeek) {
      frontEndDuty({
        content:
          "无情的值班机器人来提醒了,下周第一天工作日到你值班了，不要忘记呦~",
        mentioned_list: [nextDuty.id],
        robotUrl: dutyJson.robotKey,
      });
    } else {
      frontEndDuty({
        content:
          "无情的值班机器人来提醒啦,明天带你值班了，不要忘记呦~",
        mentioned_list: [nextDuty.id],
        robotUrl: dutyJson.robotKey,
      });
    }
    dutyJson.personList = JSON.stringify(dutyJson.personList)
    dutyJson.currentDuty = nextDuty.id;
    writeContentInFile(dutyJson);
  } catch (error) {
    console.log(error);

  }
}

/** 解析文件参数，判断走周提醒还是日提醒 */
function onDutyHandle(filePath) {
  var json = readContentInFile(filePath);
  if (!json.personList.length) return
  if (json.period == "day") {
    dutyOnWorkDay(json);
  } else {
    dutyOnWorkWeek(json);
  }
}

/** 获取下一个值班人员 */
function getNextDutyPerson(personList, currentDuty) {
  if (!currentDuty) {
    return personList[0].id;
  }
  var nextDutyIndex = personList.findIndex(function (p) { return p.id == currentDuty }) + 1;
  if (nextDutyIndex > personList.length - 1) {
    nextDutyIndex = 0;
  }
  return personList[nextDutyIndex];
}

/** 获取下周值班列表 */
function getNextWeekDuty(personList, currentDuty, count) {
  try {
    var dutyIndex =
      personList.findIndex(function (p) {
        return p.id == currentDuty;
      }) || 0;
    var personLen = personList.length;
    var endDutyIndex = dutyIndex + count + 1;

    var list = personList.slice(dutyIndex + 1, endDutyIndex);

    if (endDutyIndex < personLen) {
      return list;
    }
    return list.concat(personList.slice(0, endDutyIndex - personLen));

  } catch (error) {
    console.log(error);
  }

}

exports = module.exports = {
  onDutyHandle,
};
