import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { createServer } from 'vite'

const server=await createServer({server:{middlewareMode:true},appType:'custom',logLevel:'silent'})
try{
  const {buildWorkbookBytes}=await server.ssrLoadModule('/src/reporting/exportExcel.ts')
  const bytes=buildWorkbookBytes([
    {name:'الملخص التنفيذي',rows:[['المؤشر','القيمة'],['الطلاب',5],['المبالغ المستحقة',2800]]},
    {name:'المدرسون',rows:[['الكود','المدرس','الحصص'],['TR-1001','أحمد مصطفى',2]]},
    {name:'الطلاب',rows:[['الكود','الاسم','المتبقي'],['ST-1001','أحمد محمد',500]]},
  ])
  assert.equal(String.fromCharCode(...bytes.slice(0,2)),'PK','XLSX must be a ZIP package')
  const decoder=new TextDecoder(),names=[];let offset=0
  while(offset+30<bytes.length&&new DataView(bytes.buffer,bytes.byteOffset+offset,4).getUint32(0,true)===0x04034b50){const view=new DataView(bytes.buffer,bytes.byteOffset+offset);const size=view.getUint32(18,true),nameLength=view.getUint16(26,true),extraLength=view.getUint16(28,true);names.push(decoder.decode(bytes.slice(offset+30,offset+30+nameLength)));offset+=30+nameLength+extraLength+size}
  for(const expected of ['[Content_Types].xml','xl/workbook.xml','xl/styles.xml','xl/worksheets/sheet1.xml','xl/worksheets/sheet2.xml','xl/worksheets/sheet3.xml'])assert.ok(names.includes(expected),`Missing ${expected}`)
  await writeFile('dist/NEXVORA-system-summary-verified.xlsx',bytes)
  console.log(JSON.stringify({status:'PASS',format:'xlsx',bytes:bytes.length,entries:names.length,file:'dist/NEXVORA-system-summary-verified.xlsx'},null,2))
}finally{await server.close()}
