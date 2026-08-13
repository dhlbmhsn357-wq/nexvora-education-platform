import type { ReactNode } from 'react'

export function MobileCard({title,subtitle,meta,actions}:{title:string;subtitle?:string;meta?:ReactNode;actions?:ReactNode}){
  return <article className="mobile-data-card"><header><div><strong>{title}</strong>{subtitle&&<small>{subtitle}</small>}</div>{actions}</header>{meta&&<div className="mobile-card-meta">{meta}</div>}</article>
}

