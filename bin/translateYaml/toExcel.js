const glob = require("glob");
const path = require("path");
const { writeFile, readFile } = require('../../utils/generateExcel');
const { assemblyData, getJsonDataByYaml } = require('../../utils/common');

const data = [];
const demoData = {};
const cwd = process.cwd(); 
const excelPath = path.join(cwd, 'demo.xlsx'); // 文件目录
const projectPath = path.join(cwd, ''); // 前端项目目录
let localesLang = {
  zh_CN: {},
  en_US: {},
  zh_HK: {},
  my_MS: {},
};

module.exports = async (columns, langs, isTemplate, defaultLang) => {
  /**
   * 1、读取yaml文件,把yaml文件转化为扁平化json对象
   * 2、读取模板文件（把模板文件里面的翻译）
   * 3、生成excel文件
   */

  // 1、读取yaml文件,把yaml文件转化为扁平化json对象
  const readYamlFile = async () => {
    const matchLang = (name, lang) => {
      const langCopy = lang.replace('_', '-');
      return name.includes(lang) || name.includes(langCopy);
    }

    const localeFiles = glob.sync("**/*.+(yaml)", {
      cwd: projectPath,
      ignore: "**/node_modules/**", // 忽略node_modules文件夹
    });

    for (const localeFile of localeFiles) {
      // 读取英文翻译
      for (const lang of langs) {
        const f = matchLang(localeFile, lang);
        if (f) {
          localesLang[lang]  = {
            ...localesLang[lang],
            ...await getJsonDataByYaml(localeFile),
          };
        }
      }
    }
  }

  await readYamlFile();

  // 2、读取模板文件（把模板文件里面的翻译）
  const formateData = () => {
    if (isTemplate === '2') {
      return
    }

    const dd = readFile({
      path: excelPath
    }) || {};

    dd.forEach((res) => {
      const { code, ...other } = res
      demoData[code?.toLowerCase()] = other;
    })
  }

  formateData();
  
  const toJson = async () => {
    const formateJson = (code) => {
      const item = {};
      const key = localesLang[defaultLang][code] || '';
      const obj = demoData[key?.toLowerCase()] || {};
      langs.forEach((res) => {
        item[res] = localesLang[res][code] || obj[res] || '';
      })
      return item;
    }

    Object.keys(localesLang[defaultLang]).forEach((code) => {
      data.push({
        code,
        ...formateJson(code)
      })
    })
  }

  toJson();
  
  // 3、生成excel文件
  const newData = assemblyData(data, columns);
  writeFile({ data: newData, head: columns, });
}