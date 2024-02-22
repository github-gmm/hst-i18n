#! /usr/bin/env node
const inquirer = require('inquirer');
const exportExcel = require('./exportExcel');
const analysisExcel = require('./analysisExcel');

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
  }
})