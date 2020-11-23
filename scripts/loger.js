/*
 * @Author: 范汇鑫
 * @Date: 2020-11-22 14:48:20
 * @LastEditTime: 2020-11-22 15:38:16
 * @LastEditors: Please set LastEditors
 * @Description: 日志小工具
 * @FilePath: \ost-utils\scripts\loger.js
 */
const chalk = require("chalk");
module.exports = loger = {
  msg: function (msg) {
    console.log(msg);
  },
  error: function (error) {
    console.log(chalk.red(error));
  },
  success: function (success) {
    console.log(chalk.green(success));
  },
  warning: function (warning) {
    console.log(chalk.yellow(warning));
  },
};
