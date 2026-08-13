import type { ReactNode } from 'react'

export type DataColumn<Row>={key:string;label:string;render:(row:Row)=>ReactNode;numeric?:boolean}
export function DataTable<Row>({rows,columns,getRowKey,empty}:{rows:Row[];columns:DataColumn<Row>[];getRowKey:(row:Row)=>string;empty?:ReactNode}){
  if(!rows.length)return <>{empty}</>
  return <div className="table-wrap responsive-table"><table><thead><tr>{columns.map(column=><th key={column.key} scope="col" className={column.numeric?'numeric-cell':undefined}>{column.label}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={getRowKey(row)}>{columns.map(column=><td key={column.key} data-label={column.label} className={column.numeric?'numeric-cell':undefined}>{column.render(row)}</td>)}</tr>)}</tbody></table></div>
}

