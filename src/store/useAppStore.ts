import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import * as seed from '../data/seed'
import { can } from '../domain/permissions'
import { findScheduleConflicts, isWithinAvailability, normalizePhone, timeToMinutes, validateAvailabilityBlocks } from '../domain/validation'
import type {
  AppSettings, AttendanceRecord, AttendanceStatus, AuditEvent, BusinessErrorCode, BusinessResult, DemoState,
  ExecutiveDecision, Followup, Group, LedgerEntry, MessageTemplate, Notification, PaymentProof, PaymentSubmission,
  Role, ScheduleConflict, Session, Student, Teacher, TeacherAvailability, UserAccount,
} from '../domain/types'

type PaymentDraft = { studentId: string; amount: number; method: string; reference: string; paymentDate: string; note: string; proof: PaymentProof }
type SessionPatch = Pick<Session, 'date' | 'day' | 'start' | 'end' | 'room' | 'instructor'> & { reason: string; customReason?: string }
type AttendanceRow = { studentId: string; status: AttendanceStatus; note: string }
type StudentDraft = Omit<Student, 'id' | 'code' | 'status'>
type TeacherDraft = Omit<Teacher, 'id' | 'code' | 'createdAt' | 'updatedAt'>
type GroupDraft = Omit<Group, 'id' | 'enrolled' | 'status'>
type NewSessionDraft = Omit<Session, 'id' | 'history' | 'status'>
type PreparedSessionChange = { message: string; conflicts: ScheduleConflict[] }

type AppState = {
  loggedIn: boolean; role: Role; currentTeacherId?: string; currentUserId: string; currentUserName: string; demoState: DemoState; settings: AppSettings
  users: UserAccount[]
  students: Student[]; teachers: Teacher[]; groups: Group[]; sessions: Session[]; attendance: AttendanceRecord[]
  followups: Followup[]; payments: PaymentSubmission[]; ledger: LedgerEntry[]; executiveDecisions: ExecutiveDecision[]; audit: AuditEvent[]
  notifications: Notification[]; messageTemplates: MessageTemplate[]
  login: (role: Role, teacherId?: string) => void; logout: () => void; setRole: (role: Role) => void; setDemoState: (state: DemoState) => void; reset: () => void
  addStudent: (student: StudentDraft) => BusinessResult<{ id: string }>
  updateStudent: (id: string, patch: Partial<Student>) => BusinessResult
  archiveStudent: (id: string, archived: boolean) => BusinessResult
  deleteStudent: (id: string) => BusinessResult
  addGroup: (group: GroupDraft) => BusinessResult<{ id: string }>
  updateGroup: (id: string, patch: Partial<Group>) => BusinessResult
  archiveGroup: (id: string, archived: boolean) => BusinessResult
  deleteGroup: (id: string) => BusinessResult
  addTeacher: (teacher: TeacherDraft) => BusinessResult<{ id: string }>
  updateTeacher: (id: string, patch: Partial<Teacher>) => BusinessResult
  archiveTeacher: (id: string, archived: boolean) => BusinessResult
  deleteTeacher: (id: string) => BusinessResult
  saveTeacherAvailability: (id: string, availability: TeacherAvailability[]) => BusinessResult
  assignTeacherToGroup: (teacherId: string, groupId: string) => BusinessResult
  addSession: (draft: NewSessionDraft) => BusinessResult<{ id: string }>
  saveAttendance: (sessionId: string, rows: AttendanceRow[]) => BusinessResult
  addFollowup: (record: Omit<Followup, 'id' | 'createdBy'>) => BusinessResult
  submitPayment: (draft: PaymentDraft) => BusinessResult<{ id: string }>
  reviewPayment: (id: string, decision: 'approve' | 'reject', note: string) => BusinessResult
  decideExecutive: (id: string, decision: 'approve' | 'reject', reason: string) => BusinessResult
  updateSession: (id: string, patch: SessionPatch) => BusinessResult<PreparedSessionChange>
  markNotification: (id: string) => void; markAllNotifications: () => void
  recordTemplateUse: (templateId: string, studentId?: string) => void; saveSettings: (settings: AppSettings) => void
}

const now = () => new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date())
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
const fallbackStorage = { getItem: (_key: string) => null, setItem: (_key: string, _value: string) => undefined, removeItem: (_key: string) => undefined }
const ok = <T = undefined>(value?: T): BusinessResult<T> => ({ ok: true, value: value as T })
const fail = (code: BusinessErrorCode, message: string, meta?: Record<string, unknown>): BusinessResult<never> => ({ ok: false, code, message, meta })
const defaultActors:Record<Role,{id:string;name:string}>={
  'المدير العام':{id:'u-ceo',name:'د. خالد منصور'},'مدير التشغيل':{id:'u-ops',name:'محمد أشرف'},
  'موظف المتابعة':{id:'u-follow',name:'سلمى حسن'},'المحاسب':{id:'u-accountant-entry',name:'هبة سامي'},'المدرس':{id:'u-t1',name:'أحمد مصطفى'},
}
const auditEvent = (type: string, title: string, detail: string, user: Role, entity?: string, entityId?: string, userId?:string, userName?:string, extra:Partial<AuditEvent>={}): AuditEvent => ({ id: uid('au'), type, title, detail, user, userId:userId||defaultActors[user].id, userName:userName||defaultActors[user].name, at: now(), entity, entityId, sensitivity:'عادية', ...extra })
const initial = () => ({
  students: structuredClone(seed.students), teachers: structuredClone(seed.teachers), groups: structuredClone(seed.groups), sessions: structuredClone(seed.sessions),
  users:structuredClone(seed.users),attendance: structuredClone(seed.attendance), followups: structuredClone(seed.followups), payments: structuredClone(seed.payments),ledger:structuredClone(seed.ledger),executiveDecisions:structuredClone(seed.executiveDecisions),
  audit: structuredClone(seed.audit), notifications: structuredClone(seed.notifications), messageTemplates: structuredClone(seed.messageTemplates), settings: structuredClone(seed.settings),
})

export const useAppStore = create<AppState>()(persist((set, get) => ({
  loggedIn: false, role: 'مدير التشغيل', currentTeacherId: undefined,currentUserId:'u-ops',currentUserName:'محمد أشرف', demoState: 'populated', ...initial(),
  login: (role, identityId) => set(state => {
    const account=state.users.find(item=>item.active&&item.role===role&&(item.id===identityId||item.teacherId===identityId))||state.users.find(item=>item.active&&item.role===role)
    const activeTeacherId = role === 'المدرس' ? account?.teacherId : undefined
    const currentUserId=account?.id||defaultActors[role].id,currentUserName=account?.name||defaultActors[role].name
    return { loggedIn: true, role, currentTeacherId: activeTeacherId,currentUserId,currentUserName, audit: [auditEvent('auth', 'تم تسجيل الدخول', `الدور: ${role} · ${currentUserName}`, role,undefined,undefined,currentUserId,currentUserName,{sensitivity:'مهمة'}), ...state.audit] }
  }),
  logout: () => set(state=>({ loggedIn: false,audit:[auditEvent('auth','تم تسجيل الخروج',state.currentUserName,state.role,undefined,undefined,state.currentUserId,state.currentUserName,{sensitivity:'مهمة'}),...state.audit] })),
  setRole: role => set(state => {const account=state.users.find(item=>item.role===role&&item.active);return{ role,currentUserId:account?.id||defaultActors[role].id,currentUserName:account?.name||defaultActors[role].name,currentTeacherId:role==='المدرس'?(account?.teacherId||state.teachers.find(item=>item.status==='نشط')?.id):undefined }}),
  setDemoState: demoState => set({ demoState }),
  reset: () => set({ loggedIn: false, role: 'مدير التشغيل', currentTeacherId: undefined,currentUserId:'u-ops',currentUserName:'محمد أشرف', demoState: 'populated', ...initial() }),

  addStudent: student => {
    const state = get()
    if (!can(state.role, 'student.create')) return fail('permission_denied', 'ليس لديك صلاحية إنشاء طالب.')
    const phone = normalizePhone(student.phone)
    const duplicate = state.students.find(item => normalizePhone(item.phone) === phone)
    if (duplicate) return fail('duplicate_student', 'لا يمكن إنشاء طالب جديد لأن رقم الهاتف مسجل بالفعل.', { studentId: duplicate.id })
    const group = student.group ? state.groups.find(item => item.name === student.group) : undefined
    if (student.group && !can(state.role, 'group.assign')) return fail('permission_denied', 'ليس لديك صلاحية إسناد الطالب إلى مجموعة.')
    if (student.group && !group) return fail('group_not_found', 'المجموعة المختارة غير موجودة. اختر مجموعة أخرى.')
    if (group && group.enrolled >= group.capacity) return fail('group_full', `مجموعة ${group.name} مكتملة السعة. اختر مجموعة أخرى.`, { groupId: group.id })
    const id = uid('s')
    set(current => ({
      students: [...current.students, { ...student, phone, id, code: `ST-${1000 + current.students.length + 1}`, status: 'نشط' }],
      groups: group ? current.groups.map(item => item.id === group.id ? { ...item, enrolled: item.enrolled + 1, status: item.enrolled + 1 >= item.capacity ? 'مكتملة' : 'نشطة' } : item) : current.groups,
      notifications: [{ id: uid('n'), title: 'تم إنشاء ملف طالب', detail: `${student.name} · ${student.group}`, route: `/students/${id}`, read: false, at: 'الآن', tone: 'success' }, ...current.notifications],
      audit: [
        auditEvent('student', 'تم إنشاء ملف طالب', `${student.name} · ${phone}`, current.role, 'student', id),
        ...(group ? [auditEvent('group', 'تم إسناد طالب إلى مجموعة', `${student.name} ← ${student.group}`, current.role, 'group', group.id)] : []),
        ...current.audit,
      ],
    }))
    return ok({ id })
  },

  updateStudent: (id, patch) => {
    const state = get()
    if (!can(state.role, 'student.update')) return fail('permission_denied', 'ليس لديك صلاحية تعديل الطلاب.')
    const student = state.students.find(item => item.id === id)
    if (!student) return fail('student_not_found', 'ملف الطالب غير موجود.')
    if (patch.phone) {
      const phone = normalizePhone(patch.phone)
      const duplicate = state.students.find(item => item.id !== id && normalizePhone(item.phone) === phone)
      if (duplicate) return fail('duplicate_student', 'رقم الهاتف مستخدم في ملف طالب آخر.', { studentId: duplicate.id })
      patch = { ...patch, phone }
    }
    const nextGroupName = patch.group ?? student.group
    const groupChanged = nextGroupName !== student.group
    const nextGroup = nextGroupName ? state.groups.find(item => item.name === nextGroupName) : undefined
    if (groupChanged && !can(state.role, 'group.assign')) return fail('permission_denied', 'ليس لديك صلاحية تغيير مجموعة الطالب.')
    if (groupChanged && nextGroupName && !nextGroup) return fail('group_not_found', 'المجموعة المختارة غير موجودة.')
    if (groupChanged && nextGroup && nextGroup.enrolled >= nextGroup.capacity) return fail('group_full', `مجموعة ${nextGroup.name} مكتملة السعة. اختر مجموعة أخرى.`, { groupId: nextGroup.id })
    set(current => ({
      students: current.students.map(item => item.id === id ? { ...item, ...patch } : item),
      groups: groupChanged ? current.groups.map(group => {
        if (group.name === student.group) return { ...group, enrolled: Math.max(0, group.enrolled - 1), status: 'نشطة' }
        if (nextGroupName && group.name === nextGroupName) return { ...group, enrolled: group.enrolled + 1, status: group.enrolled + 1 >= group.capacity ? 'مكتملة' : 'نشطة' }
        return group
      }) : current.groups,
      audit: [
        auditEvent('student', 'تم تعديل ملف طالب', student.name, current.role, 'student', id),
        ...(groupChanged ? [auditEvent('group', 'تم تغيير مجموعة طالب', `${student.name}: ${student.group} ← ${nextGroupName}`, current.role, 'student', id)] : []),
        ...current.audit,
      ],
    }))
    return ok()
  },

  archiveStudent: (id, archived) => {
    const state=get(),student=state.students.find(item=>item.id===id)
    if(!can(state.role,'student.update'))return fail('permission_denied','ليس لديك صلاحية أرشفة الطلاب.')
    if(!student)return fail('student_not_found','ملف الطالب غير موجود.')
    set(current=>({students:current.students.map(item=>item.id===id?{...item,status:archived?'مؤرشف':'نشط'}:item),audit:[auditEvent('student',archived?'تمت أرشفة طالب':'تمت استعادة طالب',student.name,current.role,'student',id),...current.audit]}))
    return ok()
  },

  deleteStudent: id => {
    const state=get(),student=state.students.find(item=>item.id===id)
    if(!can(state.role,'student.update'))return fail('permission_denied','ليس لديك صلاحية حذف الطلاب.')
    if(!student)return fail('student_not_found','ملف الطالب غير موجود.')
    set(current=>({students:current.students.filter(item=>item.id!==id),attendance:current.attendance.filter(item=>item.studentId!==id),followups:current.followups.filter(item=>item.studentId!==id),payments:current.payments.filter(item=>item.studentId!==id),groups:current.groups.map(group=>group.name===student.group?{...group,enrolled:Math.max(0,group.enrolled-1),status:'نشطة'}:group),audit:[auditEvent('student','تم الحذف النهائي لطالب',`${student.name} · حُذفت السجلات المحلية المرتبطة`,current.role,'student',id),...current.audit]}))
    return ok()
  },

  addGroup: group => {
    const state=get()
    if(!can(state.role,'group.assign'))return fail('permission_denied','ليس لديك صلاحية إنشاء مجموعة.')
    if(state.groups.some(item=>item.name.trim()===group.name.trim()))return fail('duplicate_group','يوجد بالفعل مجموعة بهذا الاسم.')
    if(!group.name.trim()||group.capacity<1)return fail('group_not_found','أدخل اسمًا وسعة صحيحة للمجموعة.')
    const id=uid('g')
    set(current=>({groups:[...current.groups,{...group,name:group.name.trim(),id,enrolled:0,status:'نشطة'}],audit:[auditEvent('group','تم إنشاء مجموعة',group.name,current.role,'group',id),...current.audit]}))
    return ok({id})
  },

  updateGroup: (id, patch) => {
    const state = get()
    if (!can(state.role, 'group.assign')) return fail('permission_denied', 'ليس لديك صلاحية تعديل المجموعة.')
    const group = state.groups.find(item => item.id === id)
    if (!group) return fail('group_not_found', 'المجموعة غير موجودة.')
    if (patch.capacity != null && patch.capacity < group.enrolled) return fail('group_full', `لا يمكن تقليل السعة عن الإشغال الحالي (${group.enrolled}).`)
    const nextName = patch.name?.trim() || group.name
    set(current => ({
      groups: current.groups.map(item => item.id === id ? { ...item, ...patch, name: nextName, status: (patch.capacity ?? item.capacity) <= item.enrolled ? 'مكتملة' : (patch.status ?? 'نشطة') } : item),
      students: nextName !== group.name ? current.students.map(student => student.group === group.name ? { ...student, group: nextName } : student) : current.students,
      sessions: nextName !== group.name ? current.sessions.map(session => session.group === group.name ? { ...session, group: nextName } : session) : current.sessions,
      notifications: [{ id: uid('n'), title: 'تم تعديل مجموعة', detail: nextName, route: `/groups/${id}`, read: false, at: 'الآن', tone: 'info' }, ...current.notifications],
      audit: [auditEvent('group', 'تم تعديل مجموعة', `${group.name}${nextName !== group.name ? ` ← ${nextName}` : ''}`, current.role, 'group', id), ...current.audit],
    }))
    return ok()
  },

  archiveGroup: (id, archived) => {
    const state=get(),group=state.groups.find(item=>item.id===id)
    if(!can(state.role,'group.assign'))return fail('permission_denied','ليس لديك صلاحية أرشفة المجموعات.')
    if(!group)return fail('group_not_found','المجموعة غير موجودة.')
    set(current=>({groups:current.groups.map(item=>item.id===id?{...item,status:archived?'مؤرشفة':item.enrolled>=item.capacity?'مكتملة':'نشطة'}:item),audit:[auditEvent('group',archived?'تمت أرشفة مجموعة':'تمت استعادة مجموعة',group.name,current.role,'group',id),...current.audit]}))
    return ok()
  },

  deleteGroup: id => {
    const state=get(),group=state.groups.find(item=>item.id===id)
    if(!can(state.role,'group.assign'))return fail('permission_denied','ليس لديك صلاحية حذف المجموعات.')
    if(!group)return fail('group_not_found','المجموعة غير موجودة.')
    const studentCount=state.students.filter(item=>item.group===group.name).length,sessionCount=state.sessions.filter(item=>item.group===group.name).length
    if(studentCount||sessionCount)return fail('linked_records',`لا يمكن الحذف النهائي قبل نقل ${studentCount} طالب ومعالجة ${sessionCount} حصة مرتبطة.`)
    set(current=>({groups:current.groups.filter(item=>item.id!==id),audit:[auditEvent('group','تم الحذف النهائي لمجموعة',group.name,current.role,'group',id),...current.audit]}))
    return ok()
  },

  addTeacher: teacher => {
    const state = get()
    if (!can(state.role, 'teacher.create')) return fail('permission_denied', 'ليس لديك صلاحية إضافة مدرس.')
    const phone = normalizePhone(teacher.phone)
    const duplicate = state.teachers.find(item => normalizePhone(item.phone) === phone)
    if (duplicate) return fail('duplicate_teacher', 'يوجد مدرس مسجل بالفعل بهذا الرقم.', { teacherId: duplicate.id })
    const id = uid('t'), stamp = new Date().toISOString()
    set(current => ({
      teachers: [...current.teachers, {...teacher, id, phone, code:`TR-${1000+current.teachers.length+1}`, createdAt:stamp, updatedAt:stamp}],
      audit: [auditEvent('teacher','تم إضافة مدرس جديد',`${teacher.name} · ${phone}`,current.role,'teacher',id),...current.audit],
      notifications: [{id:uid('n'),title:'تمت إضافة مدرس',detail:teacher.name,route:`/teachers/${id}`,read:false,at:'الآن',tone:'success'},...current.notifications],
    }))
    return ok({id})
  },

  updateTeacher: (id, patch) => {
    const state = get(), teacher = state.teachers.find(item=>item.id===id)
    if (!can(state.role,'teacher.update')) return fail('permission_denied','ليس لديك صلاحية تعديل المدرسين.')
    if (!teacher) return fail('teacher_not_found','ملف المدرس غير موجود.')
    if (patch.phone) {
      const phone=normalizePhone(patch.phone), duplicate=state.teachers.find(item=>item.id!==id&&normalizePhone(item.phone)===phone)
      if (duplicate) return fail('duplicate_teacher','يوجد مدرس مسجل بالفعل بهذا الرقم.',{teacherId:duplicate.id})
      patch={...patch,phone}
    }
    if (patch.status==='غير نشط' && state.sessions.some(item=>item.instructor===teacher.name&&item.date>='2026-08-11'&&item.status!=='ملغاة')) return fail('teacher_inactive','لدى المدرس حصص قادمة مجدولة. راجع الحصص قبل إيقافه.')
    const nextName=patch.name?.trim()||teacher.name
    set(current=>({teachers:current.teachers.map(item=>item.id===id?{...item,...patch,name:nextName,updatedAt:new Date().toISOString()}:item),groups:nextName!==teacher.name?current.groups.map(item=>item.instructor===teacher.name?{...item,instructor:nextName}:item):current.groups,sessions:nextName!==teacher.name?current.sessions.map(item=>item.instructor===teacher.name?{...item,instructor:nextName}:item):current.sessions,audit:[auditEvent('teacher','تم تعديل بيانات مدرس',`${teacher.name}${nextName!==teacher.name?` ← ${nextName}`:''}`,current.role,'teacher',id),...current.audit]}))
    return ok()
  },

  archiveTeacher: (id, archived) => {
    const state=get(),teacher=state.teachers.find(item=>item.id===id)
    if(!can(state.role,'teacher.update'))return fail('permission_denied','ليس لديك صلاحية أرشفة المدرسين.')
    if(!teacher)return fail('teacher_not_found','ملف المدرس غير موجود.')
    if(archived&&state.sessions.some(item=>item.instructor===teacher.name&&item.date>='2026-08-11'&&item.status!=='ملغاة'))return fail('linked_records','لا يمكن أرشفة المدرس قبل إعادة إسناد حصصه القادمة أو إلغائها.')
    set(current=>({teachers:current.teachers.map(item=>item.id===id?{...item,status:archived?'مؤرشف':'نشط',updatedAt:new Date().toISOString()}:item),audit:[auditEvent('teacher',archived?'تمت أرشفة مدرس':'تمت استعادة مدرس',teacher.name,current.role,'teacher',id),...current.audit]}))
    return ok()
  },

  deleteTeacher: id => {
    const state=get(),teacher=state.teachers.find(item=>item.id===id)
    if(!can(state.role,'teacher.update'))return fail('permission_denied','ليس لديك صلاحية حذف المدرسين.')
    if(!teacher)return fail('teacher_not_found','ملف المدرس غير موجود.')
    const groupCount=state.groups.filter(item=>item.instructor===teacher.name).length,sessionCount=state.sessions.filter(item=>item.instructor===teacher.name).length
    if(groupCount||sessionCount)return fail('linked_records',`لا يمكن الحذف النهائي قبل إعادة إسناد ${groupCount} مجموعة ومعالجة ${sessionCount} حصة مرتبطة.`)
    set(current=>({teachers:current.teachers.filter(item=>item.id!==id),audit:[auditEvent('teacher','تم الحذف النهائي لمدرس',teacher.name,current.role,'teacher',id),...current.audit]}))
    return ok()
  },

  saveTeacherAvailability: (id, availability) => {
    const state=get(),teacher=state.teachers.find(item=>item.id===id)
    if(!can(state.role,'teacher.schedule')) return fail('permission_denied','ليس لديك صلاحية تعديل أوقات التوفر.')
    if(!teacher) return fail('teacher_not_found','ملف المدرس غير موجود.')
    if(!validateAvailabilityBlocks(availability)) return fail('invalid_availability','تأكد أن وقت النهاية بعد البداية ولا توجد فترات متداخلة في اليوم نفسه.')
    set(current=>({teachers:current.teachers.map(item=>item.id===id?{...item,availability,updatedAt:new Date().toISOString()}:item),audit:[auditEvent('teacher','تم تحديث أوقات توفر المدرس',teacher.name,current.role,'teacher',id),...current.audit]}))
    return ok()
  },

  assignTeacherToGroup: (teacherId, groupId) => {
    const state=get(),teacher=state.teachers.find(item=>item.id===teacherId),group=state.groups.find(item=>item.id===groupId)
    if(!can(state.role,'teacher.assign')) return fail('permission_denied','ليس لديك صلاحية إسناد المدرسين.')
    if(!teacher) return fail('teacher_not_found','ملف المدرس غير موجود.')
    if(!group) return fail('group_not_found','المجموعة غير موجودة.')
    if(teacher.status!=='نشط') return fail('teacher_inactive','لا يمكن إسناد مدرس غير نشط إلى مجموعة جديدة.')
    const groupSessions=state.sessions.filter(item=>item.group===group.name&&item.status!=='ملغاة')
    for(const session of groupSessions){
      if(!isWithinAvailability(teacher.availability,session.day,session.start,session.end)) return fail('outside_availability',`موعد ${session.day} ${session.start} خارج أوقات توفر المدرس.`)
      const conflicts=findScheduleConflicts(state.sessions,{...session,instructor:teacher.name})
      if(conflicts.length) return fail('schedule_conflict','لا يمكن الإسناد لوجود تعارض في جدول المدرس.',{conflicts})
    }
    set(current=>({groups:current.groups.map(item=>item.id===groupId?{...item,instructor:teacher.name}:item),sessions:current.sessions.map(item=>item.group===group.name?{...item,instructor:teacher.name}:item),audit:[auditEvent('teacher','تم إسناد مدرس إلى مجموعة',`${teacher.name} ← ${group.name}`,current.role,'group',groupId),...current.audit]}))
    return ok()
  },

  addSession: draft => {
    const state=get(),teacher=state.teachers.find(item=>item.name===draft.instructor)
    if(!can(state.role,'teacher.schedule')||!can(state.role,'schedule.edit')) return fail('permission_denied','ليس لديك صلاحية إضافة حصة.')
    if(!teacher) return fail('teacher_not_found','اختر مدرسًا مسجلًا.')
    if(teacher.status!=='نشط') return fail('teacher_inactive','لا يمكن إسناد حصة مستقبلية إلى مدرس غير نشط.')
    if(timeToMinutes(draft.end)<=timeToMinutes(draft.start)) return fail('invalid_time','وقت النهاية يجب أن يكون بعد وقت البداية.')
    if(!isWithinAvailability(teacher.availability,draft.day,draft.start,draft.end)) return fail('outside_availability','الموعد خارج أوقات توفر المدرس.')
    const proposed={...draft,id:'new',status:'قادمة' as const,history:[]}
    const conflicts=findScheduleConflicts(state.sessions,proposed)
    if(conflicts.length) return fail('schedule_conflict','يوجد تعارض يمنع إضافة الحصة.',{conflicts})
    const id=uid('x')
    set(current=>({sessions:[{...draft,id,status:draft.date==='2026-08-11'?'اليوم':'قادمة',history:[{id:uid('h'),action:'إنشاء الجلسة',user:current.role,at:now()}]},...current.sessions],audit:[auditEvent('schedule','تمت إضافة حصة',`${draft.group} · ${draft.instructor} · ${draft.date} ${draft.start}`,current.role,'session',id),...current.audit]}))
    return ok({id})
  },

  saveAttendance: (sessionId, rows) => {
    const state = get()
    if (!can(state.role, 'attendance.record')) return fail('permission_denied', 'ليس لديك صلاحية تسجيل الحضور.')
    const session = state.sessions.find(item => item.id === sessionId)
    if (!session) return fail('session_not_found', 'الجلسة غير موجودة.')
    if (state.role === 'المدرس') {
      const teacher = state.teachers.find(item => item.id === state.currentTeacherId)
      if (!teacher || session.instructor !== teacher.name) return fail('permission_denied', 'يمكنك تسجيل حضور حصصك أنت فقط.')
    }
    const expected = state.students.filter(student => student.group === session.group).map(student => student.id)
    const unique = new Set(rows.map(row => row.studentId))
    const validStatuses: AttendanceStatus[] = ['حاضر', 'غائب', 'متأخر', 'بعذر']
    if (!expected.length || rows.length !== expected.length || unique.size !== rows.length || rows.some(row => !expected.includes(row.studentId) || !validStatuses.includes(row.status))) {
      return fail('invalid_attendance', 'يجب تحديد حالة صحيحة لكل طالب في الجلسة قبل الحفظ.')
    }
    set(current => {
      const records = rows.map(row => ({ id: uid('att'), sessionId, studentId: row.studentId, group: session.group, status: row.status, date: session.date, note: row.note, recordedBy: current.role }))
      const summary = validStatuses.map(status => `${status}: ${rows.filter(row => row.status === status).length}`).join(' · ')
      return {
        attendance: [...records, ...current.attendance.filter(item => item.sessionId !== sessionId)],
        sessions: current.sessions.map(item => item.id === sessionId ? { ...item, status: 'مكتملة', history: [{ id: uid('h'), action: 'تسجيل الحضور وإغلاق الجلسة', reason: summary, user: current.role, at: now() }, ...item.history] } : item),
        notifications: [{ id: uid('n'), title: 'تم حفظ الحضور', detail: `${session.group} · ${rows.length} طلاب`, route: `/sessions/${sessionId}`, read: false, at: 'الآن', tone: 'success' }, ...current.notifications],
        audit: [auditEvent('attendance', 'تم تسجيل الحضور', `${session.group} · ${summary}`, current.role, 'session', sessionId), ...current.audit],
      }
    })
    return ok()
  },

  addFollowup: record => {
    const state = get()
    if (!can(state.role, 'followup.create')) return fail('permission_denied', 'ليس لديك صلاحية تسجيل المتابعة.')
    const student = state.students.find(item => item.id === record.studentId)
    if (!student) return fail('student_not_found', 'ملف الطالب غير موجود.')
    set(current => ({
      followups: [{ ...record, id: uid('f'), createdBy: current.role }, ...current.followups],
      notifications: record.escalated ? [{ id: uid('n'), title: 'متابعة مالية مصعّدة', detail: `${student.name} · ${record.result}`, route: `/overdue/${record.studentId}`, read: false, at: 'الآن', tone: 'danger' }, ...current.notifications] : current.notifications,
      audit: [
        auditEvent('followup', 'تم تسجيل متابعة مالية', `${student.name} · ${record.result} · الموعد التالي ${record.date}`, current.role, 'student', student.id),
        ...(record.escalated ? [auditEvent('escalation', 'تم تصعيد متابعة', student.name, current.role, 'student', student.id)] : []),
        ...current.audit,
      ],
    }))
    return ok()
  },

  submitPayment: draft => {
    const state = get()
    if (!can(state.role, 'payment.create')) return fail('permission_denied', 'ليس لديك صلاحية تسجيل دفعة.')
    const account=state.users.find(item=>item.id===state.currentUserId)
    if(state.role==='المحاسب'&&!account?.capabilities?.includes('payment.create'))return fail('permission_denied','هذا الحساب مخصص لمراجعة الدفعات ولا يملك صلاحية تسجيلها.')
    const student = state.students.find(item => item.id === draft.studentId)
    const remaining = student ? student.total - student.paid : 0
    if (!student || !Number.isFinite(draft.amount) || draft.amount <= 0 || draft.amount > remaining || !draft.proof?.name) return fail('invalid_payment', 'بيانات الدفعة أو الإثبات غير صحيحة.')
    if(state.payments.some(item=>item.reference.trim().toLowerCase()===draft.reference.trim().toLowerCase()))return fail('duplicate_reference','المرجع المالي مستخدم في طلب دفع آخر.')
    const id = `REV-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`
    set(current => ({
      payments: [{ ...draft, id, status: 'بانتظار المراجعة', createdAt: now(), createdBy: current.role,createdByUserId:current.currentUserId,createdByName:current.currentUserName, history: [{ id: uid('r'), title: 'تم تسجيل الدفعة ورفع الإثبات', user: current.role, at: now() }] }, ...current.payments],
      notifications: [{ id: uid('n'), title: 'دفعة جديدة تنتظر المراجعة', detail: `${id} · ${draft.amount} ج`, route: `/payments/review/${id}`, read: false, at: 'الآن', tone: 'warning' }, ...current.notifications],
      audit: [auditEvent('payment', 'تم إرسال دفعة للمراجعة', `${student.name} · ${draft.amount} ج`, current.role, 'payment', id,current.currentUserId,current.currentUserName,{sensitivity:'مهمة',route:`/payments/review/${id}`}), ...current.audit],
    }))
    return ok({ id })
  },

  reviewPayment: (id, decision, note) => {
    const state = get()
    if (!can(state.role, 'payment.approve')) return fail('permission_denied', 'ليس لديك صلاحية مراجعة الدفعات.')
    const account=state.users.find(item=>item.id===state.currentUserId)
    if(state.role==='المحاسب'&&!account?.capabilities?.includes('payment.approve'))return fail('permission_denied','هذا الحساب مخصص لتسجيل الدفعات ولا يملك صلاحية اعتمادها.')
    if (decision === 'reject' && !note.trim()) return fail('rejection_reason_required', 'اكتب سبب الرفض قبل المتابعة.')
    const payment = state.payments.find(item => item.id === id)
    if (!payment || payment.status !== 'بانتظار المراجعة') return fail('payment_not_found', 'طلب الدفع غير متاح للمراجعة.')
    if(payment.createdByUserId===state.currentUserId)return fail('self_approval','لا يمكن لمن سجل الدفعة اعتمادها. يجب مراجعتها بواسطة مستخدم مخول آخر.')
    const approved = decision === 'approve'
    const student = state.students.find(item => item.id === payment.studentId)
    if(approved&&payment.amount>=1000){
      set(current=>({payments:current.payments.map(item=>item.id===id?{...item,status:'بانتظار اعتماد تنفيذي',reviewedAt:now(),reviewedBy:current.role,reviewedByUserId:current.currentUserId,reviewedByName:current.currentUserName,reviewNote:note,history:[{id:uid('r'),title:'تمت الإحالة إلى المدير العام لاعتماد استثنائي',user:current.role,at:now()},...item.history]}:item),executiveDecisions:[{id:uid('dec'),type:'اعتماد مالي استثنائي',title:`اعتماد دفعة ${payment.amount.toLocaleString('ar-EG')} ج`,summary:`دفعة للطالب ${student?.name} تجاوزت حد الاعتماد العادي.`,impact:`سيتم تحديث الرصيد من ${student?.paid||0} إلى ${Math.min(student?.total||0,(student?.paid||0)+payment.amount)} ج.`,requestedByUserId:current.currentUserId,requestedByName:current.currentUserName,requestedAt:now(),evidence:`${payment.id} · ${payment.reference}`,route:`/payments/review/${payment.id}`,status:'بانتظار الاعتماد'},...current.executiveDecisions],notifications:[{id:uid('n'),title:'اعتماد مالي استثنائي',detail:`${student?.name} · ${payment.amount} ج`,route:'/decisions',read:false,at:'الآن',tone:'danger',audience:['المدير العام'],priority:'حرجة',owner:'المدير العام',status:'جديد'},...current.notifications],audit:[auditEvent('payment','تمت إحالة دفعة لاعتماد تنفيذي',`${student?.name} · ${payment.amount} ج`,current.role,'payment',id,current.currentUserId,current.currentUserName,{sensitivity:'حرجة',route:`/payments/review/${id}`}),...current.audit]}))
      return ok()
    }
    set(current => ({
      payments: current.payments.map(item => item.id === id ? { ...item, status: approved ? 'معتمدة' : 'مرفوضة', reviewNote: note, reviewedAt: now(), reviewedBy: current.role,reviewedByUserId:current.currentUserId,reviewedByName:current.currentUserName, history: [{ id: uid('r'), title: approved ? 'تم اعتماد الدفعة وتحديث الرصيد' : 'تم رفض الدفعة وإعادتها للتصحيح', user: current.role, at: now() }, ...item.history] } : item),
      students: approved ? current.students.map(item => item.id === payment.studentId ? { ...item, paid: Math.min(item.total, item.paid + payment.amount), due: item.paid + payment.amount >= item.total ? 'مستوفى' : 'دفعة جزئية' } : item) : current.students,
      ledger:approved&&student?[...current.ledger,{id:uid('led'),studentId:student.id,type:'دفعة معتمدة',amount:payment.amount,date:payment.paymentDate,status:'معتمدة',reference:payment.reference,createdByUserId:payment.createdByUserId||'unknown',createdByName:payment.createdByName||payment.createdBy,reviewedByUserId:current.currentUserId,reviewedByName:current.currentUserName,balanceBefore:student.paid,balanceAfter:Math.min(student.total,student.paid+payment.amount),reason:note||'دفعة معتمدة',paymentId:payment.id}]:current.ledger,
      notifications: [{ id: uid('n'), title: approved ? 'تم اعتماد دفعة' : 'تم رفض إثبات دفعة', detail: `${student?.name} · ${payment.amount} ج`, route: `/students/${payment.studentId}`, read: false, at: 'الآن', tone: approved ? 'success' : 'danger' }, ...current.notifications],
      audit: [auditEvent('payment', approved ? 'تم اعتماد دفعة' : 'تم رفض إثبات دفعة', `${student?.name} · ${payment.amount} ج · ${note || 'دون ملاحظة'}`, current.role, 'payment', id,current.currentUserId,current.currentUserName,{sensitivity:'حرجة',reason:note||'دون ملاحظة',route:`/payments/review/${id}`}), ...current.audit],
    }))
    return ok()
  },

  decideExecutive:(id,decision,reason)=>{
    const state=get(),item=state.executiveDecisions.find(row=>row.id===id)
    if(!can(state.role,'decision.approve'))return fail('permission_denied','هذا القرار حصري للمدير العام.')
    if(!item||item.status!=='بانتظار الاعتماد')return fail('decision_not_found','القرار غير متاح للاعتماد.')
    if(!reason.trim())return fail('rejection_reason_required','اكتب سبب القرار قبل المتابعة.')
    const approved=decision==='approve',paymentId=item.route.match(/\/payments\/review\/([^/?]+)/)?.[1],payment=state.payments.find(row=>row.id===paymentId),student=state.students.find(row=>row.id===payment?.studentId)
    set(current=>({executiveDecisions:current.executiveDecisions.map(row=>row.id===id?{...row,status:approved?'معتمد':'مرفوض',decidedByUserId:current.currentUserId,decidedByName:current.currentUserName,decidedAt:now(),reason}:row),payments:payment?current.payments.map(row=>row.id===payment.id?{...row,status:approved?'معتمدة':'مرفوضة',reviewedAt:now(),reviewedBy:'المدير العام',reviewedByUserId:current.currentUserId,reviewedByName:current.currentUserName,reviewNote:reason,history:[{id:uid('r'),title:approved?'اعتمد المدير العام الدفعة':'رفض المدير العام الدفعة',user:'المدير العام',at:now()},...row.history]}:row):current.payments,students:approved&&payment&&student?current.students.map(row=>row.id===student.id?{...row,paid:Math.min(row.total,row.paid+payment.amount),due:row.paid+payment.amount>=row.total?'مستوفى':'دفعة جزئية'}:row):current.students,ledger:approved&&payment&&student?[...current.ledger,{id:uid('led'),studentId:student.id,type:'دفعة معتمدة',amount:payment.amount,date:payment.paymentDate,status:'معتمدة',reference:payment.reference,createdByUserId:payment.createdByUserId||'unknown',createdByName:payment.createdByName||payment.createdBy,reviewedByUserId:current.currentUserId,reviewedByName:current.currentUserName,balanceBefore:student.paid,balanceAfter:Math.min(student.total,student.paid+payment.amount),reason,paymentId:payment.id}]:current.ledger,audit:[auditEvent('executive-decision',approved?'اعتمد المدير العام قرارًا':'رفض المدير العام قرارًا',`${item.title} · ${reason}`,current.role,'decision',id,current.currentUserId,current.currentUserName,{sensitivity:'حرجة',reason,route:'/decisions'}),...current.audit],notifications:[{id:uid('n'),title:approved?'تم اعتماد القرار التنفيذي':'تم رفض القرار التنفيذي',detail:item.title,route:'/decisions',read:false,at:'الآن',tone:approved?'success':'danger',priority:'حرجة',owner:item.requestedByName,status:'مغلق'},...current.notifications]}))
    return ok()
  },

  updateSession: (id, patch) => {
    const state = get()
    if (!can(state.role, 'schedule.edit')) return fail('permission_denied', 'ليس لديك صلاحية تعديل الجلسات.')
    const session = state.sessions.find(item => item.id === id)
    if (!session) return fail('session_not_found', 'الجلسة غير موجودة.')
    const reason = patch.reason === 'سبب آخر' ? patch.customReason?.trim() : patch.reason.trim()
    if (!reason) return fail('schedule_conflict', 'سبب التعديل مطلوب قبل الحفظ.')
    const teacher=state.teachers.find(item=>item.name===patch.instructor)
    if(teacher?.status==='غير نشط') return fail('teacher_inactive','لا يمكن إسناد حصة مستقبلية إلى مدرس غير نشط.')
    if(teacher&&!isWithinAvailability(teacher.availability,patch.day,patch.start,patch.end)) return fail('outside_availability','لا يمكن تحديد هذه الحصة لأن الموعد خارج أوقات توفر المدرس.')
    if (!Number.isFinite(timeToMinutes(patch.start)) || timeToMinutes(patch.end) <= timeToMinutes(patch.start)) return fail('invalid_time', 'وقت النهاية يجب أن يكون بعد وقت البداية.')
    const conflicts = findScheduleConflicts(state.sessions, { ...session, ...patch })
    if (conflicts.length) return fail('schedule_conflict', 'يوجد تعارض يمنع حفظ الموعد.', { conflicts })
    const before = `${session.date} · ${session.start}–${session.end} · ${session.instructor} · ${session.room}`
    const after = `${patch.date} · ${patch.start}–${patch.end} · ${patch.instructor} · ${patch.room}`
    const message = `تم تعديل موعد مجموعة ${session.group} إلى ${patch.date} من ${patch.start} إلى ${patch.end} مع ${patch.instructor} في ${patch.room}.`
    set(current => ({
      sessions: current.sessions.map(item => item.id === id ? { ...item, ...patch, history: [{ id: uid('h'), action: 'تعديل موعد الجلسة', reason, before, after, user: current.role, at: now() }, ...item.history] } : item),
      notifications: [{ id: uid('n'), title: 'تم تغيير موعد جلسة', detail: `${session.group} · ${patch.date} · ${patch.start}`, route: `/sessions/${id}`, read: false, at: 'الآن', tone: 'info' }, ...current.notifications],
      audit: [auditEvent('schedule', 'تم تعديل جلسة', `${session.group} · ${before} ← ${after} · السبب: ${reason}`, current.role, 'session', id), ...current.audit],
    }))
    return ok({ message, conflicts: [] })
  },

  markNotification: id => set(state => ({ notifications: state.notifications.map(item => item.id === id ? { ...item, read: true } : item) })),
  markAllNotifications: () => set(state => ({ notifications: state.notifications.map(item => ({ ...item, read: true })) })),
  recordTemplateUse: (templateId, studentId) => set(state => {
    const template = state.messageTemplates.find(item => item.id === templateId), student = state.students.find(item => item.id === studentId)
    return { audit: [auditEvent('message', 'تم تجهيز رسالة', `${template?.title}${student ? ` · ${student.name}` : ''}`, state.role, 'template', templateId), ...state.audit] }
  }),
  saveSettings: settings => set(state => {
    const next = can(state.role, 'settings.academy') ? settings : { ...state.settings, theme: settings.theme, density: settings.density }
    return { settings: next, audit: [auditEvent('settings', can(state.role, 'settings.academy') ? 'تم تحديث إعدادات الأكاديمية' : 'تم تحديث مظهر الحساب', can(state.role, 'settings.academy') ? next.academyName : `${next.theme} · ${next.density}`, state.role, 'settings'), ...state.audit] }
  }),
}), { name: 'nexvora-react-v1', version: 5, storage: createJSONStorage(() => typeof localStorage === 'undefined' ? fallbackStorage : localStorage), migrate: persisted => {const previous=persisted as Partial<AppState>;return{...initial(),...previous,users:previous.users?.length?previous.users:structuredClone(seed.users),ledger:previous.ledger?.length?previous.ledger:structuredClone(seed.ledger),executiveDecisions:previous.executiveDecisions?.length?previous.executiveDecisions:structuredClone(seed.executiveDecisions),loggedIn:false,currentTeacherId:undefined,currentUserId:'u-ops',currentUserName:'محمد أشرف'}}, partialize: state => { const { loggedIn: _loggedIn, ...rest } = state; return rest } }))
