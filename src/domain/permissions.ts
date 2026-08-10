import type { Permission, Role } from './types'

export const rolePermissions: Record<Role, Permission[]> = {
  'مدير التشغيل': ['student.view','student.create','student.update','group.view','group.assign','teacher.view','teacher.create','teacher.update','teacher.assign','teacher.schedule','schedule.view','schedule.edit','attendance.view','attendance.record','payment.view','payment.create','payment.approve','followup.view','followup.create','report.view','report.export','summary.view','audit.view','permission.view','notification.view','settings.academy'],
  'موظف المتابعة': ['student.view','attendance.view','followup.view','followup.create','notification.view'],
  'المدرس': ['student.view','group.view','schedule.view','attendance.view','attendance.record','notification.view'],
  'المحاسب': ['student.view','payment.view','payment.create','payment.approve','notification.view'],
}

export const permissionLabels: Record<Permission, string> = {
  'student.view':'عرض الطلاب','student.create':'إضافة طالب','student.update':'تعديل طالب',
  'group.view':'عرض المجموعات','group.assign':'إسناد مجموعة','schedule.view':'عرض الجدول',
  'teacher.view':'عرض المدرسين','teacher.create':'إضافة مدرس','teacher.update':'تعديل المدرسين','teacher.assign':'إسناد المدرسين','teacher.schedule':'إدارة جداول المدرسين',
  'schedule.edit':'تعديل الجلسات','attendance.view':'عرض الحضور','attendance.record':'تسجيل الحضور',
  'payment.view':'عرض المالية','payment.create':'تسجيل دفعة','payment.approve':'اعتماد أو رفض دفعة',
  'followup.view':'عرض المتابعات','followup.create':'تسجيل متابعة','report.view':'عرض التقارير',
  'report.export':'تصدير التقارير','summary.view':'عرض ملخص النظام','audit.view':'عرض سجل التدقيق','permission.view':'عرض الصلاحيات',
  'notification.view':'عرض الإشعارات','settings.academy':'تعديل إعدادات الأكاديمية',
}

export const can = (role: Role, permission: Permission) => rolePermissions[role].includes(permission)
