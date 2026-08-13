import { Bell } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { visibleNotifications } from '../../domain/access'
import { useAppStore } from '../../store/useAppStore'
import { DemoStateSwitcher } from '../../pages/SystemPage'

export function Topbar(){
  const state=useAppStore(value=>value),role=state.role,settings=state.settings,account=state.users.find(item=>item.id===state.currentUserId)
  const unread=visibleNotifications({role,currentTeacherId:state.currentTeacherId,teachers:state.teachers,groups:state.groups,sessions:state.sessions,students:state.students},state.notifications).filter(item=>!item.read).length
  return <header className="topbar"><div><p className="eyebrow">{settings.academyName}</p><h1>مرحبًا، {state.currentUserName}</h1><small className="topbar-role">{account?.title||role}</small></div><div className="topbar-tools">{role==='مدير التشغيل'&&<DemoStateSwitcher/>}<NavLink className="notification-shortcut" to="/notifications" aria-label={`الإشعارات، ${unread} غير مقروء`}><Bell/>{unread>0&&<b>{unread}</b>}</NavLink><time dateTime="2026-08-12">الأربعاء، 12 أغسطس 2026</time></div></header>
}

