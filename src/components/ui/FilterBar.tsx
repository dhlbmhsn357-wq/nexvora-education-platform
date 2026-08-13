import type { ReactNode } from 'react'

export function FilterBar({children,summary}:{children:ReactNode;summary?:ReactNode}){
  return <section className="filter-region" aria-label="البحث والتصفية"><div className="filter-bar">{children}</div>{summary&&<div className="filter-summary" aria-live="polite">{summary}</div>}</section>
}

