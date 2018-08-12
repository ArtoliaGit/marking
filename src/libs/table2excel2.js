import XLSX from 'xlsx'

export default function(tableColumns, tableData, fileName, tabledic = {}) {
  let _headers = tableColumns.map(v => v.key)
  let _headers_text = tableColumns.map(v => v.title)
  let _data = tableData
  let headers = _headers_text
    .map((v, i) => Object.assign({}, {v: v, position: String.fromCharCode(65 + i) + 1}))
    .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {})
  let data = _data
    .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: tabledic[k] ? tabledic[k][v[k]] : v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
    .reduce((prev, next) => prev.concat(next))
    .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {})
  // 合并 headers 和 data
  let output = Object.assign({}, headers, data)
  // 获取所有单元格的位置
  let outputPos = Object.keys(output)
  // 计算出范围
  let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1]

  // 构建 workbook 对象
  let wb = {
    SheetNames: ['mySheet'],
    Sheets: {
      'mySheet': Object.assign({}, output, { '!ref': ref })
    }
  }

  // 导出 Excel
  XLSX.writeFile(wb, fileName + '.xlsx')
}