import type { ConflictType, ScheduleConflict, Session, TeacherAvailability } from './types'

export const normalizePhone = (value: string) => value.replace(/\D/g, '')

export const timeToMinutes = (value: string) => {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*([صم])$/)
  if (!match) return Number.NaN
  let hour = Number(match[1]) % 12
  if (match[3] === 'م') hour += 12
  return hour * 60 + Number(match[2])
}

export const sessionsOverlap = (startA: string, endA: string, startB: string, endB: string) => {
  const aStart = timeToMinutes(startA), aEnd = timeToMinutes(endA)
  const bStart = timeToMinutes(startB), bEnd = timeToMinutes(endB)
  return [aStart, aEnd, bStart, bEnd].every(Number.isFinite) && aStart < bEnd && bStart < aEnd
}

export const isWithinAvailability = (availability: TeacherAvailability[], day: string, start: string, end: string) => {
  if (!availability.length) return true
  const startMinutes = timeToMinutes(start), endMinutes = timeToMinutes(end)
  return availability.some(block => block.day === day && timeToMinutes(block.start) <= startMinutes && timeToMinutes(block.end) >= endMinutes)
}

export const validateAvailabilityBlocks = (blocks: TeacherAvailability[]) => {
  for (const block of blocks) {
    if (!Number.isFinite(timeToMinutes(block.start)) || timeToMinutes(block.end) <= timeToMinutes(block.start)) return false
    if (blocks.some(other => other.id !== block.id && other.day === block.day && sessionsOverlap(block.start, block.end, other.start, other.end))) return false
  }
  return true
}

export const findScheduleConflicts = (
  sessions: Session[],
  candidate: Pick<Session, 'id' | 'date' | 'start' | 'end' | 'instructor' | 'room' | 'group'>,
) => {
  const conflicts: ScheduleConflict[] = []
  for (const session of sessions) {
    if (session.id === candidate.id || session.date !== candidate.date || session.status === 'ملغاة') continue
    if (!sessionsOverlap(candidate.start, candidate.end, session.start, session.end)) continue
    const types: ConflictType[] = []
    if (session.instructor === candidate.instructor) types.push('teacher')
    if (session.room === candidate.room) types.push('room')
    if (session.group === candidate.group) types.push('group')
    types.forEach(type => conflicts.push({ type, session }))
  }
  return conflicts
}

export const conflictMessage = ({ type, session }: ScheduleConflict) => {
  if (type === 'teacher') return `لا يمكن حفظ الموعد لأن المدرس لديه حصة أخرى (${session.group}) من ${session.start} إلى ${session.end}.`
  if (type === 'room') return `لا يمكن حفظ الموعد لأن ${session.room} محجوزة للمجموعة ${session.group} من ${session.start} إلى ${session.end}.`
  return `لا يمكن حفظ الموعد لأن المجموعة لديها حصة أخرى من ${session.start} إلى ${session.end}.`
}
