import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function ExecutiveKpi({label,value,hint,to,icon}:{label:string;value:ReactNode;hint?:string;to?:string;icon?:ReactNode}){
  const content=<><div><span>{label}</span>{icon}</div><strong>{value}</strong>{hint&&<small>{hint}</small>}</>
  return to?<Link className="executive-kpi" to={to}>{content}</Link>:<article className="executive-kpi">{content}</article>
}

