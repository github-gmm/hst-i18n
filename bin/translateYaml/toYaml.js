const { generateFolder, generateFile, zhTransformHk, unFlattenObject } = require("../../utils/common");
const { readFile } = require("../../utils/generateExcel");
const path = require("path");
const yaml = require('js-yaml');

// 当前执行目录
const cwd = process.cwd(); 
const excelPath = path.join(cwd, 'i18n.xlsx'); // 文件目录

module.exports = (columns) => {
  /**
   * 1、读取excel的数据
   * 2、按照语言生成不同文件夹
   * 3、生成json文件
   */
  //  1、读取excel的数据
  const data = readFile({
    path: excelPath
  });

  const getLang = (lang, defaultVal) => {
    if (lang === 'zh_HK') {
      return zhTransformHk(defaultVal, lang);
    }
    return '';
  }

  // 2、按照语言生成不同文件夹
  const i18nData = {};
  generateFolder(path.join(cwd, 'i18n')).then((res) => {
    if (res) {
      Promise.all(
        columns.map((key) => {
          i18nData[key] = {};
          data.forEach((local) => {
            i18nData[key][local.code] = local[key] ? String(local[key]) : getLang(key, local['zh_CN']);
          })
          return generateFolder(path.join(`${cwd}/i18n`, key))
        })
      ).then(() => {
        // 3、生成yaml文件
        Promise.all(
          columns.map((key) => {
            // 将数据对象转换为 JSON 字符串
            const yamlString = yaml.dump(unFlattenObject(i18nData[key]));
            return generateFile(path.join(`${cwd}/i18n/${key}`, 'index.yaml'), yamlString)
          })
        )
      })
    }
  });
  console.log('yaml文件生成成功!')
}