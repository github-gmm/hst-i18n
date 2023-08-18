const { generateFolder, generateFile } = require("../utils/common");
const { readFile } = require("../utils/generateExcel");
const path = require("path");

// 当前执行目录
const cwd = process.cwd(); 
const excelPath = path.join(cwd, 'i18n.xlsx'); // 文件目录

module.exports = () => {
  /**
   * 1、读取excel的数据
   * 2、按照语言生成不同文件夹
   * 3、生成json文件
   */
  //  1、读取excel的数据
  const data = readFile({
    path: excelPath
  });

  // 2、按照语言生成不同文件夹
  const head = ['zh_CN', 'zh_HK', 'zh_US'];
  const i18nData = {};
  generateFolder(path.join(cwd, 'i18n')).then((res) => {
    if (res) {
      Promise.all(
        head.map((key) => {
          i18nData[key] = {};
          data.forEach((local) => {
            i18nData[key][local.code] = local[key] ? String(local[key]) : '';
          })
          return generateFolder(path.join(`${cwd}/i18n`, key))
        })
      ).then(() => {
        // 3、生成json文件
        Promise.all(
          head.map((key) => {
            // 将数据对象转换为 JSON 字符串
            const jsonData = JSON.stringify(i18nData[key], null, 2); // 使用 null 和 2 参数进行格式化
            return generateFile(path.join(`${cwd}/i18n/${key}`, 'index.json'), jsonData)
          })
        ).then(() => {
          console.log('json文件生成成功!')
        })
      })
    }
  });
}