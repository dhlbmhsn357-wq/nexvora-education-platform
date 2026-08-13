import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { Permission } from '../domain/types'
import { can } from '../domain/permissions'
import { useAppStore } from '../store/useAppStore'
export { PageHeader } from './ui/PageHeader'
export { StatusBadge } from './ui/StatusBadge'
export { EmptyState } from './ui/EmptyState'
export { ConfirmDialog } from './ui/ConfirmDialog'
export { MetricCard as Metric } from './ui/MetricCard'

export function ProtectedButton({permission,children,...props}:ButtonHTMLAttributes<HTMLButtonElement>&{permission:Permission;children:ReactNode}){
  const state=useAppStore(value=>value),account=state.users.find(item=>item.id===state.currentUserId);const accountAllowed=state.role!=='المحاسب'||!['payment.create','payment.approve'].includes(permission)||account?.capabilities?.includes(permission as 'payment.create'|'payment.approve'),allowed=can(state.role,permission)&&accountAllowed
  return <button {...props} disabled={!allowed||props.disabled} aria-disabled={!allowed||props.disabled} title={!allowed?`غير متاح لحساب ${state.currentUserName}`:props.title}>{children}{!allowed&&<span className="sr-only"> — غير مسموح</span>}</button>
}
