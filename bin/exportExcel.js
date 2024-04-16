const fs = require("fs");
const glob = require("glob");
const path = require("path");
const { writeFile } = require('../utils/generateExcel');
const { assemblyData, getJsonData } = require('../utils/common');

const data = [];
const cwd = process.cwd(); 
const projectPath = path.join(cwd, ''); // 前端项目目录
let localesLang = {
  zh_CN: {},
  en_US: {}
};

module.exports = async (columns) => {
  /**
   * 1、读取全局的多语言翻译（已翻译的）
   * 2、读取全局的多语言翻译（未翻译的）
   * 3、生成excel文件
   */

  // 1、读取全局的多语言翻译（已翻译的）
  const localesLangFun = async () => {
    const localeFiles = glob.sync("**/*.+(json)", {
      cwd: projectPath,
      ignore: "**/node_modules/**", // 忽略node_modules文件夹
    });
    for (const localeFile of localeFiles) {
      if (localeFile.includes('locales')) {
        // 读取英文翻译
        if (localeFile.includes('en_US') || localeFile.includes('en-US') ) {
          localesLang['en_US']  = {
            ...localesLang['en_US'],
            ...await getJsonData(localeFile),
          };
        }
        // 读取中文翻译
        if (localeFile.includes('zh_CN') || localeFile.includes('zh-CN') ) {
          localesLang['zh_CN']  = {
            ...localesLang['zh_CN'],
            ...await getJsonData(localeFile),
          };
        }
      }
    }
  }

  await localesLangFun();
  

  // 2、把匹配数据 + 封装
  const noLocalesLangFun = async () => {
    const files = glob.sync("**/*.+(js|tsx|ts)", {
      cwd: projectPath,
      ignore: "**/node_modules/**", // 忽略node_modules文件夹
    });
    const regex = /lang\s*?\.\$T\('([^']*)'.*?\)\s*?\.\$D\(\s*?'([^']*)'\s*?\)/g;
    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8");
      content.replace(regex, (match, p1, p2) => {
        // 重复key不导出
        console.log(match)
        const f = data.findIndex((res) => res['code'] === p1);
        if (f === -1) {
          data.push({
            code: p1,  // 唯一编码
            zh_CN: localesLang['zh_CN'][p1] ? localesLang['zh_CN'][p1] : p2, // 中文
            en_US: localesLang['en_US'][p1] ? localesLang['en_US'][p1] : p2, // 英文
          })
        }
      });
    }
  }

  noLocalesLangFun();
  

  // 3、生成excel文件
  const newData = assemblyData(data, columns);
  writeFile({ data: newData, head: columns, });
}