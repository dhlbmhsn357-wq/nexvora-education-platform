# LifePilot AI — Event Storming Baseline

**Status:** Proposed domain-discovery artifact; requires Product Owner approval before aggregate design.  
**Scope:** Version 1 personal consumer product only.  
**Source:** Approved Product Charter and ADRs. No implementation decisions are implied beyond those documents.

## 1. Workshop conventions

- **Commands** are imperative requests. They may be rejected by authorization or business rules.
- **Domain events** are past-tense facts emitted after a successful state change inside an aggregate.
- **Integration events** are versioned, publishable facts delivered through a reliable outbox after commit. They are not emitted directly from controllers.
- **Policies** react to events and issue a command, update a projection, queue a job, or notify a user.
- **AI events** record an approved AI request or result. AI output is a proposal, never an authoritative business rule, calculation, schedule, or permission decision.
- **Proposed** marks behavior inferred from a module name or product goal that has not yet been separately approved. It must be validated before implementation.
- All timestamps are UTC. User-visible time uses the approved profile locale and time-zone design.

## 2. Cross-domain event flow

```text
UserRegistered
  -> ProfileCreated
  -> EmailVerificationRequested
  -> EmailVerified
  -> ProfileCompleted
  -> GoalCreated / CourseEnrolled / PlanCreated
  -> Activity or SessionCompleted
  -> ProgressRecorded
  -> DashboardProjectionUpdated
  -> InAppNotificationCreated (when policy conditions are met)
```

The flow is not a required linear journey. Each originating module owns its aggregate and publishes integration events; Progress Tracking and Dashboard consume facts rather than directly changing another module's aggregate.

## 3. Cross-cutting ownership and controls

| Concern | Baseline rule |
|---|---|
| User ownership | Every user-owned aggregate carries an owner account identifier. Future tenant isolation must be possible without exposing tenant concepts in Version 1 UI. |
| Authorization | Commands validate actor identity, role, ownership, entitlement, and feature-flag policy before a state change. |
| Audit | Authentication, sensitive-data access, administrative actions, applied AI proposals, entitlement changes, and destructive actions produce audit records. |
| Notifications | In-app history is durable; SignalR is delivery only. Email is a background job. |
| Long-running work | Upload processing, AI calls, email, projections where asynchronous, and retries run outside HTTP requests through approved infrastructure. |
| Idempotency | External callbacks, jobs, and integration-event consumers must tolerate duplicate delivery. |
| Data privacy | Events, logs, and integration payloads must contain the minimum necessary data and no passwords, tokens, or unapproved sensitive content. |

---

# 4. Module Event Storming

## 4.1 User Profile

### Aggregates and domain services

- **Aggregates:** Account Profile, User Preferences, Consent Record (proposed), Account Lifecycle.
- **Domain services:** Profile completeness evaluator; locale/time-zone validator; account deletion eligibility evaluator (proposed).
- **External services:** Google OAuth, email delivery service, Azure Blob Storage for approved profile media only.
- **AI services:** None. Profile changes are deterministic user actions.

### Actors and commands

| Actors | Commands |
|---|---|
| Visitor | Register Account, Sign In with Google, Request Password Reset |
| User | Verify Email, Complete Profile, Update Profile, Update Locale, Update Time Zone, Update Preferences, Request Data Export, Request Account Deletion |
| Admin / Super Admin | View authorized support record, Disable Account, Restore Account where policy permits |
| System | Create Profile, Expire Reset Token, Execute Approved Deletion |

### Domain events

- `UserRegistered`
- `GoogleAccountLinked`
- `ProfileCreated`
- `EmailVerificationRequested`
- `EmailVerified`
- `ProfileCompleted`
- `ProfileUpdated`
- `UserLocaleChanged`
- `UserTimeZoneChanged`
- `UserPreferencesUpdated`
- `DataExportRequested`
- `DataExportPrepared`
- `AccountDeletionRequested`
- `AccountDeletionApproved` (proposed policy-dependent)
- `AccountDeleted`
- `AccountDisabled`
- `AccountRestored`

### Policies and business rules

- Registration requires a unique normalized email unless a verified account-linking policy permits Google association.
- Email/password users cannot access verified-only features until email verification succeeds; exact feature list is pending.
- A user may change only their own profile; support access requires approved, audited policy.
- Locale must be Arabic or English in Version 1; direction is derived from locale.
- Time zone must use an approved IANA or Windows mapping strategy; final standard is pending.
- Deletion, export, retention, and minor-consent requirements remain unresolved and block implementation of those commands.
- Profile media is excluded until upload validation, malware scanning, and retention policy are approved.

### Read models, integrations, and long-running processes

- **Read models:** My Profile, Account Security Status, Profile Completeness, Admin Account Summary, Privacy Requests.
- **Integration events:** `profile.created.v1`, `profile.completed.v1`, `profile.preferences-updated.v1`, `account.deleted.v1`.
- **Long-running processes:** verification email delivery; password-reset email delivery; data export preparation; account-deletion workflow.
- **Background jobs:** token expiry cleanup, export generation, deletion execution after approved retention window.
- **Notifications:** verification email, reset email, export-ready in-app/email notification, deletion-status notification.
- **Scheduled tasks:** expiration cleanup only; retention schedule is pending policy approval.
- **AI events:** none.

### Event timeline

```text
User Registered
  ↓
Profile Created
  ↓
Email Verification Requested
  ↓
Email Verified
  ↓
Profile Completed or Updated
  ↓
Profile Read Models Updated
```

---

## 4.2 Goals System

### Aggregates and domain services

- **Aggregates:** Goal, Goal Milestone, Goal Progress Record (ownership boundary to be validated against Progress Tracking).
- **Domain services:** Goal state-transition policy; goal progress evaluator; goal archival policy.
- **External services:** None required in Version 1.
- **AI services:** AI Gateway for approved explanation, recommendation, and proposed goal refinement only.

### Actors and commands

| Actors | Commands |
|---|---|
| User | Create Goal, Update Goal, Add Milestone, Update Milestone, Record Goal Progress, Pause Goal, Resume Goal, Complete Goal, Archive Goal, Request Goal Recommendation, Apply Proposed Goal Change |
| System | Mark Goal Overdue when deterministic due-date policy applies (proposed) |
| Admin / Super Admin | No direct goal editing; authorized support action only if approved |

### Domain events

- `GoalCreated`
- `GoalUpdated`
- `GoalMilestoneAdded`
- `GoalMilestoneUpdated`
- `GoalProgressRecorded`
- `GoalPaused`
- `GoalResumed`
- `GoalCompleted`
- `GoalArchived`
- `GoalOverdueDetected` (proposed)
- `GoalRecommendationRequested`
- `GoalRecommendationGenerated`
- `GoalChangeProposalApplied`
- `GoalChangeProposalRejected`

### Policies and business rules

- Only the owning user may change a goal.
- A goal must have an approved lifecycle; proposed states are Draft, Active, Paused, Completed, Archived, pending Product Owner confirmation.
- Archived or completed goals cannot accept progress unless an explicit reopen policy is approved.
- Progress validation and completion determination are deterministic C# rules; AI may recommend but cannot set progress or complete a goal.
- Due-date notification thresholds, recurrence, and automatic overdue behavior are not approved and must not be assumed.
- Applying an AI proposal requires deterministic validation and an approved confirmation model.

### Read models, integrations, and long-running processes

- **Read models:** Goal List, Goal Detail, Active Goals, Goal Timeline, Goal Progress Summary.
- **Integration events:** `goal.created.v1`, `goal.progress-recorded.v1`, `goal.completed.v1`, `goal.archived.v1`.
- **Long-running processes:** AI recommendation generation.
- **Background jobs:** optional due-date evaluation after approval.
- **Notifications:** goal milestones or due reminders only after notification policy is approved.
- **Scheduled tasks:** proposed daily due-date evaluation; not approved.
- **AI events:** `GoalRecommendationRequested`, `GoalRecommendationGenerated`, `GoalChangeProposalApplied`.

### Event timeline

```text
Goal Created
  ↓
Milestone Added
  ↓
Goal Progress Recorded
  ↓
Goal Read Model Updated
  ↓
Progress Recorded
  ↓
Dashboard Projection Updated
  ↓
Goal Completed or Archived
```

---

## 4.3 Study AI

### Aggregates and domain services

- **Aggregates:** Study Workspace, Study Material, Study Session, Study Plan Proposal (proposed).
- **Domain services:** Study-material access policy; deterministic study-progress recorder; AI proposal validator.
- **External services:** Azure Blob Storage; optional OCR provider is **not selected**; AI Gateway.
- **AI services:** summarization, explanation, question answering, content generation, recommendations, and proposed modifications to an existing user plan.

### Actors and commands

| Actors | Commands |
|---|---|
| User | Create Study Workspace, Upload Study Material, Remove Study Material, Request Material Processing, Request Summary, Ask Study Question, Request Study Recommendation, Create Study Session, Complete Study Session, Apply Study Plan Proposal |
| System | Validate Upload, Process Approved Material, Record Processing Failure |
| AI Gateway | Generate Requested AI Response |

### Domain events

- `StudyWorkspaceCreated`
- `StudyMaterialUploadRequested`
- `StudyMaterialUploaded`
- `StudyMaterialRejected`
- `StudyMaterialProcessingRequested`
- `StudyMaterialProcessed`
- `StudyMaterialProcessingFailed`
- `StudySummaryRequested`
- `StudySummaryGenerated`
- `StudyQuestionAsked`
- `StudyQuestionAnswered`
- `StudyRecommendationRequested`
- `StudyRecommendationGenerated`
- `StudyPlanProposalGenerated`
- `StudyPlanProposalApplied`
- `StudySessionStarted`
- `StudySessionCompleted`

### Policies and business rules

- A material belongs to one authorized user workspace unless sharing is later approved.
- File type, size, malware scanning, OCR, retention, and deletion policy must be approved before upload implementation.
- OCR is not an approved external provider; no OCR behavior may be implemented until selected.
- AI is invoked only by explicit approved user use cases and receives only minimum necessary material content.
- AI summaries and answers are derived content, not authoritative educational facts.
- Study completion is recorded by user action or deterministic workflow, not AI inference.

### Read models, integrations, and long-running processes

- **Read models:** Study Workspace Detail, Material Library, Processing Status, Summary Library, Study Session History.
- **Integration events:** `study.material-processed.v1`, `study.session-completed.v1`, `study.plan-proposal-applied.v1`.
- **Long-running processes:** blob upload validation, malware scan, optional OCR, text extraction, AI generation.
- **Background jobs:** material processing and AI retries with bounded retry policy.
- **Notifications:** material processing completed/failed; requested content ready.
- **Scheduled tasks:** none confirmed.
- **AI events:** all requested/generated events listed above; model/provider metadata must be auditable without storing unrestricted prompts.

### Event timeline

```text
Study Workspace Created
  ↓
Study Material Uploaded
  ↓
Material Processed or Processing Failed
  ↓
Summary / Answer / Recommendation Requested
  ↓
AI Result Generated
  ↓
Study Session Completed
  ↓
Study Progress Recorded
  ↓
Dashboard Projection Updated
```

---

## 4.4 External Courses

### Aggregates and domain services

- **Aggregates:** External Course, Course Enrollment, Course Progress Record.
- **Domain services:** Course URL validator; enrollment ownership policy; progress evaluator.
- **External services:** External course platforms are not yet selected; URL metadata fetching is not approved.
- **AI services:** AI Gateway for optional course explanation and recommendation only.

### Actors and commands

| Actors | Commands |
|---|---|
| User | Add External Course, Update External Course, Enroll in Course, Update Course Progress, Complete Course, Archive Course, Request Course Recommendation |
| System | Validate Course Reference |

### Domain events

- `ExternalCourseAdded`
- `ExternalCourseUpdated`
- `CourseEnrollmentCreated`
- `CourseProgressRecorded`
- `CourseCompleted`
- `CourseArchived`
- `CourseRecommendationRequested`
- `CourseRecommendationGenerated`

### Policies and business rules

- A course reference and enrollment belong to the owning user.
- The platform tracks user-declared external courses; it does not assert partnership or completion verification by a third party.
- Automatic import, scraping, OAuth connection, metadata retrieval, certificates, and provider synchronization are excluded until a named provider and terms are approved.
- Course progress is deterministic user-entered or approved imported data; AI cannot assert completion.

### Read models, integrations, and long-running processes

- **Read models:** Course Library, Active Enrollments, Course Detail, Course Progress Summary.
- **Integration events:** `course.enrolled.v1`, `course.progress-recorded.v1`, `course.completed.v1`.
- **Long-running processes:** none confirmed; external import is pending.
- **Background jobs / scheduled tasks:** none confirmed.
- **Notifications:** optional course reminders are pending policy approval.
- **AI events:** `CourseRecommendationRequested`, `CourseRecommendationGenerated`.

### Event timeline

```text
External Course Added
  ↓
Course Enrollment Created
  ↓
Course Progress Recorded
  ↓
Course Completed or Archived
  ↓
Progress and Dashboard Projections Updated
```

---

## 4.5 Nutrition AI

### Aggregates and domain services

- **Aggregates:** Nutrition Profile, Meal Record, Nutrition Plan (proposed), Nutrition Goal Link (proposed).
- **Domain services:** measurement validation; deterministic nutrition record policy; safety-disclaimer policy.
- **External services:** AI Gateway. No food database, health-device integration, or medical provider is approved.
- **AI services:** explanation, content generation, recommendations, and proposed modifications to an existing plan.

### Actors and commands

| Actors | Commands |
|---|---|
| User | Create or Update Nutrition Profile, Record Meal, Update Meal Record, Remove Meal Record, Request Nutrition Recommendation, Create Nutrition Plan, Request Nutrition Plan Modification, Apply Nutrition Plan Proposal |
| System | Validate Measurement and Plan State |

### Domain events

- `NutritionProfileCreated`
- `NutritionProfileUpdated`
- `MealRecorded`
- `MealRecordUpdated`
- `MealRecordRemoved`
- `NutritionPlanCreated`
- `NutritionPlanUpdated`
- `NutritionRecommendationRequested`
- `NutritionRecommendationGenerated`
- `NutritionPlanModificationProposed`
- `NutritionPlanProposalApplied`
- `NutritionPlanProposalRejected`

### Policies and business rules

- Nutrition data is sensitive personal data and is private to the owner by default.
- The product must present approved safety/disclaimer language; it must not represent AI output as medical diagnosis or professional treatment.
- Numeric calculations, targets, and validation rules must be deterministic C# logic based on approved business requirements; AI cannot calculate authoritative nutritional values.
- Food database selection, allergy handling, medical exclusions, age restrictions, and units require explicit product and legal decisions.
- An AI plan modification is a proposal and must pass deterministic validation and the approved confirmation workflow.

### Read models, integrations, and long-running processes

- **Read models:** Nutrition Profile, Meal History, Nutrition Plan Detail, Nutrition Progress Summary.
- **Integration events:** `nutrition.meal-recorded.v1`, `nutrition.plan-updated.v1`, `nutrition.plan-proposal-applied.v1`.
- **Long-running processes:** AI recommendations and plan-proposal generation.
- **Background jobs:** AI retry and approved reminder processing only.
- **Notifications:** plan/reminder notification rules are pending.
- **Scheduled tasks:** none confirmed.
- **AI events:** recommendation and plan-proposal events above, including policy-rejection events when applicable.

### Event timeline

```text
Nutrition Profile Created or Updated
  ↓
Meal Recorded
  ↓
Nutrition Progress Recorded
  ↓
Optional AI Recommendation Generated
  ↓
Nutrition and Dashboard Projections Updated
```

---

## 4.6 Gym AI

### Aggregates and domain services

- **Aggregates:** Fitness Profile, Workout Plan, Workout Session, Exercise Record.
- **Domain services:** workout state-transition policy; measurement validation; safety-disclaimer policy.
- **External services:** AI Gateway. Device, wearable, and gym-platform integrations are not approved.
- **AI services:** explanation, exercise-content generation, recommendations, and proposed modification of an existing workout plan.

### Actors and commands

| Actors | Commands |
|---|---|
| User | Create or Update Fitness Profile, Create Workout Plan, Update Workout Plan, Start Workout Session, Record Exercise, Complete Workout Session, Request Workout Recommendation, Request Workout Plan Modification, Apply Workout Plan Proposal |
| System | Validate Workout Transition |

### Domain events

- `FitnessProfileCreated`
- `FitnessProfileUpdated`
- `WorkoutPlanCreated`
- `WorkoutPlanUpdated`
- `WorkoutSessionStarted`
- `ExerciseRecorded`
- `WorkoutSessionCompleted`
- `WorkoutRecommendationRequested`
- `WorkoutRecommendationGenerated`
- `WorkoutPlanModificationProposed`
- `WorkoutPlanProposalApplied`
- `WorkoutPlanProposalRejected`

### Policies and business rules

- Fitness and workout history is sensitive personal data and owner-private by default.
- AI must not diagnose injury, prescribe medical treatment, calculate authoritative measurements, or independently alter a plan.
- Workout completion is a user-recorded fact; AI cannot infer it as authoritative.
- Exercise catalog, equipment model, health warnings, age restrictions, and plan calculations require approved product specifications.
- A plan proposal must pass deterministic validation before it can be applied.

### Read models, integrations, and long-running processes

- **Read models:** Fitness Profile, Active Workout Plan, Workout Session Detail, Workout History, Fitness Progress Summary.
- **Integration events:** `workout.session-completed.v1`, `workout.plan-updated.v1`, `workout.plan-proposal-applied.v1`.
- **Long-running processes:** AI generation.
- **Background jobs / scheduled tasks:** approved reminders only; no automatic workout scheduling by AI.
- **Notifications:** user-configured reminders are pending requirements.
- **AI events:** recommendation and plan-proposal events above.

### Event timeline

```text
Fitness Profile Created
  ↓
Workout Plan Created
  ↓
Workout Session Started
  ↓
Exercise Recorded
  ↓
Workout Session Completed
  ↓
Fitness Progress Recorded
  ↓
Dashboard Projection Updated
```

---

## 4.7 Islamic AI

### Aggregates and domain services

- **Aggregates:** Spiritual Profile (proposed), Prayer Progress Record, Islamic Learning Item (proposed), Spiritual Plan (proposed).
- **Domain services:** deterministic prayer-time/calculation service if approved; prayer-progress policy; culturally respectful content policy.
- **External services:** AI Gateway. Prayer-time provider or calculation library is **not selected**.
- **AI services:** explanation, question answering, content generation, recommendation, and proposed modification to an existing spiritual plan.

### Actors and commands

| Actors | Commands |
|---|---|
| User | Configure Spiritual Preferences, Record Prayer Progress, Update Prayer Progress, Request Islamic Explanation, Ask Islamic Question, Request Spiritual Recommendation, Create Spiritual Plan, Apply Spiritual Plan Proposal |
| System | Determine Prayer-Time Data only through approved deterministic service |

### Domain events

- `SpiritualProfileConfigured`
- `PrayerProgressRecorded`
- `PrayerProgressUpdated`
- `IslamicQuestionAsked`
- `IslamicAnswerGenerated`
- `IslamicExplanationRequested`
- `IslamicExplanationGenerated`
- `SpiritualRecommendationRequested`
- `SpiritualRecommendationGenerated`
- `SpiritualPlanCreated`
- `SpiritualPlanModificationProposed`
- `SpiritualPlanProposalApplied`
- `PrayerTimeDataUpdated` (only if a deterministic provider/calculation is approved)

### Policies and business rules

- Prayer progress is self-reported personal data; it must not be visible to other users.
- AI must not claim religious authority, issue binding rulings, or calculate prayer times.
- Any prayer-time feature requires an approved deterministic calculation method or named provider, location consent, calculation convention, and user override policy.
- Content must use an approved safety and cultural-respect policy, including a response path when the AI cannot answer responsibly.
- AI modifications remain proposals and require deterministic validation and approved confirmation.

### Read models, integrations, and long-running processes

- **Read models:** Spiritual Preferences, Prayer Progress Calendar, Spiritual Plan, Islamic Content History.
- **Integration events:** `spiritual.prayer-progress-recorded.v1`, `spiritual.plan-updated.v1`.
- **Long-running processes:** AI answer/explanation generation; prayer-time refresh only if approved.
- **Background jobs:** approved reminder delivery; optional deterministic prayer-time refresh.
- **Scheduled tasks:** all prayer notifications and timing policies are pending product approval.
- **Notifications:** none may be sent until timing, consent, and locale behavior are approved.
- **AI events:** question, explanation, recommendation, and plan-proposal events above.

### Event timeline

```text
Spiritual Preferences Configured
  ↓
Prayer Progress Recorded
  ↓
Optional Islamic Question Asked
  ↓
AI Answer Generated
  ↓
Spiritual Progress Projection Updated
  ↓
Dashboard Projection Updated
```

---

## 4.8 Language Learning

### Aggregates and domain services

- **Aggregates:** Language Learning Profile, Learning Plan, Learning Session, Vocabulary Item (proposed).
- **Domain services:** language-level validation; learning-progress policy; content-progression evaluator.
- **External services:** AI Gateway. Dictionary, speech, translation, and assessment providers are not selected.
- **AI services:** explanation, content generation, question answering, recommendation, and proposal to modify an existing learning plan.

### Actors and commands

| Actors | Commands |
|---|---|
| User | Configure Learning Profile, Create Learning Plan, Update Learning Plan, Start Learning Session, Complete Learning Session, Add Vocabulary Item, Mark Vocabulary Progress, Request Language Explanation, Request Learning Recommendation, Apply Learning Plan Proposal |
| System | Validate Learning Plan Transition |

### Domain events

- `LanguageLearningProfileConfigured`
- `LearningPlanCreated`
- `LearningPlanUpdated`
- `LearningSessionStarted`
- `LearningSessionCompleted`
- `VocabularyItemAdded`
- `VocabularyProgressRecorded`
- `LanguageExplanationRequested`
- `LanguageExplanationGenerated`
- `LearningRecommendationRequested`
- `LearningRecommendationGenerated`
- `LearningPlanModificationProposed`
- `LearningPlanProposalApplied`

### Policies and business rules

- A learning plan and its activity belong to the owner.
- Progress is derived from deterministic approved rules; AI may explain or recommend but cannot assign authoritative proficiency.
- Placement tests, speech evaluation, translation, external dictionaries, streak definitions, and spaced-repetition algorithms require specific approval before implementation.
- AI plan proposals require deterministic validation and the approved user-confirmation workflow.

### Read models, integrations, and long-running processes

- **Read models:** Learning Profile, Active Learning Plan, Session History, Vocabulary Review List, Learning Progress Summary.
- **Integration events:** `language.session-completed.v1`, `language.vocabulary-progress-recorded.v1`, `language.plan-proposal-applied.v1`.
- **Long-running processes:** AI content generation and explanation.
- **Background jobs / scheduled tasks:** vocabulary-review reminders are pending algorithm and notification approval.
- **Notifications:** none confirmed.
- **AI events:** explanation, recommendation, and plan-proposal events above.

### Event timeline

```text
Learning Profile Configured
  ↓
Learning Plan Created
  ↓
Learning Session Completed
  ↓
Vocabulary Progress Recorded
  ↓
Learning Progress Updated
  ↓
Dashboard Projection Updated
```

---

## 4.9 Life Planner

### Aggregates and domain services

- **Aggregates:** Life Plan, Daily Plan, Plan Item, Plan Template (proposed).
- **Domain services:** deterministic plan-item transition policy; conflict validator; plan-modification validator.
- **External services:** AI Gateway. Calendar integration is not approved.
- **AI services:** planning assistance, explanation, recommendation, content generation, and proposed modification of an existing plan.

### Actors and commands

| Actors | Commands |
|---|---|
| User | Create Plan, Create Daily Plan, Add Plan Item, Update Plan Item, Reorder Plan Item, Mark Plan Item Complete, Skip Plan Item, Remove Plan Item, Request Plan Recommendation, Request Plan Modification, Apply Plan Proposal |
| System | Roll Forward Approved Incomplete Items (proposed) |

### Domain events

- `LifePlanCreated`
- `DailyPlanCreated`
- `PlanItemAdded`
- `PlanItemUpdated`
- `PlanItemReordered`
- `PlanItemCompleted`
- `PlanItemSkipped`
- `PlanItemRemoved`
- `PlanRecommendationRequested`
- `PlanRecommendationGenerated`
- `PlanModificationProposed`
- `PlanProposalApplied`
- `PlanProposalRejected`
- `IncompletePlanItemsRolledForward` (proposed)

### Policies and business rules

- Only the owner may mutate a personal plan.
- AI never schedules independently. It may propose a modification only in response to an approved user request.
- Scheduling, conflict resolution, priorities, recurrence, time blocks, rollover, and calendar synchronization require explicit requirements; none may be silently inferred.
- Completion and skip states are user/deterministic actions, not AI conclusions.
- AI proposals are validated by deterministic C# rules before application.

### Read models, integrations, and long-running processes

- **Read models:** Today View, Daily Plan Detail, Upcoming Plans, Plan Item Timeline, Planning History.
- **Integration events:** `planner.daily-plan-created.v1`, `planner.plan-item-completed.v1`, `planner.plan-proposal-applied.v1`.
- **Long-running processes:** AI proposal generation.
- **Background jobs:** optional deterministic rollover and reminders after approval.
- **Scheduled tasks:** no AI scheduling; user-approved deterministic reminder evaluation is pending.
- **Notifications:** in-app/email reminders only after user consent and schedule policy are approved.
- **AI events:** recommendation and plan-proposal events above.

### Event timeline

```text
Daily Plan Created
  ↓
Plan Item Added
  ↓
Optional AI Plan Proposal Generated
  ↓
Proposal Applied by Authorized Workflow
  ↓
Plan Item Completed or Skipped
  ↓
Progress and Dashboard Projections Updated
```

---

## 4.10 Progress Tracking

### Aggregates and domain services

- **Aggregates:** Progress Ledger, Progress Metric Definition (proposed), User Progress Snapshot (projection versus aggregate to be decided).
- **Domain services:** deterministic progress-calculation service; metric validation; aggregation boundary policy.
- **External services:** None required.
- **AI services:** AI may explain a user-visible progress summary or recommend; it cannot calculate or write authoritative progress.

### Actors and commands

| Actors | Commands |
|---|---|
| System | Record Progress Fact, Rebuild Progress Projection, Reconcile Progress Projection |
| User | View Progress, Correct a User-Entered Source Record through its owning module |
| Admin / Super Admin | Run authorized repair/rebuild operation with audit |

### Domain events

- `ProgressFactRecorded`
- `ProgressMetricUpdated`
- `ProgressSummaryUpdated`
- `ProgressProjectionRebuilt`
- `ProgressDiscrepancyDetected`
- `ProgressDiscrepancyResolved`
- `ProgressExplanationRequested`
- `ProgressExplanationGenerated`

### Policies and business rules

- Progress Tracking consumes approved source facts from owning modules; it must not become a second source of truth for goals, meals, sessions, or plan items.
- Calculation is deterministic C# logic using approved metric definitions. AI may not calculate authoritative values.
- A source correction must originate in the owning aggregate and produce a new fact or correction event; direct mutation of derived progress is prohibited except audited repair procedures.
- Metric definitions, aggregation periods, correction semantics, and progress scoring are not yet approved and must be specified before implementation.

### Read models, integrations, and long-running processes

- **Read models:** Daily/Weekly/Monthly Progress, Area Progress Summary, Goal Progress Summary, Activity Timeline.
- **Integration events consumed:** goal, study, course, nutrition, workout, prayer, language, and planner completion/progress facts.
- **Integration events published:** `progress.summary-updated.v1`, `progress.discrepancy-detected.v1`.
- **Long-running processes:** projection rebuild and reconciliation.
- **Background jobs:** reconciliation/rebuild, only with audit and idempotency.
- **Scheduled tasks:** period rollups after metric definitions are approved.
- **Notifications:** progress milestones are pending product rules.
- **AI events:** `ProgressExplanationRequested`, `ProgressExplanationGenerated`.

### Event timeline

```text
Source Module Activity Completed
  ↓
Integration Event Delivered
  ↓
Progress Fact Recorded
  ↓
Progress Summary Updated
  ↓
Dashboard Projection Updated
  ↓
Optional Progress Explanation Generated
```

---

## 4.11 Dashboard

### Aggregates and domain services

- **Aggregates:** Dashboard Preferences (proposed). Dashboard metrics are primarily read-model projections, not a business aggregate.
- **Domain services:** dashboard composition policy; authorization-aware widget selection.
- **External services:** None required.
- **AI services:** optional approved summary/explanation through AI Gateway; no calculation or authoritative dashboard updates.

### Actors and commands

| Actors | Commands |
|---|---|
| User | View Dashboard, Update Dashboard Preferences, Request Dashboard Explanation |
| System | Refresh Dashboard Projection, Rebuild Dashboard Projection |
| Admin / Super Admin | View operational dashboards only under separate authorization |

### Domain events

- `DashboardPreferencesUpdated`
- `DashboardProjectionUpdated`
- `DashboardProjectionRebuilt`
- `DashboardDataUnavailable`
- `DashboardExplanationRequested`
- `DashboardExplanationGenerated`

### Policies and business rules

- The dashboard consumes authorized user-specific read models; it does not own source-of-truth business facts.
- Every widget must be authorization-, entitlement-, feature-flag-, locale-, and privacy-aware.
- Dashboard values must trace to source facts or deterministic progress rules. AI cannot calculate or silently alter them.
- Widget catalog, default layout, freshness target, and premium-widget policy are not approved.

### Read models, integrations, and long-running processes

- **Read models:** Personal Dashboard, Today Summary, Progress Widgets, Notification Feed, Dashboard Preferences.
- **Integration events consumed:** all approved module progress and notification events.
- **Integration events published:** none required; dashboard refresh events are internal projection events unless future consumers justify publication.
- **Long-running processes:** projection rebuild if asynchronous.
- **Background jobs / scheduled tasks:** refresh/reconciliation only after freshness requirements are approved.
- **Notifications:** displays durable in-app notifications; does not itself send them.
- **AI events:** dashboard explanation events only.

### Event timeline

```text
Source Fact Published
  ↓
Authorized Dashboard Projection Updated
  ↓
User Views Dashboard
  ↓
Optional Dashboard Explanation Requested
  ↓
AI Explanation Generated
```

---

## 4.12 AI Copilot

### Aggregates and domain services

- **Aggregates:** Copilot Conversation or Session (retention model pending), AI Request Record, Applied Proposal Record.
- **Domain services:** AI capability authorization; prompt-data minimization; proposal validation and audit policy; quota/entitlement policy.
- **External services:** AI Gateway, OpenAI, Gemini, Claude.
- **AI services:** provider-independent approved capability execution.

### Actors and commands

| Actors | Commands |
|---|---|
| User | Start Copilot Session, Ask Copilot Question, Request Summary, Request Recommendation, Request Content Generation, Request Existing Plan Modification, Apply Copilot Proposal, Reject Copilot Proposal, Delete Copilot History if retention policy allows |
| System | Authorize AI Capability, Redact Request, Select Approved Provider, Record AI Result, Enforce Quota |
| Admin / Super Admin | Manage approved provider configuration and feature policy through audited controls |

### Domain events

- `CopilotSessionStarted`
- `CopilotQuestionSubmitted`
- `AIRequestAuthorized`
- `AIRequestRejectedByPolicy`
- `AIRequestRedacted`
- `AIProviderSelected`
- `AIResponseGenerated`
- `AIResponseFailed`
- `AIQuotaExceeded`
- `AIProposalGenerated`
- `AIProposalApplied`
- `AIProposalRejected`
- `CopilotSessionDeleted`

### Policies and business rules

- Every request is scoped to the authenticated user, permitted feature, entitlement, and approved data set.
- The gateway must not send more personal data than required for the user-requested purpose.
- AI cannot calculate, schedule independently, create business rules, grant access, or directly write business state.
- A plan-modification proposal must name its target aggregate and be validated by that aggregate's deterministic command before application.
- Provider fallback, model choice, cost limits, request limits, content safety policy, and conversation retention require approval before implementation.
- AI results are advisory and must expose a safe failure state when unavailable or rejected.

### Read models, integrations, and long-running processes

- **Read models:** Copilot Session History (only if retention is approved), AI Request Status, User AI Usage, Proposal Review.
- **Integration events:** `ai.response-generated.v1`, `ai.response-failed.v1`, `ai.proposal-applied.v1`, with minimized payloads and provider-neutral metadata.
- **Long-running processes:** provider call, retry/fallback, safety processing, usage accounting.
- **Background jobs:** asynchronous generation only when the UX supports it; retry and reconciliation must be bounded and idempotent.
- **Scheduled tasks:** quota reset only after entitlement policy defines the period.
- **Notifications:** asynchronous result-ready notification is permitted only for an explicitly requested operation.
- **AI events:** all events in this module are AI governance events and must be auditable.

### Event timeline

```text
Copilot Session Started
  ↓
Question or Proposal Request Submitted
  ↓
AI Request Authorized and Redacted
  ↓
Provider Selected
  ↓
AI Response or Failure Recorded
  ↓
Optional Proposal Applied through Target Aggregate
  ↓
Audit and Read Models Updated
```

---

# 5. Cross-module process timelines

## 5.1 User onboarding to active use

```text
User Registered
→ Email Verification Requested
→ Email Verified
→ Profile Completed
→ First Module Aggregate Created
→ First Activity Fact Published
→ Progress Summary Updated
→ Dashboard Updated
```

## 5.2 AI-assisted modification of an existing plan

```text
User Requests Plan Modification
→ AI Request Authorized
→ Minimum Required Context Prepared
→ Provider-Independent AI Request Sent
→ AI Proposal Generated or Failure Recorded
→ User/Approved Workflow Applies Proposal
→ Target Aggregate Validates Deterministic Rules
→ Target State Changed
→ Audit Event and Integration Event Published
→ Progress/Dashboard Projections Updated Where Applicable
```

## 5.3 Durable notification delivery

```text
Business Event Published
→ Notification Policy Evaluates Eligibility and Consent
→ In-App Notification Created
→ SignalR Delivery Attempted
→ Email Job Queued When Approved
→ Delivery Outcome Recorded
→ User Retrieves Missed Notifications Through Authorized Read Model
```

# 6. Decisions explicitly blocked pending requirements

The following must be resolved before aggregate design or implementation of the affected behavior:

1. Exact workflow and data fields for every module.
2. Goal states, milestones, due dates, recurrence, and reminder rules.
3. Life Planner scheduling, time blocks, priorities, recurrence, rollovers, and calendar integration.
4. Study upload types, OCR provider, content retention, and educational content policy.
5. Nutrition food-data source, calculation rules, allergy/medical safeguards, age restrictions, and disclaimers.
6. Gym exercise catalog, workout calculation rules, safety policy, and age restrictions.
7. Islamic AI content governance, prayer-time method/provider, location consent, conventions, and notification rules.
8. Language-learning curriculum, assessment, vocabulary/repetition algorithm, and external providers.
9. Progress metric definitions, rollup periods, correction semantics, and scoring.
10. Dashboard widget catalog, refresh target, and Free/Premium visibility.
11. AI model routing, costs, quotas, retention, safety policy, provider data-processing approval, and user-confirmation model.
12. Notification consent, quiet hours, frequency, and delivery-provider selection.
13. Privacy retention, export/deletion, minor consent, legal jurisdiction, and support-access policy.

## 7. Event Storming acceptance criteria

This artifact is ready for Product Owner review only when each proposed event and rule is classified as one of:

- Approved for Version 1
- Deferred from Version 1
- Rejected
- Requires a dedicated product or legal decision

Only approved items may become bounded contexts, aggregates, commands, events, API contracts, or implementation work in Milestone 0.2 and later.
