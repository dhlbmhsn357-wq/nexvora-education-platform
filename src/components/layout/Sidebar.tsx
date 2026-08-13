import type { RefObject } from 'react'
import { NavLink } from 'react-router-dom'
import { AlertTriangle, BarChart3, Bell, CalendarDays, ClipboardCheck, CreditCard, FileBarChart, GraduationCap, LayoutDashboard, LogOut, MessageSquareText, PanelRightClose, PanelRightOpen, Scale, ScrollText, Settings, ShieldAlert, ShieldCheck, UserRoundCog, Users, WalletCards } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Permission, Role } from '../../domain/types'
import { can } from '../../domain/permissions'
import { visibleNotifications } from '../../domain/access'
import { useAppStore } from '../../store/useAppStore'

type NavItem={to:string;label:string;icon:LucideIcon;permission:Permission;end?:boolean;roles?:Role[]}
const navItems:NavItem[]=[
  {to:'/',label:'الرئيسية',icon:LayoutDashboard,permission:'student.view',end:true,roles:['المدير العام','موظف المتابعة','المدرس','المحاسب']},
  {to:'/operations',label:'مركز العمليات',icon:LayoutDashboard,permission:'student.create',roles:['مدير التشغيل']},
  {to:'/students',label:'الطلاب',icon:Users,permission:'student.view'},
  {to:'/teachers',label:'المدرسون',icon:GraduationCap,permission:'teacher.view'},
  {to:'/groups',label:'المجموعات',icon:UserRoundCog,permission:'group.view'},
  {to:'/calendar',label:'الجدول الأسبوعي',icon:CalendarDays,permission:'schedule.view'},
  {to:'/attendance',label:'الحضور',icon:ClipboardCheck,permission:'attendance.view'},
  {to:'/payments',label:'المدفوعات',icon:CreditCard,permission:'payment.view'},
  {to:'/payments/review',label:'مراجعة الدفعات',icon:WalletCards,permission:'payment.approve'},
  {to:'/overdue',label:'المتأخرات والتصعيد',icon:AlertTriangle,permission:'followup.view'},
  {to:'/messages',label:'الرسائل الجاهزة',icon:MessageSquareText,permission:'followup.view'},
  {to:'/reports',label:'التقارير',icon:BarChart3,permission:'report.view'},
  {to:'/system-summary',label:'الملخص التنفيذي',icon:FileBarChart,permission:'summary.view'},
  {to:'/risks',label:'المخاطر والاستثناءات',icon:ShieldAlert,permission:'risk.view'},
  {to:'/decisions',label:'القرارات التنفيذية',icon:Scale,permission:'decision.view'},
  {to:'/ledger',label:'دفتر الحركات المالية',icon:WalletCards,permission:'ledger.view'},
  {to:'/audit',label:'سجل النشاط',icon:ScrollText,permission:'audit.view'},
  {to:'/permissions',label:'الصلاحيات',icon:ShieldCheck,permission:'permission.view'},
  {to:'/notifications',label:'الإشعارات',icon:Bell,permission:'notification.view'},
  {to:'/settings',label:'الحساب والإعدادات',icon:Settings,permission:'student.view'},
]

export function Sidebar({firstLink,collapsed,onCollapse}:{firstLink:RefObject<HTMLAnchorElement|null>;collapsed:boolean;onCollapse:()=>void}){
  const state=useAppStore(value=>value),role=state.role,teacher=state.teachers.find(item=>item.id===state.currentTeacherId),account=state.users.find(item=>item.id===state.currentUserId)
  const unread=visibleNotifications({role,currentTeacherId:state.currentTeacherId,teachers:state.teachers,groups:state.groups,sessions:state.sessions,students:state.students},state.notifications).filter(item=>!item.read).length
  return <aside className="sidebar" aria-label="التنقل الرئيسي"><div className="brand"><span>N</span><div>NEXVORA<small>إدارة الأكاديمية</small></div></div><button className="sidebar-collapse" aria-label={collapsed?'توسيع القائمة':'تصغير القائمة'} aria-pressed={collapsed} onClick={onCollapse}>{collapsed?<PanelRightOpen/>:<PanelRightClose/>}<span>{collapsed?'توسيع':'تصغير القائمة'}</span></button><nav id="main-navigation">{navItems.filter(item=>can(role,item.permission)&&(!item.roles||item.roles.includes(role))).map((item,index)=>{const Icon=item.icon;return <NavLink ref={index===0?firstLink:undefined} key={item.to} to={item.to} end={item.end} title={collapsed?item.label:undefined}><Icon/><span>{item.label}</span>{item.to==='/notifications'&&unread>0&&<b className="nav-count">{unread}</b>}</NavLink>})}</nav><div className="role-switch account-scope"><strong>{state.currentUserName}</strong><small>{account?.title||teacher?.specialty||role}</small><button onClick={state.logout} title={collapsed?'تسجيل الخروج':undefined}><LogOut/><span>تسجيل الخروج</span></button></div></aside>
}
