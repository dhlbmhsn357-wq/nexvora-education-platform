import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { AlertCircle, BriefcaseBusiness, Building2, Calculator, GraduationCap, Headphones, KeyRound, LoaderCircle, Palette, Save, ShieldCheck, SlidersHorizontal, UserCog } from 'lucide-react'
import type { DemoState, Role } from '../domain/types'
import { PageHeader } from '../components/ui'
import { Toast } from '../components/ui/Toast'
import { can } from '../domain/permissions'
import { useAppStore } from '../store/useAppStore'

const roleOptions: {role:Role;label:string;description:string;icon:typeof BriefcaseBusiness}[]=[
  {role:'المدير العام',label:'المدير العام',description:'الرؤية التنفيذية والحوكمة',icon:BriefcaseBusiness},
  {role:'مدير التشغيل',label:'مدير التشغيل',description:'التشغيل اليومي والجدولة',icon:SlidersHorizontal},
  {role:'موظف المتابعة',label:'موظف المتابعة',description:'المتأخرات والتواصل',icon:Headphones},
  {role:'المدرس',label:'المدرس',description:'المجموعات والحضور',icon:GraduationCap},
  {role:'المحاسب',label:'المحاسب',description:'الدفعات والمراجعة',icon:Calculator},
]

export function LoginPage(){
  const login=useAppStore(state=>state.login),users=useAppStore(state=>state.users)
  const [role,setRole]=useState<Role>('المدير العام')
  const accounts=users.filter(item=>item.active&&item.role===role)
  const [accountId,setAccountId]=useState('u-ceo')
  const account=accounts.find(item=>item.id===accountId)||accounts[0]
  const changeRole=(next:Role)=>{setRole(next);setAccountId(users.find(item=>item.active&&item.role===next)?.id||'')}
  const submit=(event:FormEvent)=>{event.preventDefault();if(account)login(role,account.id);window.location.hash='#/'}
  return <main className="login-page">
    <section className="login-card" aria-labelledby="login-title">
      <div className="login-brand"><span>N</span><div><strong>NEXVORA</strong><small>إدارة الأكاديمية</small></div></div>
      <div className="login-intro"><p className="eyebrow">مساحة عمل تشغيلية آمنة</p><h1 id="login-title">تسجيل الدخول</h1><p>اختر الدور والحساب التجريبي لرؤية مساحة العمل والصلاحيات المطابقة له فقط.</p></div>
      <form onSubmit={submit}>
        <fieldset className="role-picker"><legend>الدور التجريبي</legend><div className="role-card-grid">{roleOptions.map(item=>{const Icon=item.icon,selected=role===item.role;return <button type="button" className={`role-card ${selected?'selected':''}`} aria-pressed={selected} onClick={()=>changeRole(item.role)} key={item.role}><Icon aria-hidden="true"/><span><strong>{item.label}</strong><small>{item.description}</small></span></button>})}</div></fieldset>
        <div className="login-fields"><label className="field"><span>الحساب</span><select value={account?.id||''} onChange={event=>setAccountId(event.target.value)}>{accounts.map(item=><option key={item.id} value={item.id}>{item.name} · {item.title}</option>)}</select></label><label className="field"><span>البريد الإلكتروني</span><input type="email" value={account?.email||''} readOnly/></label></div>
        <p className="login-scope">{role==='المحاسب'?'التسجيل والمراجعة منفصلان؛ لا يستطيع منشئ الدفعة اعتمادها.':role==='المدرس'?'يرى كل مدرس طلابه ومجموعاته وحصصه فقط.':'ستظهر الشاشات والإجراءات المصرح بها لهذا الحساب فقط.'}</p>
        <button className="button primary login-submit" type="submit"><KeyRound/>دخول إلى مساحة العمل</button>
      </form>
      <div className="login-note"><ShieldCheck/><span>هذه تجربة محلية؛ لا تُرسل بيانات الدخول إلى أي خادم.</span></div>
    </section>
  </main>
}

type SettingsTab='academy'|'appearance'|'notifications'
export function SettingsPage(){
  const settings=useAppStore(state=>state.settings),save=useAppStore(state=>state.saveSettings),role=useAppStore(state=>state.role),teacher=useAppStore(state=>state.teachers.find(item=>item.id===state.currentTeacherId)),logout=useAppStore(state=>state.logout),canEditAcademy=can(role,'settings.academy')
  const [draft,setDraft]=useState(settings),[saved,setSaved]=useState(false),[tab,setTab]=useState<SettingsTab>(canEditAcademy?'academy':'appearance')
  const submit=(event:FormEvent)=>{event.preventDefault();save(canEditAcademy?draft:{...settings,theme:draft.theme,density:draft.density});setSaved(true);window.setTimeout(()=>setSaved(false),2500)}
  return <><PageHeader eyebrow="الإعدادات" title="الحساب والإعدادات" description="تحكم في بيانات الأكاديمية ومظهر مساحة العمل وتفضيلات التنبيه من مكان واحد."/><div className="settings-layout"><aside className="panel account-summary"><div className="avatar">{teacher?.name[0]||role[0]}</div><h3>{teacher?.name||role}</h3><p>{teacher?.email||settings.email}</p><dl><div><dt>الدور</dt><dd>{role}</dd></div><div><dt>الأكاديمية</dt><dd>{settings.academyName}</dd></div><div><dt>نطاق الوصول</dt><dd>{role==='مدير التشغيل'?'التشغيل اليومي':role==='المدير العام'?'الرؤية التنفيذية':role==='المدرس'?'بياناتك التعليمية فقط':'مهام الدور فقط'}</dd></div></dl><button className="button danger" onClick={logout}>تسجيل الخروج</button></aside><form className="panel settings-panel" onSubmit={submit}><nav className="tabs settings-tabs" aria-label="أقسام الإعدادات">{canEditAcademy&&<button type="button" className={tab==='academy'?'active':''} aria-pressed={tab==='academy'} onClick={()=>setTab('academy')}><Building2/>بيانات الأكاديمية</button>}<button type="button" className={tab==='appearance'?'active':''} aria-pressed={tab==='appearance'} onClick={()=>setTab('appearance')}><Palette/>المظهر</button><button type="button" className={tab==='notifications'?'active':''} aria-pressed={tab==='notifications'} onClick={()=>setTab('notifications')}><UserCog/>الإشعارات</button></nav>{tab==='academy'&&canEditAcademy&&<section className="settings-section"><h3>بيانات الأكاديمية</h3><div className="form-grid"><label className="field full"><span>اسم الأكاديمية</span><input value={draft.academyName} onChange={event=>setDraft({...draft,academyName:event.target.value})}/></label><label className="field"><span>البريد</span><input type="email" value={draft.email} onChange={event=>setDraft({...draft,email:event.target.value})}/></label><label className="field"><span>الهاتف</span><input value={draft.phone} onChange={event=>setDraft({...draft,phone:event.target.value})}/></label></div></section>}{tab==='appearance'&&<section className="settings-section"><h3>المظهر والوصول</h3><p className="notice neutral">الدور والصلاحيات يحددهما حساب الدخول ولا يمكن رفعهما من الإعدادات.</p><h4>السمة</h4><div className="choice-row"><label><input type="radio" checked={draft.theme==='dark'} onChange={()=>setDraft({...draft,theme:'dark'})}/>داكن احترافي</label><label><input type="radio" checked={draft.theme==='light'} onChange={()=>setDraft({...draft,theme:'light'})}/>فاتح</label></div><h4>كثافة العرض</h4><div className="choice-row"><label><input type="radio" checked={draft.density==='comfortable'} onChange={()=>setDraft({...draft,density:'comfortable'})}/>مريح</label><label><input type="radio" checked={draft.density==='compact'} onChange={()=>setDraft({...draft,density:'compact'})}/>مضغوط</label></div></section>}{tab==='notifications'&&<section className="settings-section"><h3>تفضيلات الإشعارات</h3><div className="preference-list"><label><input type="checkbox" defaultChecked/>تنبيهات المتأخرات والتصعيد</label><label><input type="checkbox" defaultChecked/>تنبيهات مراجعة الدفعات</label><label><input type="checkbox" defaultChecked/>ملخص تشغيلي يومي</label></div><p className="notice neutral">هذه التفضيلات محلية داخل النموذج الأولي ولا ترسل رسائل خارجية.</p></section>}<div className="form-actions"><button className="button primary"><Save/>حفظ الإعدادات</button></div></form></div>{saved&&<Toast message="تم حفظ الإعدادات محليًا." onClose={()=>setSaved(false)}/>}</>
}

export function DemoStateBoundary({children}:{children:ReactNode}){
  const demoState=useAppStore(state=>state.demoState)
  if(demoState==='loading')return <section className="state-view" role="status"><LoaderCircle className="spinner"/><h2>جارٍ تحميل البيانات</h2><div className="skeleton-grid">{[1,2,3,4].map(item=><i key={item}/>)}</div></section>
  if(demoState==='empty')return <section className="state-view"><Building2/><h2>لا توجد بيانات في هذا العرض</h2><p>هذه حالة فارغة لاختبار الرسائل والإجراءات عندما تبدأ الأكاديمية من الصفر.</p></section>
  if(demoState==='error')return <section className="state-view error-state" role="alert"><AlertCircle/><h2>تعذر تحميل البيانات</h2><p>حالة تجريبية لاختبار ظهور الخطأ واستعادة الاستخدام.</p></section>
  return children
}

export function DemoStateSwitcher(){
  const state=useAppStore(item=>item.demoState),set=useAppStore(item=>item.setDemoState)
  useEffect(()=>{if(state!=='loading')return;const timer=setTimeout(()=>set('populated'),900);return()=>clearTimeout(timer)},[state,set])
  return <label className="demo-switcher"><span>حالة العرض</span><select value={state} onChange={event=>set(event.target.value as DemoState)}><option value="populated">بيانات مكتملة</option><option value="loading">تحميل</option><option value="empty">فارغة</option><option value="error">خطأ</option></select></label>
}
