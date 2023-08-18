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
            name: '导出Excel未翻译文件',
            value: 'export'
        },
        {
            name: '导入Excel已翻译文件',
            value: 'import'
        }
    ]
  }
]

inquirer.prompt(questions).then(answer=>{
  console.log(answer);
  const {type} = answer;
  switch (type) {
    case 'export':
      exportExcel();
      break;
    case 'import':
      analysisExcel();
      break;
  }
})