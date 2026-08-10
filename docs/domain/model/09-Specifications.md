# LifePilot AI - Domain Model - Specifications

**Status:** Milestone 0.3 draft for approval.

## Specification Rules

- Specifications express reusable deterministic predicates.
- They do not call infrastructure or AI providers.
- They may be mirrored in database queries later, but this document defines business intent only.

## Specification Catalog

| Bounded Context | Specification | Applies To | Predicate |
|---|---|---|---|
| Identity & Access | ActiveAccountSpecification | User Account | Account is not disabled or deleted |
| Identity & Access | VerifiedEmailSpecification | User Account | Email verification status is verified |
| Identity & Access | RefreshTokenCanRotateSpecification | Refresh Token Session | Token is current, not expired, not revoked |
| Identity & Access | RoleIsApprovedSpecification | Role Assignment | Role is User, Admin, or Super Admin |
| Profile & Personalization | SupportedLocaleSpecification | Locale | Locale is Arabic or English |
| Profile & Personalization | ProfileOwnerSpecification | Profile | Actor UserId equals Profile UserId unless audited support access approved |
| Profile & Personalization | ConsentPurposeApprovedSpecification | Consent Record | Purpose exists in approved policy taxonomy |
| Personal Direction | GoalOwnedByUserSpecification | Goal | Actor owns Goal |
| Personal Direction | GoalCanAcceptProgressSpecification | Goal | Goal state allows progress; completed/archived blocked unless reopen approved |
| Personal Direction | GoalCanBeArchivedSpecification | Goal | Goal state permits archive |
| Personal Planning | DailyPlanOwnedByUserSpecification | Daily Plan | Actor owns plan |
| Personal Planning | PlanItemCanCompleteSpecification | Plan Item | Item is in a completable state |
| Personal Planning | PlanItemOrderValidSpecification | Daily Plan | Item ordering is unique and deterministic |
| Learning | WorkspaceOwnedByUserSpecification | Study Workspace | Actor owns workspace |
| Learning | MaterialCanBeProcessedSpecification | Study Material | Material is uploaded and processing rules permit processing |
| Learning | CourseProgressCanBeRecordedSpecification | Course Enrollment | Enrollment is active and user-owned |
| Learning | LanguageSessionCanCompleteSpecification | Learning Session | Session is started and owner-confirmed |
| Wellbeing | MeasurementCanBeRecordedSpecification | Wellbeing Profile | Owner is authorized and value/unit are approved |
| Wellbeing | MealCanBeCorrectedSpecification | Meal Record | Meal belongs to user and correction policy permits change |
| Wellbeing | WorkoutSessionCanCompleteSpecification | Workout Session | Session is started and required state is valid |
| Wellbeing | WellbeingProposalSafeSpecification | AI Proposal | Proposal avoids diagnosis, authoritative calculation, and scheduling |
| Spirituality | PrayerProgressSelfReportedSpecification | Prayer Progress Record | Actor is owner and progress is self-reported |
| Spirituality | IslamicAIRequestAllowedSpecification | AI Request | Request does not require binding ruling or prayer-time calculation |
| Spirituality | SpiritualPlanProposalSafeSpecification | AI Proposal | Proposal passes content governance and target validation |
| Progress & Insights | SourceEventNotRecordedSpecification | Progress Ledger | SourceEventId not already recorded |
| Progress & Insights | MetricDefinitionApprovedSpecification | Metric Definition | Metric has approved deterministic definition |
| Progress & Insights | ProjectionCanRebuildSpecification | Progress Ledger | Rebuild is authorized and auditable |
| AI Assistance | AICapabilityAllowedSpecification | AI Request | Capability is summarize, explain, recommend, Q&A, content generation, planning assistance, or approved modify-existing-plan |
| AI Assistance | AIRequestHasMinimumContextSpecification | AI Request | Required target context and redaction outcome exist |
| AI Assistance | AIProposalTargetsKnownAggregateSpecification | AI Proposal | Target context/id/capability are present |
| Communications | NotificationRecipientSpecification | Notification | Recipient is the owning user |
| Communications | TemplateParametersSafeSpecification | Notification | Parameters contain only approved safe values |
| Communications | DeliveryChannelAllowedSpecification | Notification | Channel permitted by consent/preferences/policy |

## Pending Specifications

The following cannot be made binding until requirements are approved:

- Password complexity and lockout specifications.
- Account deletion/export/retention eligibility.
- Due-date, recurrence, rollover, conflict, priority, and reminder eligibility.
- Upload file type, size, OCR, malware scanning, and retention.
- Nutrition calculation, food database, allergy, and medical exclusion rules.
- Workout catalog, injury, age, equipment, and calculation rules.
- Prayer-time, convention, location consent, and override rules.
- Language placement, proficiency, spaced repetition, and assessment rules.
- Metric, streak, achievement, dashboard widget, and premium visibility rules.
- AI quotas, model routing, fallback, prompt retention, and provider approval rules.

