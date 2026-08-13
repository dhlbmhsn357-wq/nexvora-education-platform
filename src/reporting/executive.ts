import type { ExecutiveDecision, ExecutiveRisk, LedgerEntry, PaymentSubmission, Student } from '../domain/types'
import { buildReport, getAttendanceRate, type ReportingRange, type ReportingSource } from './selectors'

export type ExecutiveSource=ReportingSource&{ledger:LedgerEntry[];executiveDecisions:ExecutiveDecision[]}

const iso=(date:Date)=>date.toISOString().slice(0,10)
export const previousRange=(range:ReportingRange):ReportingRange=>{const from=new Date(`${range.from}T12:00:00`),to=new Date(`${range.to}T12:00:00`),days=Math.round((to.getTime()-from.getTime())/86400000)+1,previousTo=new Date(from);previousTo.setDate(previousTo.getDate()-1);const previousFrom=new Date(previousTo);previousFrom.setDate(previousFrom.getDate()-days+1);return{from:iso(previousFrom),to:iso(previousTo),label:'الفترة السابقة'}}
const inRange=(date:string,range:ReportingRange)=>date>=range.from&&date<=range.to
const signed=(current:number,previous:number,unit='')=>previous===0?(current===0?'لا تغير':'بدأ القياس في هذه الفترة'):`${current>=previous?'↑':'↓'} ${Math.abs(Math.round((current-previous)/previous*100))}%${unit}`
const dueDays=(student:Student)=>{const value=student.due.match(/(\d+)/)?.[1];return student.due.includes('منذ')?Number(value||1):0}

export function ledgerConsistency(students:Student[],ledger:LedgerEntry[],payments:PaymentSubmission[]){
  const issues:string[]=[]
  for(const student of students){const total=ledger.filter(item=>item.studentId===student.id&&item.status==='معتمدة').reduce((sum,item)=>sum+(item.type==='إلغاء'?-item.amount:item.amount),0);if(total!==student.paid)issues.push(`${student.name}: الرصيد ${student.paid} ج مقابل دفتر الحركات ${total} ج`)}
  for(const payment of payments.filter(item=>item.status==='معتمدة'))if(!ledger.some(item=>item.paymentId===payment.id))issues.push(`${payment.id}: دفعة معتمدة بلا حركة دفتر`)
  const refs=new Set<string>();for(const payment of payments){const ref=payment.reference.trim().toLowerCase();if(refs.has(ref))issues.push(`${payment.reference}: مرجع مالي مكرر`);refs.add(ref)}
  return issues
}

export function agingBuckets(students:Student[]){const overdue=students.filter(item=>item.total>item.paid&&dueDays(item)>0),total=overdue.reduce((sum,item)=>sum+item.total-item.paid,0);return[
  {id:'1-7',label:'1–7 أيام',students:overdue.filter(item=>dueDays(item)<=7)},
  {id:'8-14',label:'8–14 يومًا',students:overdue.filter(item=>dueDays(item)>=8&&dueDays(item)<=14)},
  {id:'15-30',label:'15–30 يومًا',students:overdue.filter(item=>dueDays(item)>=15&&dueDays(item)<=30)},
  {id:'30+',label:'أكثر من 30 يومًا',students:overdue.filter(item=>dueDays(item)>30)},
].map(bucket=>{const amount=bucket.students.reduce((sum,item)=>sum+item.total-item.paid,0);return{...bucket,count:bucket.students.length,amount,share:total?Math.round(amount/total*100):0}})}

export function executiveRisks(source:ExecutiveSource):ExecutiveRisk[]{
  const current=buildReport(source,{from:'2026-08-01',to:'2026-08-31',label:'هذا الشهر'}),issues=ledgerConsistency(source.students,source.ledger,source.payments),risks:ExecutiveRisk[]=[]
  if(issues.length)risks.push({id:'data-integrity',category:'بيانات وحوكمة',severity:'حرجة',title:'عدم اتساق في الرصيد المالي',reason:issues[0],value:`${issues.length} استثناء`,detectedAt:'11 أغسطس 2026',owner:'المراجع المالي',status:'جديد',action:'مراجعة دفتر الحركات',route:'/ledger?filter=issues'})
  if(current.finance.overdue)risks.push({id:'overdue',category:'مالية',severity:current.finance.overdue>=1500?'مرتفعة':'متوسطة',title:'مبالغ متأخرة تحتاج تحصيلًا',reason:'تجاوزت مواعيد الاستحقاق المسجلة.',value:`${current.finance.overdue.toLocaleString('ar-EG')} ج`,detectedAt:'11 أغسطس 2026',owner:'موظف المتابعة',status:'قيد المراجعة',action:'مراجعة أعمار الديون',route:'/overdue'})
  if(current.missingAttendance.length)risks.push({id:'attendance',category:'تعليمية',severity:'مرتفعة',title:'حصص بلا تسجيل حضور',reason:'لا يمكن قياس انتظام الطلاب قبل إغلاق سجلات الحضور.',value:`${current.missingAttendance.length} حصة`,detectedAt:'11 أغسطس 2026',owner:'مدير التشغيل',status:'جديد',action:'استكمال الحضور',route:'/attendance'})
  if(current.fullGroups.length)risks.push({id:'capacity',category:'تشغيلية',severity:'متوسطة',title:'مجموعات مكتملة السعة',reason:'قد يتعذر إلحاق طلاب جدد دون نقل أو توسعة.',value:`${current.fullGroups.length} مجموعة`,detectedAt:'11 أغسطس 2026',owner:'مدير التشغيل',status:'قيد المراجعة',action:'مراجعة السعة',route:'/groups'})
  if(current.teacherMetrics.withoutUpcoming)risks.push({id:'teacher-load',category:'تشغيلية',severity:'متوسطة',title:'مدرسون نشطون بلا حصص قادمة',reason:'حسابات نشطة دون استخدام تشغيلي قريب.',value:`${current.teacherMetrics.withoutUpcoming} مدرس`,detectedAt:'11 أغسطس 2026',owner:'مدير التشغيل',status:'جديد',action:'مراجعة الإسناد',route:'/teachers?alert=no-sessions'})
  return risks
}

export function buildExecutiveSnapshot(source:ExecutiveSource,range:ReportingRange){
  const previous=previousRange(range),currentReport=buildReport(source,range),previousReport=buildReport(source,previous)
  const currentCollected=source.ledger.filter(item=>item.type==='دفعة معتمدة'&&item.status==='معتمدة'&&inRange(item.date,range)).reduce((sum,item)=>sum+item.amount,0),previousCollected=source.ledger.filter(item=>item.type==='دفعة معتمدة'&&item.status==='معتمدة'&&inRange(item.date,previous)).reduce((sum,item)=>sum+item.amount,0)
  const currentActive=source.students.filter(item=>item.status==='نشط'&&(!item.joinedAt||item.joinedAt<=range.to)).length,previousActive=source.students.filter(item=>item.status==='نشط'&&(!item.joinedAt||item.joinedAt<=previous.to)).length
  const currentAttendance=getAttendanceRate(currentReport.attendance)??0,previousAttendance=getAttendanceRate(previousReport.attendance)??0
  const execution=currentReport.sessionMetrics.total?Math.round(currentReport.sessionMetrics.completed/currentReport.sessionMetrics.total*100):0,previousExecution=previousReport.sessionMetrics.total?Math.round(previousReport.sessionMetrics.completed/previousReport.sessionMetrics.total*100):0
  const risks=executiveRisks(source),decisions=source.executiveDecisions.filter(item=>item.status==='بانتظار الاعتماد'),aging=agingBuckets(source.students)
  const kpis=[
    {id:'collection',label:'التحصيل خلال الفترة',value:`${currentCollected.toLocaleString('ar-EG')} ج`,previous:`${previousCollected.toLocaleString('ar-EG')} ج`,change:signed(currentCollected,previousCollected),tone:currentCollected>=previousCollected?'good':'warning',route:'/ledger'},
    {id:'outstanding',label:'إجمالي المبالغ المستحقة',value:`${currentReport.finance.outstanding.toLocaleString('ar-EG')} ج`,previous:'رصيد حالي',change:'لقطة حالية موثقة',tone:currentReport.finance.outstanding>2500?'warning':'good',route:'/payments'},
    {id:'overdue',label:'إجمالي المتأخرات',value:`${currentReport.finance.overdue.toLocaleString('ar-EG')} ج`,previous:`${currentReport.finance.overdueStudents} طلاب`,change:aging.find(item=>item.id==='8-14')?.amount? 'توجد ديون 8–14 يومًا':'ضمن المتابعة',tone:currentReport.finance.overdue?'danger':'good',route:'/overdue'},
    {id:'students',label:'الطلاب النشطون',value:String(currentActive),previous:String(previousActive),change:`صافي ${currentActive-previousActive>=0?'+':''}${currentActive-previousActive}`,tone:currentActive>=previousActive?'good':'warning',route:'/students'},
    {id:'attendance',label:'نسبة الحضور',value:currentReport.attendanceMetrics.records?`${currentAttendance}%`:'لا توجد بيانات',previous:previousReport.attendanceMetrics.records?`${previousAttendance}%`:'لا توجد بيانات',change:currentReport.attendanceMetrics.records?signed(currentAttendance,previousAttendance):'لا توجد بيانات مقارنة',tone:currentAttendance>=85?'good':currentReport.attendanceMetrics.records?'warning':'neutral',route:'/reports?type=attendance'},
    {id:'sessions',label:'تنفيذ الحصص',value:currentReport.sessionMetrics.total?`${execution}%`:'لا توجد بيانات',previous:previousReport.sessionMetrics.total?`${previousExecution}%`:'لا توجد بيانات',change:currentReport.sessionMetrics.total?signed(execution,previousExecution):'لا توجد بيانات مقارنة',tone:execution>=80?'good':currentReport.sessionMetrics.total?'warning':'neutral',route:'/calendar'},
    {id:'occupancy',label:'متوسط إشغال المجموعات',value:currentReport.groups.occupancy==null?'لا توجد بيانات':`${currentReport.groups.occupancy}%`,previous:'لا يوجد سجل تاريخي',change:'لقطة تشغيلية حالية',tone:(currentReport.groups.occupancy||0)>=70?'good':'warning',route:'/groups'},
    {id:'risks',label:'المخاطر المفتوحة',value:String(risks.filter(item=>item.status!=='مغلق').length),previous:`${decisions.length} قرار`,change:risks.some(item=>item.severity==='حرجة')?'توجد مخاطرة حرجة':'لا توجد مخاطر حرجة',tone:risks.some(item=>item.severity==='حرجة')?'danger':'warning',route:'/risks'},
  ]
  const insights=[currentCollected?`تم تحصيل ${currentCollected.toLocaleString('ar-EG')} ج واعتمادها خلال ${range.label}.`:'لم تسجل دفعات معتمدة خلال الفترة.',currentReport.finance.overdue?`توجد متأخرات بقيمة ${currentReport.finance.overdue.toLocaleString('ar-EG')} ج موزعة على ${currentReport.finance.overdueStudents} طلاب.`:'لا توجد متأخرات حالية.',currentReport.teacherMetrics.withoutUpcoming?`${currentReport.teacherMetrics.withoutUpcoming} مدرس نشط بلا حصص قادمة ويحتاج مراجعة إسناد.`:'كل المدرسين النشطين لديهم تشغيل قادم.']
  return{range,previous,currentReport,previousReport,kpis,risks,decisions,aging,insights,ledgerIssues:ledgerConsistency(source.students,source.ledger,source.payments)}
}
