import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { EmptyState } from './components/ui'
import { can } from './domain/permissions'
import type { Permission } from './domain/types'
import { useAppStore } from './store/useAppStore'
import { DashboardPage } from './pages/DashboardPage'
import { GroupDetailPage, GroupsPage, NewStudentPage, StudentEditPage, StudentProfilePage, StudentsPage } from './pages/StudentsPage'
import { AttendancePage, CalendarPage, SessionDetailPage, SessionEditPage } from './pages/CalendarPage'
import { PaymentFormPage, PaymentQueuePage, PaymentReviewPage, PaymentsPage } from './pages/PaymentsPage'
import { PermissionsPage, ReportsPage } from './pages/ReportsPage'
import { AuditPage, MessagesPage, NotificationsPage, OverdueDetailPage, OverduePage } from './pages/OperationsPage'
import { DemoStateBoundary, LoginPage, SettingsPage } from './pages/SystemPage'
import { EditTeacherPage, NewTeacherPage, NewTeacherSessionPage, TeacherProfilePage, TeachersPage } from './pages/TeachersPage'
import { SystemSummaryPage } from './pages/SystemSummaryPage'
import { canAccessGroup, canAccessSession, canAccessStudent } from './domain/access'

function Require({permission,children}:{permission:Permission;children:ReactNode}){const role=useAppStore(state=>state.role);return can(role,permission)?children:<section className="panel"><EmptyState title="ليس لديك صلاحية لهذه الشاشة" description={`الدور الحالي: ${role}`}/></section>}
function RequireOwned({kind,param='id',children}:{kind:'student'|'group'|'session';param?:string;children:ReactNode}){const params=useParams(),state=useAppStore(value=>value),id=params[param],context={role:state.role,currentTeacherId:state.currentTeacherId,teachers:state.teachers,groups:state.groups,sessions:state.sessions,students:state.students};if(state.role!=='المدرس')return children;const allowed=kind==='student'?canAccessStudent(context,id):kind==='group'?canAccessGroup(context,id):canAccessSession(context,id);return allowed?children:<section className="panel"><EmptyState title="هذا السجل خارج نطاق حسابك" description="يمكن للمدرس فتح طلابه ومجموعاته وحصصه فقط."/></section>}

export default function App(){const loggedIn=useAppStore(state=>state.loggedIn);if(!loggedIn)return <LoginPage/>;return <AppShell><DemoStateBoundary><Routes>
  <Route path="/" element={<DashboardPage/>}/>
  <Route path="/students" element={<Require permission="student.view"><StudentsPage/></Require>}/>
  <Route path="/students/new" element={<Require permission="student.create"><NewStudentPage/></Require>}/>
  <Route path="/students/:id/edit" element={<Require permission="student.update"><StudentEditPage/></Require>}/>
  <Route path="/students/:id" element={<Require permission="student.view"><RequireOwned kind="student"><StudentProfilePage/></RequireOwned></Require>}/>
  <Route path="/teachers" element={<Require permission="teacher.view"><TeachersPage/></Require>}/>
  <Route path="/teachers/new" element={<Require permission="teacher.create"><NewTeacherPage/></Require>}/>
  <Route path="/teachers/:id/edit" element={<Require permission="teacher.update"><EditTeacherPage/></Require>}/>
  <Route path="/teachers/:id/sessions/new" element={<Require permission="teacher.schedule"><NewTeacherSessionPage/></Require>}/>
  <Route path="/teachers/:id" element={<Require permission="teacher.view"><TeacherProfilePage/></Require>}/>
  <Route path="/groups" element={<Require permission="group.view"><GroupsPage/></Require>}/>
  <Route path="/groups/:id" element={<Require permission="group.view"><RequireOwned kind="group"><GroupDetailPage/></RequireOwned></Require>}/>
  <Route path="/calendar" element={<Require permission="schedule.view"><CalendarPage/></Require>}/>
  <Route path="/sessions/:id" element={<Require permission="schedule.view"><RequireOwned kind="session"><SessionDetailPage/></RequireOwned></Require>}/>
  <Route path="/sessions/:id/edit" element={<Require permission="schedule.edit"><SessionEditPage/></Require>}/>
  <Route path="/attendance" element={<Require permission="attendance.view"><AttendancePage/></Require>}/>
  <Route path="/attendance/:sessionId" element={<Require permission="attendance.record"><RequireOwned kind="session" param="sessionId"><AttendancePage/></RequireOwned></Require>}/>
  <Route path="/payments" element={<Require permission="payment.view"><PaymentsPage/></Require>}/>
  <Route path="/payments/new" element={<Require permission="payment.create"><PaymentFormPage/></Require>}/>
  <Route path="/payments/review" element={<Require permission="payment.approve"><PaymentQueuePage/></Require>}/>
  <Route path="/payments/review/:id" element={<Require permission="payment.approve"><PaymentReviewPage/></Require>}/>
  <Route path="/reports" element={<Require permission="report.view"><ReportsPage/></Require>}/>
  <Route path="/system-summary" element={<Require permission="summary.view"><SystemSummaryPage/></Require>}/>
  <Route path="/overdue" element={<Require permission="followup.view"><OverduePage/></Require>}/>
  <Route path="/overdue/:id" element={<Require permission="followup.view"><OverdueDetailPage/></Require>}/>
  <Route path="/messages" element={<Require permission="followup.view"><MessagesPage/></Require>}/>
  <Route path="/notifications" element={<Require permission="notification.view"><NotificationsPage/></Require>}/>
  <Route path="/audit" element={<Require permission="audit.view"><AuditPage/></Require>}/>
  <Route path="/permissions" element={<Require permission="permission.view"><PermissionsPage/></Require>}/>
  <Route path="/settings" element={<SettingsPage/>}/>
  <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></DemoStateBoundary></AppShell>}
