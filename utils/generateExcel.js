const ExcelJS = require('exceljs');
const XLSX = require('xlsx');

const writeFile = function (props) {
  const { data: allData, head } = props;

  // 创建一个工作簿
  const workbook = new ExcelJS.Workbook();
  // 创建一个工作表
  const worksheet = workbook.addWorksheet('Sheet 1');
  // 添加数据到工作表
  // 字段头
  worksheet.addRow(head);
  // 数据
  allData.forEach(element => {
    worksheet.addRow(element);
  });

  // 保存工作簿为Excel文件
  workbook.xlsx.writeFile('i18n.xlsx')
    .then(() => {
      console.log('Excel文件已生成');
    })
    .catch((error) => {
      console.error('生成Excel文件时出错:', error);
    });
}

const readFile = function (props) {
  const { path } = props;

  // 读取 Excel 文件
  const workbook = XLSX.readFile(path);
  // 获取第一个工作表的名称
  const sheetName = workbook.SheetNames[0];
  // 获取第一个工作表的数据
  const worksheet = workbook.Sheets[sheetName];
  // 将工作表的数据转换为 JSON 格式
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  // 打印输出 JSON 数据
  return(jsonData);
}


module.exports = {
  writeFile,
  readFile
}

