import type { AttendanceRecord, AuditEvent, Followup, Group, PaymentSubmission, Session, Student, Teacher } from '../domain/types'

export const PROTOTYPE_TODAY = '2026-08-11'
export type ReportingRange = { from: string; to: string; label: string }
export type ReportingSource = { students: Student[]; teachers: Teacher[]; groups: Group[]; sessions: Session[]; attendance: AttendanceRecord[]; payments: PaymentSubmission[]; followups: Followup[]; audit: AuditEvent[] }

const inRange = (date:string, range:ReportingRange) => date >= range.from && date <= range.to
export const getAttendanceRate = (records:AttendanceRecord[]) => records.length ? Math.round(records.filter(item=>item.status==='حاضر'||item.status==='متأخر').length/records.length*100) : null
export const getOverdueStudents = (students:Student[]) => students.filter(item=>item.total>item.paid && item.due.startsWith('منذ'))
export const getOutstandingStudents = (students:Student[]) => students.filter(item=>item.total>item.paid)

export function buildReport(source:ReportingSource,range:ReportingRange){
  const sessions=source.sessions.filter(item=>inRange(item.date,range)), sessionIds=new Set(sessions.map(item=>item.id))
  const attendance=source.attendance.filter(item=>sessionIds.has(item.sessionId)), payments=source.payments.filter(item=>inRange(item.paymentDate,range))
  const approved=payments.filter(item=>item.status==='معتمدة'),pending=payments.filter(item=>item.status==='بانتظار المراجعة'),rejected=payments.filter(item=>item.status==='مرفوضة')
  const overdue=getOverdueStudents(source.students),outstanding=getOutstandingStudents(source.students),unassigned=source.students.filter(item=>!item.group)
  const fullGroups=source.groups.filter(item=>item.enrolled>=item.capacity),nearGroups=source.groups.filter(item=>item.capacity>0&&item.enrolled<item.capacity&&item.enrolled/item.capacity>=.8)
  const teachers=source.teachers.map(teacher=>{const teacherSessions=sessions.filter(item=>item.instructor===teacher.name),teacherGroups=source.groups.filter(item=>item.instructor===teacher.name);return{...teacher,sessionCount:teacherSessions.length,groupCount:teacherGroups.length,rooms:[...new Set(teacherSessions.map(item=>item.room))],nextSession:source.sessions.filter(item=>item.instructor===teacher.name&&item.date>=PROTOTYPE_TODAY&&item.status!=='ملغاة').sort((a,b)=>`${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`))[0]}})
  const attendanceSessionIds=new Set(attendance.map(item=>item.sessionId)),missingAttendance=sessions.filter(item=>item.date<=PROTOTYPE_TODAY&&item.status!=='ملغاة'&&!attendanceSessionIds.has(item.id))
  const occupancy=source.groups.length?Math.round(source.groups.reduce((sum,item)=>sum+(item.capacity?item.enrolled/item.capacity:0),0)/source.groups.length*100):null
  return{
    range,sessions,attendance,payments,approved,pending,rejected,overdue,outstanding,unassigned,fullGroups,nearGroups,teachers,missingAttendance,
    students:{total:source.students.length,active:source.students.filter(item=>item.status==='نشط').length,unassigned:unassigned.length},
    groups:{total:source.groups.length,full:fullGroups.length,near:nearGroups.length,occupancy},
    sessionMetrics:{total:sessions.length,completed:sessions.filter(item=>item.status==='مكتملة').length,upcoming:sessions.filter(item=>item.status==='قادمة'||item.status==='اليوم').length,attendanceComplete:sessions.filter(item=>attendanceSessionIds.has(item.id)).length,attendanceMissing:missingAttendance.length},
    attendanceMetrics:{records:attendance.length,rate:getAttendanceRate(attendance),present:attendance.filter(item=>item.status==='حاضر').length,late:attendance.filter(item=>item.status==='متأخر').length,absent:attendance.filter(item=>item.status==='غائب').length,excused:attendance.filter(item=>item.status==='بعذر').length},
    paymentMetrics:{submitted:payments.length,pending:pending.length,approved:approved.length,rejected:rejected.length,collected:approved.reduce((sum,item)=>sum+item.amount,0)},
    finance:{outstanding:outstanding.reduce((sum,item)=>sum+item.total-item.paid,0),overdue:overdue.reduce((sum,item)=>sum+item.total-item.paid,0),overdueStudents:overdue.length,escalated:new Set(source.followups.filter(item=>item.escalated).map(item=>item.studentId)).size},
    followupMetrics:{total:source.followups.filter(item=>inRange(item.date,range)).length,escalated:source.followups.filter(item=>item.escalated&&inRange(item.date,range)).length},
    teacherMetrics:{active:source.teachers.filter(item=>item.status==='نشط').length,working:new Set(sessions.map(item=>item.instructor)).size,withoutGroups:teachers.filter(item=>item.status==='نشط'&&!item.groupCount).length,withoutUpcoming:teachers.filter(item=>item.status==='نشط'&&!item.nextSession).length},
  }
}

export type OperationalAlert={id:string;tone:'danger'|'warning'|'info';title:string;description:string;count:number;route:string;action:string}
export function getOperationalAlerts(source:ReportingSource):OperationalAlert[]{
  const report=buildReport(source,{from:PROTOTYPE_TODAY,to:PROTOTYPE_TODAY,label:'اليوم'}), alerts:OperationalAlert[]=[]
  if(report.unassigned.length)alerts.push({id:'unassigned',tone:'warning',title:'طلاب ينتظرون الإلحاق بمجموعة',description:'لديهم ملفات مسجلة دون إسناد حالي إلى مجموعة.',count:report.unassigned.length,route:'/students?assignment=unassigned',action:'مراجعة الطلاب'})
  const escalated=new Set(source.followups.filter(item=>item.escalated).map(item=>item.studentId)).size
  if(escalated)alerts.push({id:'escalated',tone:'danger',title:'حالات سداد مصعّدة تحتاج قرارًا',description:'تم تصعيدها إلى مدير التشغيل لمراجعة الإجراء التالي.',count:escalated,route:'/overdue?risk=escalated',action:'عرض الحالات'})
  if(report.missingAttendance.length)alerts.push({id:'attendance',tone:'warning',title:'حصص لم يُسجّل حضورها',description:'حصص اليوم أو الحصص المكتملة التي ما زالت بلا سجل حضور.',count:report.missingAttendance.length,route:'/attendance',action:'مراجعة الحصص'})
  const allPending=source.payments.filter(item=>item.status==='بانتظار المراجعة')
  if(allPending.length)alerts.push({id:'payments',tone:'info',title:'دفعات تنتظر المراجعة',description:'دفعات مسجلة لم يعتمدها المحاسب بعد ولا تدخل ضمن التحصيل.',count:allPending.length,route:'/payments/review',action:'فتح المراجعة'})
  if(report.fullGroups.length)alerts.push({id:'capacity',tone:'warning',title:'مجموعات وصلت إلى السعة القصوى',description:'لا يمكن إسناد طلاب جدد إليها قبل زيادة السعة أو النقل.',count:report.fullGroups.length,route:'/groups',action:'عرض المجموعات'})
  if(report.teacherMetrics.withoutUpcoming)alerts.push({id:'teachers',tone:'info',title:'مدرسون نشطون بلا حصص قادمة',description:'راجع إسناد المجموعات والجدول للمدرسين النشطين.',count:report.teacherMetrics.withoutUpcoming,route:'/teachers?alert=no-sessions',action:'مراجعة المدرسين'})
  return alerts
}
