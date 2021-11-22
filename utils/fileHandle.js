/*
 * @Author: tanqq
 * @Date: 2021-11-18 09:34:55
 * @LastEditTime: 2021-11-22 18:52:55
 * @Desc:
 * 执行文件的读写操作
 * 路径的解析
 */

var path = require("path");
var fs = require("fs");

var dutyFileDir = path.resolve("scheduleTask");
var fileSuffix = ".schedule.js";

console.log("dutyFileDir", dutyFileDir);

// 获取用户列表
function getUserList(userStr) {
  return userStr.split(",").filter(item => !!item);
}

/**值班文件路径解析 */
function parseDutyFilePath(filename) {
  return path.resolve(dutyFileDir, filename + fileSuffix);
}

/** 将内容写入文件 */
function writeContentInFile(requestBody) {
  const taskFileName = parseDutyFilePath(requestBody.taskName);
  requestBody.personList = getUserList(requestBody.personList);
  if (!requestBody.currentDuty) {
    requestBody.currentDuty = requestBody.personList[0];
  }

  // 每次新增都覆盖写入文件
  fs.writeFileSync(taskFileName, `${JSON.stringify(requestBody)}`, {
    flag: "w+",
    encoding: "utf-8",
  });
}

function getScheduleFilsList() {
  var fileList = fs.readdirSync(dutyFileDir);
  return fileList.map(function (file) {
    if (file.endsWith(fileSuffix)) {
      return path.resolve(dutyFileDir, file);
    }
    return null;
  });
}

/** 从文件中读取文件内容
 * @returns 文件json格式内容
 */
function readContentInFile(file) {
  var fileStr = fs.readFileSync(file, "utf-8");
  var fileJson;
  try {
    var fileJson = JSON.parse(fileStr);
  } catch (error) {
    console.log("文件解析失败，存储文件并非json格式", error);
  }
  return fileJson;
}

exports = module.exports = {
  writeContentInFile,
  getScheduleFilsList,
  readContentInFile,
};
