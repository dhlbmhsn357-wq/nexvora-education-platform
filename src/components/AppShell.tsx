import { useEffect, useRef, useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AlertTriangle, BarChart3, Bell, CalendarDays, ClipboardCheck, CreditCard, FileBarChart, GraduationCap, LayoutDashboard, LogOut, Menu, MessageSquareText, ScrollText, Settings, ShieldCheck, UserRoundCog, Users, WalletCards, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Permission } from '../domain/types'
import { can } from '../domain/permissions'
import { useAppStore } from '../store/useAppStore'
import { DemoStateSwitcher } from '../pages/SystemPage'
import { visibleNotifications } from '../domain/access'

type NavItem={to:string;label:string;icon:LucideIcon;permission:Permission;end?:boolean}
const items:NavItem[]=[
  {to:'/',label:'الرئيسية',icon:LayoutDashboard,permission:'student.view',end:true},
  {to:'/students',label:'الطلاب',icon:Users,permission:'student.view'},
  {to:'/teachers',label:'المدرسون',icon:GraduationCap,permission:'teacher.view'},
  {to:'/groups',label:'المجموعات',icon:UserRoundCog,permission:'group.view'},
  {to:'/calendar',label:'الجدول الأسبوعي',icon:CalendarDays,permission:'schedule.view'},
  {to:'/attendance',label:'الحضور',icon:ClipboardCheck,permission:'attendance.view'},
  {to:'/payments',label:'المدفوعات',icon:CreditCard,permission:'payment.view'},
  {to:'/payments/review',label:'مراجعة الدفعات',icon:WalletCards,permission:'payment.approve'},
  {to:'/overdue',label:'متابعة المتأخرات',icon:AlertTriangle,permission:'followup.view'},
  {to:'/messages',label:'قوالب الرسائل',icon:MessageSquareText,permission:'followup.view'},
  {to:'/reports',label:'التقارير',icon:BarChart3,permission:'report.view'},
  {to:'/system-summary',label:'ملخص النظام',icon:FileBarChart,permission:'summary.view'},
  {to:'/audit',label:'سجل النشاط',icon:ScrollText,permission:'audit.view'},
  {to:'/permissions',label:'الصلاحيات',icon:ShieldCheck,permission:'permission.view'},
  {to:'/notifications',label:'الإشعارات',icon:Bell,permission:'notification.view'},
  {to:'/settings',label:'الحساب والإعدادات',icon:Settings,permission:'student.view'},
]

export function AppShell({children}:{children:ReactNode}){
  const state=useAppStore(value=>value),role=state.role,teacher=state.teachers.find(item=>item.id===state.currentTeacherId),logout=state.logout,settings=state.settings,unread=visibleNotifications({role,currentTeacherId:state.currentTeacherId,teachers:state.teachers,groups:state.groups,sessions:state.sessions,students:state.students},state.notifications).filter(item=>!item.read).length
  const [open,setOpen]=useState(false);const location=useLocation();const firstLink=useRef<HTMLAnchorElement>(null)
  useEffect(()=>{setOpen(false);document.querySelector<HTMLElement>('.page-header h2')?.focus()},[location.pathname])
  useEffect(()=>{document.documentElement.dataset.theme=settings.theme;document.documentElement.dataset.density=settings.density},[settings])
  useEffect(()=>{const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false)};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close)},[])
  return <div className={`app-shell ${open?'menu-open':''}`}>
    <a className="skip-link" href="#main-content">تخطَّ إلى المحتوى الرئيسي</a>
    <button className="mobile-menu" aria-label={open?'إغلاق القائمة':'فتح القائمة'} aria-expanded={open} aria-controls="main-navigation" onClick={()=>{setOpen(value=>!value);setTimeout(()=>firstLink.current?.focus(),0)}}>{open?<X/>:<Menu/>}</button>
    {open&&<button className="menu-backdrop" aria-label="إغلاق خلفية القائمة" onClick={()=>setOpen(false)}/>} 
    <aside className="sidebar" aria-label="التنقل الرئيسي"><div className="brand"><span>N</span><div>NEXVORA<small>إدارة الأكاديمية</small></div></div><nav id="main-navigation">{items.filter(item=>can(role,item.permission)).map((item,index)=>{const Icon=item.icon;return <NavLink ref={index===0?firstLink:undefined} key={item.to} to={item.to} end={item.end}><Icon size={19}/><span>{item.label}</span>{item.to==='/notifications'&&unread>0&&<b className="nav-count">{unread}</b>}</NavLink>})}</nav><div className="role-switch account-scope"><strong>{teacher?.name||role}</strong><small>{role==='المدرس'?teacher?.specialty:role}</small><button onClick={logout}><LogOut size={17}/>تسجيل الخروج</button></div></aside>
    <main id="main-content"><header className="topbar"><div><p className="eyebrow">{settings.academyName}</p><h1>مرحبًا، {teacher?.name||role}</h1><small className="topbar-role">{role}</small></div><div className="topbar-tools">{role==='مدير التشغيل'&&<DemoStateSwitcher/>}<NavLink className="notification-shortcut" to="/notifications" aria-label={`الإشعارات، ${unread} غير مقروء`}><Bell/>{unread>0&&<b>{unread}</b>}</NavLink><time dateTime="2026-08-11">الثلاثاء، 11 أغسطس 2026</time></div></header>{children}</main>
  </div>
}
