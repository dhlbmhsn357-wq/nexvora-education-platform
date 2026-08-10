# LifePilot AI - Domain Model - Entities

**Status:** Milestone 0.3 draft for approval.  
**Rule:** Entities exist only inside their owning aggregate. They are not independently loaded or mutated by other bounded contexts.

## Entity Catalog

| Bounded Context | Entity | Aggregate | Identity | Attributes | Behavior | Business Rules | Allowed State Changes |
|---|---|---|---|---|---|---|---|
| Identity & Access | Email Credential | User Account | CredentialId or UserId-scoped identity | Normalized email, password hash, verification state | Validate credential ownership and status | Password hash only; email uniqueness enforced at account creation | Created, replaced after password reset, disabled with account |
| Identity & Access | Verification Token | User Account | TokenId | Token hash, purpose, expiry UTC, consumed flag | Mark consumed/expired | Plain token never stored | Issued, consumed, expired |
| Identity & Access | Password Reset Token | User Account | TokenId | Token hash, expiry UTC, consumed flag | Complete password reset | Reset requires active eligible account | Issued, consumed, expired |
| Identity & Access | Google Login Link | User Account | ExternalLoginId | Provider, provider subject, linked at UTC | Link external login | Provider data enters through ACL only | Linked, unlinked if policy approved |
| Identity & Access | Refresh Token | Refresh Token Session | RefreshTokenId | Token hash, expiry UTC, revoked UTC, replaced-by reference | Rotate, revoke, expire | Revoked/expired token cannot rotate | Issued, rotated, revoked, expired |
| Identity & Access | Role Assignment Record | Role Assignment | AssignmentId | UserId, role name, assigned by, assigned at, revoked at | Assign/revoke role | Only approved roles; all changes audited | Assigned, revoked |
| Profile & Personalization | Preference Entry | Profile | PreferenceKey | Key, value, updated at | Replace preference value | Must be approved preference key | Added, updated, removed where approved |
| Profile & Personalization | Profile Completion State | Profile | UserId-scoped | Required-field status, completion timestamp | Evaluate completion | Completion criteria pending detailed profile spec | Incomplete, complete, invalidated by required change |
| Profile & Personalization | Consent Record Entry | Consent Record | ConsentRecordId | Purpose, policy version, status, actor, timestamp | Grant/withdraw consent | Consent taxonomy pending | Granted, withdrawn |
| Personal Direction | Goal Milestone | Goal | MilestoneId | Title, description, status, optional due date | Update milestone, mark complete where approved | Belongs to parent Goal; lifecycle pending | Added, updated, completed, removed where approved |
| Personal Direction | Goal Progress Record | Goal | GoalProgressRecordId | Recorded value/fact, note, occurred at UTC | Record goal-owned progress | Must not duplicate Progress & Insights derived metrics | Recorded, corrected where policy approved |
| Personal Planning | Plan Item | Daily Plan | PlanItemId | Title, order, status, optional GoalReference, optional TargetAggregateReference | Update, reorder, complete, skip, remove | AI cannot mark complete; ordering unique per Daily Plan | Planned, updated, reordered, completed, skipped, removed |
| Personal Planning | Life Plan Daily Reference | Life Plan | DailyPlanId | Date reference, status | Reference Daily Plan | Does not own Daily Plan state | Added, removed where approved |
| Learning | Study Material Reference | Study Workspace | StudyMaterialId | Material id, title, subject, status | Attach/detach material | Workspace owner must match material owner | Added, removed |
| Learning | Study Material Processing Record | Study Material | ProcessingRecordId | Status, requested at, completed/failed at, failure reason code | Mark processing state | Provider details hidden behind ACL | Requested, processing, processed, failed |
| Learning | Course Progress Record | Course Enrollment | CourseProgressRecordId | Self-reported progress value, occurred at UTC | Record progress | Scale and percentage rules pending | Recorded, corrected where policy approved |
| Learning | Language Session Record | Learning Session | LearningSessionId | Language code, started/completed at, status | Complete/cancel session | AI cannot assign proficiency | Started, completed, cancelled |
| Learning | Vocabulary Progress Record | Learning Session or Vocabulary Item | VocabularyProgressRecordId | Vocabulary reference, progress marker | Record practice | Spaced repetition algorithm pending | Recorded, corrected where approved |
| Wellbeing | Body Measurement Entry | Wellbeing Profile | BodyMeasurementRecordId | Measurement kind, value, unit, recorded at UTC | Record/correct measurement | One owner: Wellbeing; BMI pending | Recorded, corrected, superseded |
| Wellbeing | Meal Entry | Meal Record | MealEntryId | Free-text or approved food reference, quantity/unit where approved | Update/remove entry | Food database, ingredients, macros pending | Added, updated, removed |
| Wellbeing | Exercise Record | Workout Session | ExerciseRecordId | Exercise reference, muscle group, recorded values where approved | Record exercise | Exercise catalog/metrics pending | Recorded, corrected, removed |
| Wellbeing | Planned Exercise | Workout Program | PlannedExerciseId | Exercise reference, order, plan details where approved | Add/update/remove planned exercise | Not a completed workout fact | Added, updated, removed |
| Spirituality | Prayer Progress Entry | Prayer Progress Record | PrayerProgressEntryId | Prayer reference, status where approved, recorded at UTC | Record/update progress | Self-reported only; AI cannot verify | Recorded, updated/corrected |
| Spirituality | Spiritual Plan Item | Spiritual Plan | SpiritualPlanItemId | Content reference/title, order where approved | Add/update/remove plan content | Does not own daily scheduling | Added, updated, removed |
| Spirituality | Islamic Content Interaction | Spiritual Profile or Spiritual Plan | InteractionId | Interaction type, AI request reference, timestamp | Record interaction metadata | AI not religious authority; retention pending | Recorded, deleted if policy allows |
| Progress & Insights | Progress Fact | Progress Ledger | ProgressFactId | SourceEventId, source context, aggregate reference, occurred at UTC, fact type | Ingest source fact | One fact per source event; immutable | Recorded only; correction via compensating source event |
| Progress & Insights | Progress Summary | Progress Ledger | SummaryId | Metric code, period, value, freshness | Recalculate summary | Derived and rebuildable | Created, replaced, rebuilt |
| Progress & Insights | Reconciliation Record | Progress Ledger | ReconciliationId | Reason, started/completed at, result | Track rebuild/reconciliation | Audited repair only | Started, resolved, failed |
| Progress & Insights | Dashboard Widget Projection | Progress Ledger | WidgetProjectionId | Widget key, source summary references, freshness | Compose dashboard value | Not source of truth | Refreshed, rebuilt, unavailable |
| AI Assistance | Provider Attempt | AI Request Record | ProviderAttemptId | Provider, started/completed at, status, error category | Record provider attempt | Provider SDK details hidden | Started, succeeded, failed |
| AI Assistance | Redaction Record | AI Request Record | RedactionRecordId | Policy version, outcome, data classes removed | Record minimization outcome | Raw sensitive text not exposed | Recorded |
| AI Assistance | Usage Record | AI Request Record | UsageRecordId | Capability, provider, token/cost metadata where approved | Track usage | Quota model pending | Recorded, reconciled |
| AI Assistance | Applied Proposal Link | AI Proposal Record | AppliedProposalLinkId | Target context, target aggregate, applying command, timestamp | Link accepted proposal to target command | Target domain owns business state | Created after target acceptance |
| AI Assistance | Copilot Session Message Reference | Copilot Session | MessageReferenceId | AI request reference, role/type, timestamp | Group AI requests in a session | Retention pending | Added, deleted if policy allows |
| Communications | Notification Delivery Attempt | Notification | DeliveryAttemptId | Channel, attempted at, status, provider result category | Record delivery attempt | Provider details through ACL | Attempted, succeeded, failed |
| Communications | Email Dispatch Record | Notification | EmailDispatchId | Template, queued/sent/failed at, status | Queue/send/fail email | Email is background work | Queued, sent, failed |
| Communications | In-App Notification State | Notification | NotificationId-scoped | Delivered/read/expired flags | Mark delivered/read/expired | SignalR is delivery only | Created, delivered, read, expired |
| Communications | Channel Preference | Notification Preference | Channel | Enabled/disabled, updated at | Change preference | Consent/quiet-hours pending | Default, enabled, disabled |
| AI Assistance | Usage Entry | AI Usage Record | UsageEntryId | Capability, provider-neutral usage count, recorded at UTC | Record/reconcile usage | Quota model pending; not a permission source | Recorded, reconciled |

## Entity Rules

- Entity identity is stable only inside its aggregate boundary.
- Entities must never publish integration events directly; the aggregate root records domain events.
- Entities may enforce local rules, but aggregate roots enforce consistency across child entities.
- Entities cannot contain repositories, provider clients, or application orchestration.
