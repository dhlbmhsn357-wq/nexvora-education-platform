import { ChevronLeft, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const labels:Record<string,string>={
  students:'الطلاب',teachers:'المدرسون',groups:'المجموعات',calendar:'الجدول الأسبوعي',sessions:'الجلسات',attendance:'الحضور',
  payments:'المدفوعات',review:'المراجعة',reports:'التقارير','system-summary':'ملخص النظام',risks:'المخاطر',decisions:'القرارات',
  ledger:'دفتر الحركات',overdue:'المتأخرات',messages:'الرسائل',notifications:'الإشعارات',audit:'سجل التدقيق',permissions:'الصلاحيات',
  settings:'الإعدادات',operations:'التشغيل',new:'إضافة جديد',edit:'تعديل',
}

export function Breadcrumbs(){const{pathname}=useLocation();if(pathname==='/')return null;const parts=pathname.split('/').filter(Boolean);return <nav className="breadcrumbs" aria-label="مسار الصفحة"><Link to="/" aria-label="الرئيسية"><Home/></Link>{parts.map((part,index)=>{const path=`/${parts.slice(0,index+1).join('/')}`,last=index===parts.length-1,label=labels[part]||(part.match(/^[a-z]\d+$/i)?'التفاصيل':part);return <span key={path}><ChevronLeft/>{last?<b aria-current="page">{label}</b>:<Link to={path}>{label}</Link>}</span>})}</nav>}
