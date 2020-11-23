/*
 * @Author: 范汇鑫
 * @Date: 2020-11-22 14:21:35
 * @LastEditTime: 2020-11-22 17:09:13
 * @LastEditors: Please set LastEditors
 * @Description: 自主扩充的cpoy 方法
 * @FilePath: \ost-utils\scripts\copy.js
 */
const path = require("path");
// 日志工具
const loger = require("./loger");
// 文件工具
const fs = require("fs");
// 文件路径
const filePath = process.argv.splice(2);

loger.success(
  `---------------copy:${
    filePath[0].split("\\")[filePath[0].split("\\").length - 1]
  }---------------`
);
//拷贝文件夹
copyFolder(
  `${path.resolve()}${filePath[0]}`,
  `${path.resolve()}${filePath[1]}`
);
//复制文件夹
function copyFolder(from, to) {
  loger.msg(`检查目标:${from}...`);
  if (!fs.existsSync(from)) {
    loger.error(`错误路径:${from}`);
    loger.error("错误原因:目标资源不存在");
    return;
  }
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to);
  }
  fs.readdir(from, (err, paths) => {
    // 有错误文件直接退出
    if (err) {
      throw err;
    }
    // 进行循环
    paths.forEach((path) => {
      let fromPath = `${from}\\${path}`;
      let toPath = `${to}\\${path}`;
      // 创建读写流
      let readable;
      let writable;
      // 检测文件状态
      fs.stat(fromPath, (err, stats) => {
        // 有错误文件直接退出
        if (err) {
          throw err;
        }
        if (stats.isFile()) {
          readable = fs.createReadStream(fromPath); //创建读取流
          writable = fs.createWriteStream(toPath); //创建写入流
          readable.pipe(writable); // 批量大文件写法
          loger.success(`复制完成: ${fromPath}`);
        } else if (stats.isDirectory()) {
          if (fs.existsSync(toPath)) {
            copyFolder(fromPath, toPath);
          } else {
            fs.mkdirSync(toPath);
            copyFolder(fromPath, toPath);
          }
        }
      });
    });
  });
}
