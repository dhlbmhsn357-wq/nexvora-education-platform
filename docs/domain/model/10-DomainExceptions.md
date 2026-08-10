# LifePilot AI - Domain Model - Domain Exceptions

**Status:** Milestone 0.3 draft for approval.  
**Note:** These are conceptual exception categories and names, not code.

## Exception Standards

- Domain exceptions represent invariant violations or rejected domain decisions.
- They must not expose sensitive data.
- Application layer maps them to localized API errors later.
- Infrastructure failures are not domain exceptions.

## Exception Catalog

| Exception | Owner | Raised When | Safe Error Meaning |
|---|---|---|---|
| AccountAlreadyExists | Identity & Access | Normalized email cannot be registered | Account cannot be created |
| AccountNotActive | Identity & Access | Disabled/deleted account tries restricted operation | Account is not active |
| EmailNotVerified | Identity & Access | Verified-only behavior is requested before verification | Email verification required |
| InvalidRefreshTokenState | Identity & Access | Token is expired/revoked/reused | Session cannot be refreshed |
| UnauthorizedRoleMutation | Identity & Access | Actor cannot assign/revoke role | Role change not allowed |
| UnsupportedRole | Identity & Access | Unknown role requested | Role is not supported |
| ProfileNotOwnedByUser | Profile & Personalization | Actor does not own profile | Profile access denied |
| UnsupportedLocale | Profile & Personalization | Locale outside Arabic/English | Locale not supported |
| UnsupportedTimeZone | Profile & Personalization | Time zone fails approved standard | Time zone not supported |
| ConsentPurposeNotApproved | Profile & Personalization | Consent purpose not in approved taxonomy | Consent purpose unavailable |
| GoalNotOwnedByUser | Personal Direction | Actor does not own Goal | Goal access denied |
| InvalidGoalStateTransition | Personal Direction | Goal lifecycle transition invalid | Goal state change not allowed |
| GoalCannotAcceptProgress | Personal Direction | Progress attempted in blocked state | Goal progress not allowed |
| InvalidGoalProposalTarget | Personal Direction | AI proposal target does not match Goal | Proposal cannot be applied |
| DailyPlanNotOwnedByUser | Personal Planning | Actor does not own Daily Plan | Plan access denied |
| DuplicateDailyPlanPendingPolicy | Personal Planning | Duplicate-date behavior requested before approval | Daily plan rule unresolved |
| InvalidPlanItemStateTransition | Personal Planning | Item completion/skip/remove invalid | Plan item state change not allowed |
| SchedulingRuleNotApproved | Personal Planning | Time block/recurrence/rollover attempted | Scheduling rule not approved |
| WorkspaceNotOwnedByUser | Learning | Actor does not own workspace/material | Learning access denied |
| MaterialUploadRuleNotApproved | Learning | Upload behavior depends on pending file rules | Upload rule not approved |
| InvalidMaterialProcessingState | Learning | Processing transition invalid | Material processing state invalid |
| CourseProviderAuthorityNotApproved | Learning | Provider verification/import assumed | Course provider authority not approved |
| LearningAssessmentNotApproved | Learning | Proficiency/assessment assigned | Assessment rule not approved |
| WellbeingDataNotOwnedByUser | Wellbeing | Actor does not own sensitive data | Wellbeing access denied |
| MeasurementRuleNotApproved | Wellbeing | Unit/BMI/calculation rule missing | Measurement rule not approved |
| InvalidMealRecordState | Wellbeing | Meal correction/removal invalid | Meal record change not allowed |
| NutritionCalculationNotApproved | Wellbeing | Calories/macros calculated without approved rule | Nutrition calculation unavailable |
| InvalidWorkoutSessionState | Wellbeing | Workout transition invalid | Workout state change not allowed |
| WorkoutCatalogNotApproved | Wellbeing | Exercise/equipment catalog authority assumed | Workout catalog unavailable |
| SpiritualDataNotOwnedByUser | Spirituality | Actor does not own spiritual data | Spiritual access denied |
| PrayerTimeAuthorityNotApproved | Spirituality | Prayer time calculated/imported without approved source | Prayer-time rule unavailable |
| IslamicContentBoundaryViolation | Spirituality | Request/output claims binding ruling or unsafe content | Islamic assistance boundary exceeded |
| InvalidPrayerProgressState | Spirituality | Prayer progress update invalid | Prayer progress change not allowed |
| DuplicateProgressFact | Progress & Insights | SourceEventId already recorded | Progress fact already recorded |
| MetricDefinitionNotApproved | Progress & Insights | Metric calculation requested without approved definition | Metric unavailable |
| ProgressSourceNotApproved | Progress & Insights | Unknown source event consumed | Progress source unavailable |
| ProgressRepairNotAuthorized | Progress & Insights | Rebuild/reconciliation lacks authority | Progress repair denied |
| AICapabilityNotAllowed | AI Assistance | Capability outside approved AI policy | AI capability not allowed |
| AIRequestInsufficientContext | AI Assistance | Required target/capability context missing | AI request incomplete |
| AIRequestRejectedByPolicy | AI Assistance | Redaction, consent, entitlement, or safety rejects request | AI request not allowed |
| AIQuotaExceeded | AI Assistance | Usage exceeds approved quota | AI usage limit reached |
| AIProposalCannotBecomeBusinessState | AI Assistance | Proposal attempted to bypass target validation | Proposal must be validated |
| NotificationRecipientMismatch | Communications | Actor tries to access another user's notification | Notification access denied |
| UnsafeNotificationTemplateParameter | Communications | Raw/sensitive parameter supplied | Notification content unsafe |
| DeliveryChannelNotAllowed | Communications | Channel not permitted by policy/preferences | Delivery channel unavailable |
| ReminderPolicyNotApproved | Communications | Reminder timing/frequency attempted | Reminder rule not approved |

## Exception Validation Report

| Check | Result |
|---|---|
| Exceptions map to domain decisions, not infrastructure failures | Pass |
| Sensitive details omitted | Pass |
| Pending product rules protected by explicit exceptions | Pass |
| AI boundary violations covered | Pass |

