const fs = require("fs");
const glob = require("glob");
const path = require("path");
const { writeFile } = require('../../utils/generateExcel');
const { assemblyData, getJsonDataByYaml } = require('../../utils/common');

const data = [];
const cwd = process.cwd(); 
const projectPath = path.join(cwd, ''); // 前端项目目录
let localesLang = {
  zh_CN: {},
  en_US: {}
};

module.exports = async (columns) => {
  /**
   * 1、读取yaml文件
   * 2、把yaml文件转化为扁平化json对象
   * 3、生成excel文件
   */

  // 1、读取yaml文件
  const readYamlFile = async () => {
    const localeFiles = glob.sync("**/*.+(yaml)", {
      cwd: projectPath,
      ignore: "**/node_modules/**", // 忽略node_modules文件夹
    });
    for (const localeFile of localeFiles) {
      // 读取英文翻译
      if (localeFile.includes('en_US') || localeFile.includes('en-US') ) {
        localesLang['en_US']  = {
          ...localesLang['en_US'],
          ...await getJsonDataByYaml(localeFile),
        };
      }
      // 读取中文翻译
      if (localeFile.includes('zh_CN') || localeFile.includes('zh-CN') ) {
        localesLang['zh_CN']  = {
          ...localesLang['zh_CN'],
          ...await getJsonDataByYaml(localeFile),
        };
      }
    }
  }

  await readYamlFile();
  

  // 2、把yaml文件转化为扁平化json对象
  const yamlToJson = async () => {
    Object.keys(localesLang['zh_CN']).forEach((res) => {
      data.push({
        code: res,  // 唯一编码
        zh_CN: localesLang['zh_CN'][res], // 中文
        en_US: localesLang['en_US'][res], // 英文
      })
    })
  }

  yamlToJson();
  
  // 3、生成excel文件
  const newData = assemblyData(data, columns);
  writeFile({ data: newData, head: columns, });
}