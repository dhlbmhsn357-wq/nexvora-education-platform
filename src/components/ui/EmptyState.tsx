import type { ReactNode } from 'react'
import { SearchX } from 'lucide-react'

export function EmptyState({title,description,action}:{title:string;description?:string;action?:ReactNode}){
  return <div className="empty"><SearchX aria-hidden="true"/><strong>{title}</strong>{description&&<p>{description}</p>}{action&&<div className="empty-actions">{action}</div>}</div>
}

