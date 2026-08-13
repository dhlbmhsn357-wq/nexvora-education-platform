import type { Group, Notification, Role, Session, Student, Teacher } from './types'

export type AccessContext = {
  role: Role
  currentTeacherId?: string
  teachers: Teacher[]
  groups: Group[]
  sessions: Session[]
  students: Student[]
}

export const currentTeacher = (context: AccessContext) =>
  context.role === 'المدرس' ? context.teachers.find(item => item.id === context.currentTeacherId) : undefined

export const visibleGroups = (context: AccessContext) => {
  if (context.role !== 'المدرس') return context.groups
  const teacher = currentTeacher(context)
  return teacher ? context.groups.filter(item => item.instructor === teacher.name) : []
}

export const visibleSessions = (context: AccessContext) => {
  if (context.role !== 'المدرس') return context.sessions
  const teacher = currentTeacher(context)
  return teacher ? context.sessions.filter(item => item.instructor === teacher.name) : []
}

export const visibleStudents = (context: AccessContext) => {
  if (context.role !== 'المدرس') return context.students
  const groupNames = new Set(visibleGroups(context).map(item => item.name))
  return context.students.filter(item => groupNames.has(item.group))
}

export const canAccessStudent = (context: AccessContext, id?: string) =>
  Boolean(id && visibleStudents(context).some(item => item.id === id))

export const canAccessGroup = (context: AccessContext, id?: string) =>
  Boolean(id && visibleGroups(context).some(item => item.id === id))

export const canAccessSession = (context: AccessContext, id?: string) =>
  Boolean(id && visibleSessions(context).some(item => item.id === id))

export const visibleNotifications = (context: AccessContext, notifications: Notification[]) => notifications.filter(item => {
  if (context.role === 'مدير التشغيل') return true
  if (context.role === 'المدير العام') return Boolean(item.audience?.includes('المدير العام') || item.priority === 'حرجة' || ['/risks','/decisions','/ledger','/system-summary'].some(prefix => item.route.startsWith(prefix)))
  if (context.role === 'المحاسب') return item.route.startsWith('/payments') || item.route.startsWith('/students/')
  if (context.role === 'موظف المتابعة') return ['/overdue','/messages','/attendance','/students'].some(prefix => item.route.startsWith(prefix))
  const studentId = item.route.match(/^\/students\/([^/?]+)/)?.[1]
  const sessionId = item.route.match(/^\/(?:sessions|attendance)\/([^/?]+)/)?.[1]
  return studentId ? canAccessStudent(context, studentId) : sessionId ? canAccessSession(context, sessionId) : false
})
