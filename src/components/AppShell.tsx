import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { Breadcrumbs } from './Breadcrumbs'
import { MobileDrawer } from './layout/MobileDrawer'
import { Sidebar } from './layout/Sidebar'
import { Topbar } from './layout/Topbar'

export function AppShell({children}:{children:ReactNode}){
  const settings=useAppStore(state=>state.settings),[open,setOpen]=useState(false),[collapsed,setCollapsed]=useState(false),location=useLocation(),firstLink=useRef<HTMLAnchorElement>(null)
  useEffect(()=>{setOpen(false);document.querySelector<HTMLElement>('.page-header h2')?.focus()},[location.pathname])
  useEffect(()=>{document.documentElement.dataset.theme=settings.theme;document.documentElement.dataset.density=settings.density},[settings])
  useEffect(()=>{const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false)};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close)},[])
  return <div className={`app-shell ${open?'menu-open':''} ${collapsed?'sidebar-collapsed':''}`}><a className="skip-link" href="#main-content">تخطَّ إلى المحتوى الرئيسي</a><MobileDrawer open={open} onToggle={()=>setOpen(value=>!value)} firstLink={firstLink}/><Sidebar firstLink={firstLink} collapsed={collapsed} onCollapse={()=>setCollapsed(value=>!value)}/><main id="main-content"><Topbar/><Breadcrumbs/>{children}</main></div>
}
