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
        // {
        //     name: '生成翻译文件i18n.xlsx（只支持英文、中文）',
        //     value: 'export'
        // },
        // {
        //     name: '写入翻译i18n文件夹',
        //     value: 'import'
        // },
        {
          name: '把代码中 Yaml 文件导出成 Excel 翻译文件',
          value: 'exportY'
        },
        {
          name: '把代码中 Excel 文件（i18n.xlsx）转成 yaml 文件',
          value: 'importY'
        }
    ]
  },
  {
    type: 'checkbox',
    name: 'langs',
    message: '请选择导出的语种（空格选中）？',
    choices: ['zh_CN', 'en_US', 'zh_HK', 'my_MS'],
    default: ['zh_CN', 'en_US', 'zh_HK'],
    when: (answers) => answers.type === 'exportY'
  },
  {
    type: 'list',
    name: 'isTemplate',
    message: '是否存在旧的 Excel 翻译模板（demo.xlsx），自动匹配在一起',
    choices: [
      { name: '是', value: '1' },
      { name: '否', value: '2' },
    ],
    when: (answers) => answers.type === 'exportY'
  },
  {
    type: 'list',
    name: 'defaultLang',
    message: '默认语言',
    choices: [
      { name: 'zh_CN', value: 'zh_CN' },
      { name: 'en_US', value: 'en_US' },
      { name: 'zh_HK', value: 'zh_HK' },
      { name: 'my_MS', value: 'my_MS' },
    ],
    default: 'zh_CN',
  },
]

inquirer.prompt(questions).then(answer=>{
  console.log(answer);
  const {type, langs, isTemplate, defaultLang = 'zh_CN'} = answer;
  switch (type) {
    // case 'export':
    //   const headColumns = ['code', 'zh_CN', 'en_US']
    //   exportExcel(headColumns);
    //   break;
    // case 'import':
    //   const headColumns1 = ['zh_CN', 'en_US', 'zh_HK']
    //   analysisExcel(headColumns1);
    //   break;
    case 'exportY':
      const headColumns2 = ['code', ...langs];
      toExcel(headColumns2, langs, isTemplate, defaultLang);
      break;
    case 'importY':
      const headColumns3 = ['zh_CN', 'en_US', 'zh_HK'];
      toYaml(headColumns3);
      break;
  }
})