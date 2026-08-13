import type { RefObject } from 'react'
import { Menu, X } from 'lucide-react'

export function MobileDrawer({open,onToggle,firstLink}:{open:boolean;onToggle:()=>void;firstLink:RefObject<HTMLAnchorElement|null>}){
  const toggle=()=>{onToggle();if(!open)window.setTimeout(()=>firstLink.current?.focus(),0)}
  return <><button className="mobile-menu" aria-label={open?'إغلاق القائمة':'فتح القائمة'} aria-expanded={open} aria-controls="main-navigation" onClick={toggle}>{open?<X/>:<Menu/>}</button>{open&&<button className="menu-backdrop" aria-label="إغلاق خلفية القائمة" onClick={onToggle}/>}</>
}

