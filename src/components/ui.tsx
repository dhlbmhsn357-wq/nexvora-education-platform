import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { Permission } from '../domain/types'
import { can } from '../domain/permissions'
import { useAppStore } from '../store/useAppStore'

export function PageHeader({eyebrow,title,description,action}:{eyebrow:string;title:string;description?:string;action?:ReactNode}){
  return <header className="page-header"><div><p className="eyebrow">{eyebrow}</p><h2 tabIndex={-1}>{title}</h2>{description&&<p>{description}</p>}</div>{action&&<div className="page-actions">{action}</div>}</header>
}

export function Metric({label,value,hint}:{label:string;value:ReactNode;hint?:string}){
  return <article className="metric"><p>{label}</p><strong>{value}</strong>{hint&&<small>{hint}</small>}</article>
}

export function StatusBadge({children,tone='neutral'}:{children:ReactNode;tone?:'success'|'warning'|'danger'|'neutral'}){
  return <span className={`badge ${tone}`}>{children}</span>
}

export function ProtectedButton({permission,children,...props}:ButtonHTMLAttributes<HTMLButtonElement>&{permission:Permission;children:ReactNode}){
  const role=useAppStore(state=>state.role);const allowed=can(role,permission)
  return <button {...props} disabled={!allowed||props.disabled} aria-disabled={!allowed||props.disabled} title={!allowed?`غير متاح لدور ${role}`:props.title}>{children}{!allowed&&<span className="sr-only"> — غير مسموح</span>}</button>
}

export function EmptyState({title,description}:{title:string;description?:string}){
  return <div className="empty"><strong>{title}</strong>{description&&<p>{description}</p>}</div>
}
