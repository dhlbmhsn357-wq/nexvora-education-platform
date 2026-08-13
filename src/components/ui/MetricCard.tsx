import type { ReactNode } from 'react'

export function MetricCard({label,value,hint,icon}:{label:string;value:ReactNode;hint?:string;icon?:ReactNode}){
  return <article className="metric"><div className="metric-heading"><p>{label}</p>{icon}</div><strong>{value}</strong>{hint&&<small>{hint}</small>}</article>
}

