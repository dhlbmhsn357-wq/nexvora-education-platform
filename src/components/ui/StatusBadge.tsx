import type { ReactNode } from 'react'

export type StatusTone='success'|'warning'|'danger'|'neutral'|'info'
export function StatusBadge({children,tone='neutral'}:{children:ReactNode;tone?:StatusTone}){
  return <span className={`badge ${tone}`}>{children}</span>
}

