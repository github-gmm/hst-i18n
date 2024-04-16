#! /usr/bin/env node
const inquirer = require('inquirer');
const exportExcel = require('./exportExcel');
const analysisExcel = require('./analysisExcel');
const toExcel = require('./translateYaml/toExcel');
const toYaml = require('./translateYaml/toYaml');

const questions = [
  {
    type: 'list',
    message: '请选择操作类型？',
    name: 'type',
    choices: [
        {
            name: '生成翻译文件i18n.xlsx（只支持英文、中文）',
            value: 'export'
        },
        {
            name: '写入翻译i18n文件夹',
            value: 'import'
        },
        {
          name: '导出yaml翻译文件',
          value: 'exportY'
        },
        {
          name: '导入yaml翻译文件',
          value: 'importY'
        }
    ]
  },
]

inquirer.prompt(questions).then(answer=>{
  console.log(answer);
  const {type} = answer;
  switch (type) {
    case 'export':
      const headColumns = ['code', 'zh_CN', 'en_US']
      exportExcel(headColumns);
      break;
    case 'import':
      const headColumns1 = ['zh_CN', 'en_US', 'zh_HK']
      analysisExcel(headColumns1);
      break;
    case 'exportY':
      const headColumns2 = ['code', 'zh_CN', 'en_US', 'zh_HK'];
      toExcel(headColumns2);
      break;
    case 'importY':
      const headColumns3 = ['zh_CN', 'en_US', 'zh_HK'];
      toYaml(headColumns3);
      break;
  }
})