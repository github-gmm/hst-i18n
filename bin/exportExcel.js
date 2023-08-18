const fs = require("fs");
const glob = require("glob");
const path = require("path");
const { writeFile } = require('../utils/generateExcel');
const { assemblyData } = require('../utils/common');

const data = [];
const cwd = process.cwd(); 
const projectPath = path.join(cwd, ''); // 前端项目目录

module.exports = () => {
  /**
   * 1、读取全局的多语言翻译
   * 2、把匹配数据+封装
   * 3、生成excel文件
   */

  // 1、读取全局的多语言翻译
  const files = glob.sync("**/*.+(js|tsx|ts)", {
    cwd: projectPath,
    ignore: "**/node_modules/**", // 忽略node_modules文件夹
  });

  // 2、把匹配数据+封装
  const regex = /intl\.\$T\(['"]([^'"]+)['"]\)\.\$D\(['"]([^'"]+)['"]\)/g;
  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");
    content.replace(regex, (match, p1, p2) => {
      data.push({
        code: p1,
        zh_CN: p2,
      })
    });
  })

  // 3、生成excel文件
  const head = ['code', 'zh_CN', 'zh_HK', 'zh_US'];
  const newData = assemblyData(data, head);
  writeFile({
    data: newData,
    head,
  });
}