import type { ReactNode } from 'react'

export function PageHeader({eyebrow,title,description,action}:{eyebrow:string;title:string;description?:string;action?:ReactNode}){
  return <header className="page-header"><div><p className="eyebrow">{eyebrow}</p><h2 tabIndex={-1}>{title}</h2>{description&&<p>{description}</p>}</div>{action&&<div className="page-actions">{action}</div>}</header>
}

