import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'

const root=new URL('../',import.meta.url)
const read=path=>readFile(new URL(path,root),'utf8')
const walk=async dir=>{const base=new URL(dir,root),entries=await readdir(base,{withFileTypes:true});const files=[];for(const entry of entries){const rel=`${dir}${entry.name}`;if(entry.isDirectory())files.push(...await walk(`${rel}/`));else files.push(rel)}return files}
const [app,shell,sidebar,base,tokens,polish,system,permissions,dialog]=await Promise.all([read('src/App.tsx'),read('src/components/AppShell.tsx'),read('src/components/layout/Sidebar.tsx'),read('src/styles/design-system.css'),read('src/styles/tokens.css'),read('src/final-polish.css'),read('src/pages/SystemPage.tsx'),read('src/domain/permissions.ts'),read('src/components/ui/ConfirmDialog.tsx')])
const sourceFiles=(await walk('src/')).filter(file=>/\.(tsx?|css)$/.test(file))
const source=(await Promise.all(sourceFiles.map(read))).join('\n')
const checks=[]
const check=(name,value)=>{assert.ok(value,name);checks.push(name)}

check('semantic design tokens exist',tokens.includes('--color-bg:#0b1120')&&tokens.includes('--color-primary:#0d9488'))
check('single Arabic font system is applied',base.includes("IBM Plex Sans Arabic")&&base.includes('body,button,input,select,textarea,h1,h2,h3,strong,.brand{font-family:inherit}'))
check('explicit operations route exists',app.includes('path="/operations"')&&sidebar.includes("to:'/operations'"))
check('CEO routes are permission protected',['risk.view','decision.view','ledger.view','summary.view'].every(item=>app.includes(`permission="${item}"`)))
check('all five roles exist in login and permissions',['المدير العام','مدير التشغيل','موظف المتابعة','المدرس','المحاسب'].every(role=>system.includes(role)&&permissions.includes(role)))
check('skip link and Arabic landmarks exist',shell.includes('skip-link')&&sidebar.includes('aria-label="التنقل الرئيسي"'))
check('focus is never silently removed',base.includes(':focus-visible')&&base.includes('outline:2px solid'))
check('reduced motion is supported',`${base}${polish}`.includes('prefers-reduced-motion:reduce'))
check('mobile and tablet breakpoints exist',base.includes('@media(max-width:1023px)')&&base.includes('@media(max-width:650px)'))
check('touch targets are at least 44px',source.includes('min-height:44px'))
check('responsive tables expose mobile labels',source.includes('data-label='))
check('dialogs expose alertdialog semantics',dialog.includes('role="alertdialog"')&&dialog.includes('aria-modal="true"'))
check('no corrupted Arabic mojibake remains',!/ط§|ظ„|ط±|ظ…/.test(source))
check('no structural emoji icons are used',!/[🚀🎨⚙️✅❌🔔📊📁💰]/u.test(source))
check('no React inline styles remain',!source.includes('style={{'))
check('required UI primitives are separated',['Button','Input','Select','StatusBadge','ExecutiveKpi','MetricCard','DataTable','MobileCard','Timeline','PageHeader','FilterBar','ConfirmDialog','Toast','EmptyState','Skeleton'].every(name=>sourceFiles.includes(`src/components/ui/${name}.tsx`)))
const docs=await Promise.all(['AUDIT.md','DESIGN_SYSTEM.md','COMPONENTS.md','SCREEN_MAP.md','BEFORE_AFTER.md','KNOWN_LIMITATIONS.md'].map(async file=>{try{await read(file);return true}catch{return false}}))
check('design system deliverables exist',docs.every(Boolean))

console.log(JSON.stringify({status:'PASS',tests:checks.length,checks},null,2))
