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
            name: '导出未翻译字段（中文、英文）',
            value: 'export'
        },
        {
            name: '写入翻译 - (i18n.xlsx)',
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
      analysisExcel();
      break;
  }
})