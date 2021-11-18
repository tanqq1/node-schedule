/*
 * @Author: tanqq
 * @Date: 2021-11-18 09:31:18
 * @LastEditTime: 2021-11-18 21:06:23
 * @Desc: 值班处理函数
 */
var { readContentInFile } = require("./fileHandle.js");

// 机器人key
// var robotKey = config.robotKey;

// 定时任务执行成功的话则记录下新的值班人
// config.currentDuty = config.persons[nextDutyIndex]
// fs.writeFileSync(filePath, JSON.stringify(config), { flag: 'w+', 'encoding': 'utf-8' })

/** 值班周期为天函数处理 */
function dutyOnWorkDay() {
  // 日提醒的逻辑，可复用现在的值班逻辑
}

/** 值班周期为周 函数处理 */
function dutyOnWorkWeek() {
  // 则本周第一天提醒一次 & 本周最后一天做下周的值班预告;
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

exports = module.exports = {
  onDutyHandle,
};
