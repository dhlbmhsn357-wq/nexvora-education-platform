import assert from 'node:assert/strict'
import { createServer } from 'vite'

const memoryStorage = new Map()
globalThis.localStorage = {
  getItem: key => memoryStorage.get(key) ?? null,
  setItem: (key, value) => memoryStorage.set(key, value),
  removeItem: key => memoryStorage.delete(key),
  clear: () => memoryStorage.clear(),
  key: index => [...memoryStorage.keys()][index] ?? null,
  get length() { return memoryStorage.size },
}

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })

try {
  const { useAppStore } = await server.ssrLoadModule('/src/store/useAppStore.ts')
  const { findScheduleConflicts } = await server.ssrLoadModule('/src/domain/validation.ts')
  const { buildReport, getOperationalAlerts } = await server.ssrLoadModule('/src/reporting/selectors.ts')
  const { visibleGroups, visibleSessions, visibleStudents } = await server.ssrLoadModule('/src/domain/access.ts')
  const { can } = await server.ssrLoadModule('/src/domain/permissions.ts')
  const results = []
  const check = (name, condition) => { assert.ok(condition, name); results.push({ name, status: 'PASS' }) }

  useAppStore.getState().reset()
  let result = useAppStore.getState().addStudent({ name: 'مكرر', phone: '01012345678', guardian: '', group: 'تأسيس A', course: 'اللغة العربية', packageName: 'شهرية · 8 حصص', paid: 0, total: 1200, due: 'بانتظار السداد' })
  check('duplicate student blocked in store', !result.ok && result.code === 'duplicate_student')

  result = useAppStore.getState().addStudent({ name: 'آخر مقعد', phone: '01590000001', guardian: '', group: 'تأسيس A', course: 'اللغة العربية', packageName: 'شهرية · 8 حصص', paid: 0, total: 1200, due: 'بانتظار السداد' })
  check('14/15 accepts one student', result.ok && useAppStore.getState().groups.find(group => group.id === 'g1')?.enrolled === 15)

  result = useAppStore.getState().addStudent({ name: 'بعد الاكتمال', phone: '01590000002', guardian: '', group: 'تأسيس A', course: 'اللغة العربية', packageName: 'شهرية · 8 حصص', paid: 0, total: 1200, due: 'بانتظار السداد' })
  check('15/15 rejects another student', !result.ok && result.code === 'group_full')

  result = useAppStore.getState().updateStudent('s2', { group: 'تأسيس A' })
  check('moving existing student into full group blocked', !result.ok && result.code === 'group_full' && useAppStore.getState().students.find(student => student.id === 's2')?.group === 'المستوى الأول A')

  useAppStore.getState().reset()
  const sessions = useAppStore.getState().sessions, x1 = sessions.find(session => session.id === 'x1')
  assert.ok(x1)
  const teacher = findScheduleConflicts(sessions, { ...x1, start: '5:30 م', end: '7:00 م', instructor: 'سارة حسن', room: 'قاعة 5' })
  const room = findScheduleConflicts(sessions, { ...x1, start: '5:30 م', end: '7:00 م', instructor: 'أحمد مصطفى', room: 'قاعة 2' })
  const group = findScheduleConflicts(sessions, { ...x1, date: '2026-08-12', start: '6:00 م', end: '6:30 م', instructor: 'أحمد مصطفى', room: 'قاعة 1' })
  check('overlapping teacher conflict detected', teacher.some(conflict => conflict.type === 'teacher'))
  check('overlapping room conflict detected', room.some(conflict => conflict.type === 'room'))
  check('overlapping group conflict detected', group.some(conflict => conflict.type === 'group'))

  result = useAppStore.getState().saveAttendance('x1', [])
  check('incomplete attendance rejected in store', !result.ok && result.code === 'invalid_attendance')

  const paidBefore = useAppStore.getState().students.find(student => student.id === 's1')?.paid
  result = useAppStore.getState().reviewPayment('REV-2026-014', 'reject', '')
  check('payment rejection without reason blocked in store', !result.ok && result.code === 'rejection_reason_required' && useAppStore.getState().students.find(student => student.id === 's1')?.paid === paidBefore)

  useAppStore.getState().setRole('المدرس')
  result = useAppStore.getState().reviewPayment('REV-2026-014', 'approve', '')
  check('teacher cannot approve payments', !result.ok && result.code === 'permission_denied')
  useAppStore.getState().setRole('المحاسب')
  result = useAppStore.getState().addStudent({ name: 'غير مسموح', phone: '01590000003', guardian: '', group: 'المستوى الأول A', course: 'اللغة العربية', packageName: 'شهرية · 8 حصص', paid: 0, total: 1200, due: 'بانتظار السداد' })
  check('accountant cannot add students', !result.ok && result.code === 'permission_denied')
  useAppStore.getState().setRole('موظف المتابعة')
  result = useAppStore.getState().reviewPayment('REV-2026-014', 'approve', '')
  check('follow-up officer cannot approve payments', !result.ok && result.code === 'permission_denied')

  useAppStore.getState().reset()
  const enrolledBefore = useAppStore.getState().groups.reduce((sum, item) => sum + item.enrolled, 0)
  result = useAppStore.getState().addStudent({ name: 'بانتظار مجموعة', phone: '01590000004', guardian: '', group: '', course: 'اللغة العربية', packageName: 'شهرية · 8 حصص', paid: 0, total: 1200, due: 'موعد السداد 20 أغسطس' })
  check('student can be created without group assignment', result.ok && useAppStore.getState().groups.reduce((sum, item) => sum + item.enrolled, 0) === enrolledBefore)
  const source = useAppStore.getState()
  check('unassigned student creates operational alert', getOperationalAlerts(source).some(alert => alert.id === 'unassigned' && alert.count >= 1))

  result = useAppStore.getState().addTeacher({ name: 'مدرس مكرر', phone: '01070001111', specialty: 'العربية', status: 'نشط', availability: [], createdAt: '', updatedAt: '' })
  check('duplicate teacher phone blocked in store', !result.ok && result.code === 'duplicate_teacher')
  result = useAppStore.getState().saveTeacherAvailability('t1', [{ id: 'a', day: 'الثلاثاء', start: '4:00 م', end: '7:00 م' }, { id: 'b', day: 'الثلاثاء', start: '6:00 م', end: '8:00 م' }])
  check('overlapping availability blocks rejected', !result.ok && result.code === 'invalid_availability')
  result = useAppStore.getState().addSession({ group: 'تأسيس A', instructor: 'أحمد مصطفى', room: 'قاعة 5', date: '2026-08-12', day: 'الأربعاء', start: '5:00 م', end: '6:00 م' })
  check('session outside configured availability rejected', !result.ok && result.code === 'outside_availability')
  result = useAppStore.getState().updateTeacher('t1', { status: 'غير نشط' })
  check('teacher with future sessions cannot be silently deactivated', !result.ok && result.code === 'teacher_inactive')
  result = useAppStore.getState().updateTeacher('t1', { name: 'أحمد مصطفى المعدل' })
  check('teacher rename updates groups and sessions consistently', result.ok && useAppStore.getState().groups.some(group => group.instructor === 'أحمد مصطفى المعدل') && useAppStore.getState().sessions.some(session => session.instructor === 'أحمد مصطفى المعدل'))
  const report = buildReport(useAppStore.getState(), { from: '2026-08-01', to: '2026-08-31', label: 'أغسطس' })
  check('report counts only approved payments as collected', report.paymentMetrics.collected === 0 && report.paymentMetrics.pending === 2)

  useAppStore.getState().reset()
  useAppStore.getState().login('المدرس', 't3')
  const teacherState = useAppStore.getState()
  const teacherContext = { role: teacherState.role, currentTeacherId: teacherState.currentTeacherId, teachers: teacherState.teachers, groups: teacherState.groups, sessions: teacherState.sessions, students: teacherState.students }
  check('teacher login is bound to a specific teacher account', teacherState.currentTeacherId === 't3')
  check('teacher sees only assigned groups', visibleGroups(teacherContext).every(item => item.instructor === 'سارة حسن') && visibleGroups(teacherContext).length === 1)
  check('teacher sees only own sessions', visibleSessions(teacherContext).every(item => item.instructor === 'سارة حسن') && visibleSessions(teacherContext).some(item => item.id === 'x2') && !visibleSessions(teacherContext).some(item => item.id === 'x1'))
  check('teacher sees only students in own groups', visibleStudents(teacherContext).every(item => item.group === 'المستوى الأول A') && !visibleStudents(teacherContext).some(item => item.id === 's1'))
  result = useAppStore.getState().saveAttendance('x1', [])
  check('teacher cannot record attendance for another teacher session', !result.ok && result.code === 'permission_denied')
  check('system summary is manager only', can('مدير التشغيل', 'summary.view') && !can('المدرس', 'summary.view') && !can('موظف المتابعة', 'summary.view') && !can('المحاسب', 'summary.view'))
  check('non-manager roles cannot elevate permissions from their role matrix', !can('المدرس', 'permission.view') && !can('موظف المتابعة', 'audit.view') && !can('المحاسب', 'teacher.view'))
  const activeTeacherIds = useAppStore.getState().teachers.filter(item => item.status === 'نشط').map(item => item.id)
  check('all active teachers are available as distinct accounts', activeTeacherIds.length === 5 && new Set(activeTeacherIds).size === 5)
  const academyBefore = useAppStore.getState().settings.academyName
  useAppStore.getState().saveSettings({ ...useAppStore.getState().settings, academyName: 'تغيير غير مسموح', theme: 'dark' })
  check('non-manager cannot change academy identity through store action', useAppStore.getState().settings.academyName === academyBefore && useAppStore.getState().settings.theme === 'dark')

  console.log(JSON.stringify({ status: 'PASS', tests: results.length, results }, null, 2))
} finally {
  await server.close()
}
