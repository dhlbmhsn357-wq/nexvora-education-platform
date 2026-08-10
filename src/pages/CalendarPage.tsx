import { useMemo, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CalendarDays, CheckCheck, ClipboardCopy, Clock, MapPin, UserRound } from 'lucide-react'
import type { AttendanceStatus, ScheduleConflict } from '../domain/types'
import { conflictMessage } from '../domain/validation'
import { EmptyState, Metric, PageHeader, ProtectedButton, StatusBadge } from '../components/ui'
import { useAppStore } from '../store/useAppStore'
import { visibleSessions, visibleStudents } from '../domain/access'
import { can } from '../domain/permissions'

const days = [['السبت', '2026-08-08'], ['الأحد', '2026-08-09'], ['الاثنين', '2026-08-10'], ['الثلاثاء', '2026-08-11'], ['الأربعاء', '2026-08-12'], ['الخميس', '2026-08-13']]
const statuses: AttendanceStatus[] = ['حاضر', 'غائب', 'متأخر', 'بعذر']

export function CalendarPage() {
  const state=useAppStore(value=>value),role=state.role,sessions=visibleSessions({role,currentTeacherId:state.currentTeacherId,teachers:state.teachers,groups:state.groups,sessions:state.sessions,students:state.students})
  const [group, setGroup] = useState(''), [instructor, setInstructor] = useState(''), [room, setRoom] = useState('')
  const filtered = sessions.filter(session => (!group || session.group === group) && (!instructor || session.instructor === instructor) && (!room || session.room === room))
  return <>
    <PageHeader eyebrow="الجداول والحصص" title={role==='المدرس'?'جدولي الأسبوعي':'التقويم الأسبوعي'} description={role==='المدرس'?'حصصك أنت فقط حسب اليوم والمجموعة والقاعة.':'كل الجلسات حسب اليوم مع فلاتر المجموعة والمدرس والقاعة.'} />
    <section className="filter-bar"><label>المجموعة<select value={group} onChange={event => setGroup(event.target.value)}><option value="">الكل</option>{[...new Set(sessions.map(item => item.group))].map(value => <option key={value}>{value}</option>)}</select></label>{role!=='المدرس'&&<label>المدرس<select value={instructor} onChange={event => setInstructor(event.target.value)}><option value="">الكل</option>{[...new Set(sessions.map(item => item.instructor))].map(value => <option key={value}>{value}</option>)}</select></label>}<label>القاعة<select value={room} onChange={event => setRoom(event.target.value)}><option value="">الكل</option>{[...new Set(sessions.map(item => item.room))].map(value => <option key={value}>{value}</option>)}</select></label></section>
    <section className="calendar-scroll"><div className="week-grid">{days.map(([day, date]) => <section className={`week-day ${date === '2026-08-11' ? 'today' : ''}`} key={date}><header><strong>{day}</strong><small>{date.slice(-2)} أغسطس</small></header><div>{filtered.filter(session => session.date === date).map(session => <Link className={`session-card ${session.status === 'مكتملة' ? 'completed' : ''}`} key={session.id} to={`/sessions/${session.id}`}><b>{session.start}</b><strong>{session.group}</strong><small>{session.instructor}</small><small>{session.room}</small></Link>)}{!filtered.some(session => session.date === date) && <span className="day-empty">لا توجد جلسات</span>}</div></section>)}</div></section>
  </>
}

export function SessionDetailPage() {
  const { id } = useParams(), location = useLocation()
  const role=useAppStore(state=>state.role),session = useAppStore(state => state.sessions.find(item => item.id === id)), allAttendance = useAppStore(state => state.attendance), recordUse = useAppStore(state => state.recordTemplateUse)
  const attendance = allAttendance.filter(item => item.sessionId === id), [copied, setCopied] = useState(false)
  const successState = location.state as { sessionUpdated?: boolean; message?: string } | null
  if (!session) return <EmptyState title="الجلسة غير موجودة" />
  const preparedMessage = successState?.message || `موعد مجموعة ${session.group}: ${session.date} من ${session.start} إلى ${session.end} مع ${session.instructor} في ${session.room}.`
  const copyMessage = async () => { await navigator.clipboard.writeText(preparedMessage); recordUse('m4'); setCopied(true) }
  return <>
    <PageHeader eyebrow={`الجلسات / #${session.id}`} title={session.group} description={`${session.day} ${session.date} · ${session.start}–${session.end}`} action={<>{can(role,'attendance.record')&&<Link className="button secondary" to={`/attendance/${session.id}`}>تسجيل الحضور</Link>}{can(role,'schedule.edit')&&<Link className="button primary" to={`/sessions/${session.id}/edit`}>تعديل الموعد</Link>}</>} />
    {successState?.sessionUpdated && <section className="notice success session-change-success" role="status"><div><strong>تم حفظ تعديل الجلسة وتحديث التقويم والسجل.</strong><p>{preparedMessage}</p></div><button className="button secondary" onClick={copyMessage}><ClipboardCopy />{copied ? 'تم نسخ الرسالة' : 'إعداد رسالة تغيير الموعد'}</button></section>}
    <section className="metrics"><Metric label="المدرس" value={session.instructor} /><Metric label="القاعة" value={session.room} /><Metric label="الحالة" value={session.status} /><Metric label="سجلات الحضور" value={attendance.length} /></section>
    <div className="grid-two"><section className="panel"><h3>بيانات الجلسة</h3><div className="detail-list"><p><CalendarDays /> {session.day} · {session.date}</p><p><Clock /> {session.start}–{session.end}</p><p><MapPin /> {session.room}</p><p><UserRound /> {session.instructor}</p></div>{attendance.length ? <div className="attendance-summary"><strong>تم تسجيل الحضور</strong>{statuses.map(status => <span key={status}>{status}: {attendance.filter(row => row.status === status).length}</span>)}</div> : <div className="notice warning">لم يتم تسجيل الحضور بعد.</div>}</section><section className="panel"><h3>تاريخ التعديلات الكامل</h3><div className="timeline">{session.history.map(item => <article className="timeline-item" key={item.id}><strong>{item.action}</strong>{item.reason && <p>السبب: {item.reason}</p>}{item.before && <p><del>{item.before}</del><br /><ins>{item.after}</ins></p>}<small>{item.user} · {item.at}</small></article>)}</div></section></div>
  </>
}

export function SessionEditPage() {
  const { id } = useParams(), navigate = useNavigate()
  const session = useAppStore(state => state.sessions.find(item => item.id === id)), sessions = useAppStore(state => state.sessions), update = useAppStore(state => state.updateSession)
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]), [error, setError] = useState(''), [reason, setReason] = useState('')
  if (!session) return <EmptyState title="الجلسة غير موجودة" />
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setConflicts([])
    const data = new FormData(event.currentTarget), date = String(data.get('date'))
    const result = update(session.id, { date, day: days.find(item => item[1] === date)?.[0] || new Intl.DateTimeFormat('ar-EG', { weekday: 'long' }).format(new Date(date)), start: String(data.get('start')), end: String(data.get('end')), room: String(data.get('room')), instructor: String(data.get('instructor')), reason: String(data.get('reason')), customReason: String(data.get('customReason') || '') })
    if (!result.ok) {
      const found = result.meta?.conflicts as ScheduleConflict[] | undefined
      if (found?.length) setConflicts(found); else setError(result.message)
      return
    }
    navigate(`/sessions/${session.id}`, { state: { sessionUpdated: true, message: result.value.message } })
  }
  const startOptions = ['4:00 م', '4:30 م', '5:00 م', '5:30 م', '6:00 م', '6:30 م', '7:00 م']
  const endOptions = ['5:00 م', '5:30 م', '6:00 م', '6:30 م', '7:00 م', '7:30 م', '8:00 م', '8:30 م']
  return <><PageHeader eyebrow="الجلسات / تعديل" title={`تعديل ${session.group}`} description="يتم فحص تعارض المدرس والقاعة والمجموعة مع أي تداخل زمني قبل الحفظ." /><form className="flow-card" onSubmit={submit}>{error && <div className="notice danger" role="alert"><strong>لا يمكن الحفظ</strong><p>{error}</p></div>}{conflicts.length > 0 && <div className="conflict-list" role="alert"><strong>تم اكتشاف {conflicts.length} تعارض يمنع الحفظ</strong>{conflicts.map((conflict, index) => <article key={`${conflict.type}-${conflict.session.id}-${index}`}><StatusBadge tone="danger">{conflict.type === 'teacher' ? 'تعارض مدرس' : conflict.type === 'room' ? 'تعارض قاعة' : 'تعارض مجموعة'}</StatusBadge><p>{conflictMessage(conflict)}</p></article>)}</div>}<div className="form-grid"><label className="field full"><span>المجموعة</span><input value={session.group} disabled /></label><label className="field"><span>التاريخ</span><input name="date" type="date" defaultValue={session.date} required /></label><label className="field"><span>وقت البداية</span><select name="start" defaultValue={session.start}>{startOptions.map(value => <option key={value}>{value}</option>)}</select></label><label className="field"><span>وقت النهاية</span><select name="end" defaultValue={session.end}>{endOptions.map(value => <option key={value}>{value}</option>)}</select></label><label className="field"><span>المدرس</span><select name="instructor" defaultValue={session.instructor}>{[...new Set(sessions.map(item => item.instructor))].map(value => <option key={value}>{value}</option>)}</select></label><label className="field"><span>القاعة</span><select name="room" defaultValue={session.room}>{['قاعة 1', 'قاعة 2', 'قاعة 3', 'قاعة 4', 'قاعة 5'].map(value => <option key={value}>{value}</option>)}</select></label><label className="field"><span>سبب التعديل</span><select name="reason" value={reason} onChange={event => setReason(event.target.value)}><option value="">اختر السبب</option><option>طلب المدرس</option><option>طلب الإدارة</option><option>تعارض سابق</option><option>تغيير القاعة</option><option>سبب آخر</option></select></label>{reason === 'سبب آخر' && <label className="field full"><span>اكتب السبب</span><textarea name="customReason" placeholder="سبب واضح يظهر في تاريخ التعديل" /></label>}</div><div className="form-actions"><button type="button" className="button secondary" onClick={() => navigate(-1)}>إلغاء</button><ProtectedButton permission="schedule.edit" className="button primary">فحص التعارض وحفظ التعديل</ProtectedButton></div></form></>
}

export function AttendancePage() {
  const { sessionId } = useParams()
  const state=useAppStore(value=>value),context={role:state.role,currentTeacherId:state.currentTeacherId,teachers:state.teachers,groups:state.groups,sessions:state.sessions,students:state.students},sessions=visibleSessions(context),students=visibleStudents(context),existingAttendance=state.attendance,save=state.saveAttendance
  const navigate = useNavigate(), session = sessions.find(item => item.id === (sessionId || sessions[0]?.id)), groupStudents = students.filter(student => student.group === session?.group)
  const previous = existingAttendance.filter(item => item.sessionId === session?.id)
  const [rows, setRows] = useState<Record<string, { status: AttendanceStatus; note: string }>>(() => Object.fromEntries(groupStudents.map(student => { const saved = previous.find(item => item.studentId === student.id); return [student.id, { status: saved?.status || 'حاضر', note: saved?.note || '' }] })))
  const [review, setReview] = useState(false), [error, setError] = useState('')
  if (!session) return <EmptyState title="لا توجد جلسة متاحة" />
  const counts = useMemo(() => Object.values(rows).reduce<Record<string, number>>((acc, row) => (acc[row.status] = (acc[row.status] || 0) + 1, acc), {}), [rows])
  const setAllPresent = () => setRows(current => Object.fromEntries(Object.entries(current).map(([id, row]) => [id, { ...row, status: 'حاضر' }])))
  const reviewAttendance = () => { if (!groupStudents.length || Object.keys(rows).length !== groupStudents.length) { setError('يجب تحديد حالة لكل طالب قبل المراجعة.'); return } setError(''); setReview(true) }
  const confirm = () => { const result = save(session.id, Object.entries(rows).map(([studentId, row]) => ({ studentId, ...row }))); if (!result.ok) { setError(result.message); setReview(false); return } navigate(`/sessions/${session.id}`) }
  return <><PageHeader eyebrow="الحضور" title={`حضور ${session.group}`} description={`${session.day} ${session.date} · ${session.start} · ${session.room}`} action={!review ? <button className="button secondary" onClick={setAllPresent}><CheckCheck />تحديد الجميع حاضر</button> : undefined} /><section className="metrics attendance-metrics">{statuses.map(status => <Metric key={status} label={status} value={counts[status] || 0} />)}</section>{error && <p className="field-error" role="alert">{error}</p>}{review ? <section className="panel attendance-confirm" role="dialog" aria-labelledby="attendance-confirm-title"><h3 id="attendance-confirm-title">مراجعة الحضور قبل الحفظ</h3><p>راجع الملخص؛ لن يتم الحفظ إلا بعد التأكيد الصريح.</p><div className="confirmation-counts">{statuses.map(status => <div key={status}><span>{status}</span><strong>{counts[status] || 0}</strong></div>)}</div><div className="form-actions"><button className="button secondary" onClick={() => setReview(false)}>العودة للتعديل</button><ProtectedButton permission="attendance.record" className="button primary" onClick={confirm}>تأكيد وحفظ الحضور</ProtectedButton></div></section> : <section className="panel">{groupStudents.map(student => <article className="attendance-row" key={student.id}><div><strong>{student.name}</strong><small>{student.code}</small></div><select aria-label={`حالة حضور ${student.name}`} value={rows[student.id]?.status || 'حاضر'} onChange={event => setRows(current => ({ ...current, [student.id]: { ...current[student.id], status: event.target.value as AttendanceStatus } }))}>{statuses.map(status => <option key={status}>{status}</option>)}</select><input aria-label={`ملاحظة حضور ${student.name}`} placeholder="ملاحظة اختيارية" value={rows[student.id]?.note || ''} onChange={event => setRows(current => ({ ...current, [student.id]: { ...current[student.id], note: event.target.value } }))} /></article>)}{!groupStudents.length && <EmptyState title="لا يوجد طلاب مرتبطون بهذه الجلسة" description="راجع مجموعة الجلسة قبل تسجيل الحضور." />}<div className="form-actions"><Link className="button secondary" to={`/sessions/${session.id}`}>إلغاء</Link><ProtectedButton permission="attendance.record" className="button primary" onClick={reviewAttendance}>مراجعة الملخص</ProtectedButton></div></section>}</>
}
