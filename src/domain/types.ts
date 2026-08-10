export type Role = 'مدير التشغيل' | 'موظف المتابعة' | 'المدرس' | 'المحاسب'

export type Permission =
  | 'student.view' | 'student.create' | 'student.update'
  | 'group.view' | 'group.assign'
  | 'teacher.view' | 'teacher.create' | 'teacher.update' | 'teacher.assign' | 'teacher.schedule'
  | 'schedule.view' | 'schedule.edit'
  | 'attendance.view' | 'attendance.record'
  | 'payment.view' | 'payment.create' | 'payment.approve'
  | 'followup.view' | 'followup.create'
  | 'report.view' | 'report.export' | 'summary.view' | 'audit.view' | 'permission.view'
  | 'notification.view' | 'settings.academy'

export type Student = {
  id: string; code: string; name: string; phone: string; guardian: string
  group: string; course: string; packageName: string
  paid: number; total: number; due: string; status: 'نشط' | 'موقوف'
}

export type TeacherAvailability = { id: string; day: string; start: string; end: string }
export type Teacher = {
  id: string; code: string; name: string; phone: string; email?: string
  specialty: string; status: 'نشط' | 'غير نشط'; startDate?: string; notes?: string
  availability: TeacherAvailability[]; createdAt: string; updatedAt: string
}

export type Group = {
  id: string; name: string; course: string; instructor: string; room: string
  enrolled: number; capacity: number; schedule: string; status: 'نشطة' | 'مكتملة'
}

export type SessionHistory = { id: string; action: string; before?: string; after?: string; reason?: string; user: Role; at: string }
export type Session = {
  id: string; group: string; instructor: string; room: string; date: string; day: string
  start: string; end: string; status: 'قادمة' | 'اليوم' | 'مكتملة' | 'ملغاة'; history: SessionHistory[]
}

export type BusinessErrorCode =
  | 'permission_denied' | 'duplicate_student' | 'group_full' | 'group_not_found'
  | 'student_not_found' | 'session_not_found' | 'invalid_time' | 'schedule_conflict'
  | 'invalid_attendance' | 'invalid_payment' | 'payment_not_found' | 'rejection_reason_required'
  | 'teacher_not_found' | 'duplicate_teacher' | 'teacher_inactive' | 'outside_availability' | 'invalid_availability'

export type BusinessResult<T = undefined> =
  | { ok: true; value: T }
  | { ok: false; code: BusinessErrorCode; message: string; meta?: Record<string, unknown> }

export type ConflictType = 'teacher' | 'room' | 'group'
export type ScheduleConflict = { type: ConflictType; session: Session }

export type AttendanceStatus = 'حاضر' | 'غائب' | 'متأخر' | 'بعذر'
export type AttendanceRecord = { id: string; studentId: string; sessionId: string; group: string; status: AttendanceStatus; date: string; note: string; recordedBy: Role }
export type Followup = { id: string; studentId: string; method: string; result: string; date: string; note: string; escalated: boolean; createdBy: Role }

export type PaymentStatus = 'بانتظار المراجعة' | 'معتمدة' | 'مرفوضة'
export type PaymentProof = { name: string; type: string; size: number; dataUrl: string }
export type ReviewEvent = { id: string; title: string; user: Role; at: string }
export type PaymentSubmission = {
  id: string; studentId: string; amount: number; method: string; reference: string
  paymentDate: string; note: string; proof: PaymentProof; status: PaymentStatus
  createdAt: string; createdBy: Role; reviewedAt?: string; reviewedBy?: Role
  reviewNote?: string; history: ReviewEvent[]
}

export type AuditEvent = { id: string; type: string; title: string; detail: string; user: Role; at: string; entity?: string; entityId?: string }
export type Notification = { id: string; title: string; detail: string; route: string; read: boolean; at: string; tone: 'info'|'warning'|'danger'|'success' }
export type MessageTemplate = { id: string; title: string; category: 'سداد'|'حضور'|'موعد'|'ترحيب'; channel: 'WhatsApp'|'SMS'; body: string }
export type DemoState = 'populated'|'loading'|'empty'|'error'
export type AppSettings = { academyName: string; email: string; phone: string; density: 'comfortable'|'compact'; theme: 'light'|'dark' }
