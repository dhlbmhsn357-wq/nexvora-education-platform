# LifePilot AI - Domain Model - Domain Events

**Status:** Milestone 0.3 draft for approval.

## Event Standards

- Domain Events are past-tense facts raised by aggregate roots.
- Integration Events are versioned published forms of selected domain events.
- Payloads include event id, publisher, aggregate reference, owner UserId where applicable, occurred-at UTC, correlation id, and schema version.
- Payloads exclude credentials, tokens, raw prompts, raw study material, sensitive free text, and unapproved medical/spiritual details.

## Event Catalog

| Event | Publisher | Consumers | Payload | Business Meaning | Trigger | Ordering Requirements |
|---|---|---|---|---|---|---|
| UserRegistered | Identity & Access | Profile, Communications, Audit | UserId, email reference, occurred-at | A user account exists | Account registration succeeds | Before ProfileCreated |
| GoogleAccountLinked | Identity & Access | Audit | UserId, provider reference | Google login linked | External login accepted | After UserRegistered if new account |
| EmailVerificationRequested | Identity & Access | Communications | UserId, template key, token reference only | Verification email should be sent | Registration or resend request | After UserRegistered |
| EmailVerified | Identity & Access | Profile, Product contexts | UserId, verified at | Email verified | Valid token consumed | Before verified-only features |
| PasswordResetRequested | Identity & Access | Communications | UserId/email reference, token reference only | Reset email should be sent | Valid reset request | No business dependency |
| PasswordResetCompleted | Identity & Access | Audit | UserId, completed at | Credential changed | Reset token consumed | After PasswordResetRequested |
| RefreshTokenIssued | Identity & Access | Audit | UserId, session id, expiry | Refresh session created | Login succeeds | After authentication |
| RefreshTokenRotated | Identity & Access | Audit | UserId, session id, previous token id, new expiry | Refresh token rotated | Refresh succeeds | Previous token must exist |
| RefreshTokenRevoked | Identity & Access | Audit | UserId, session id, reason | Refresh session revoked | Logout/security command | Before access invalidation |
| AccountDisabled | Identity & Access | Profile, Product contexts, Audit | UserId, reason code | Account cannot authenticate | Authorized admin action | Before denying future auth |
| AccountRestored | Identity & Access | Profile, Product contexts, Audit | UserId | Account restored | Authorized admin action | After AccountDisabled |
| AccountDeleted | Identity & Access | All contexts | UserId, deletion policy version | Account removed under policy | Approved deletion execution | After retention workflow |
| RoleAssigned | Identity & Access | Authorization, Audit | UserId, role, actor | Role granted | Authorized role command | Before permission takes effect |
| RoleRevoked | Identity & Access | Authorization, Audit | UserId, role, actor | Role removed | Authorized role command | Before permission removed |
| ProfileCreated | Profile & Personalization | Dashboard projections | UserId, profile id | Profile exists | AccountRegistered consumed | After UserRegistered |
| ProfileCompleted | Profile & Personalization | Product contexts, Progress | UserId, profile id | User finished required profile data | Complete Profile succeeds | After ProfileCreated |
| ProfileUpdated | Profile & Personalization | Dashboard projections | UserId, changed field classes | Profile changed | Update Profile succeeds | After ProfileCreated |
| UserLocaleChanged | Profile & Personalization | All localized contexts | UserId, locale, direction | Locale changed | Update Locale succeeds | After ProfileCreated |
| UserTimeZoneChanged | Profile & Personalization | Planning, Communications, Dashboard | UserId, time zone id | Time zone changed | Update Time Zone succeeds | After ProfileCreated |
| UserPreferencesUpdated | Profile & Personalization | Product contexts, Communications | UserId, preference keys | Preferences changed | Update Preferences succeeds | After ProfileCreated |
| ConsentRecorded | Profile & Personalization | AI, Communications, Audit | UserId, purpose, version | Consent granted | Record Consent succeeds | Before processing that needs consent |
| ConsentWithdrawn | Profile & Personalization | AI, Communications, Audit | UserId, purpose, version | Consent withdrawn | Withdraw Consent succeeds | Before future processing stops |
| GoalCreated | Personal Direction | Planning, Progress, Dashboard | UserId, GoalId, safe goal summary | Goal exists | Create Goal succeeds | Before goal progress |
| GoalUpdated | Personal Direction | Planning, Progress, Dashboard | UserId, GoalId, changed field classes | Goal changed | Update Goal succeeds | After GoalCreated |
| GoalMilestoneAdded | Personal Direction | Progress | UserId, GoalId, MilestoneId | Milestone exists | Add Milestone succeeds | After GoalCreated |
| GoalProgressRecorded | Personal Direction | Progress | UserId, GoalId, source fact id | Goal-owned progress fact recorded | Record progress succeeds | After GoalCreated |
| GoalPaused | Personal Direction | Planning, Progress | UserId, GoalId | Goal paused | Pause succeeds | After GoalCreated |
| GoalResumed | Personal Direction | Planning, Progress | UserId, GoalId | Goal resumed | Resume succeeds | After GoalPaused |
| GoalCompleted | Personal Direction | Planning, Progress, Communications | UserId, GoalId | Goal reached completion state | Complete succeeds | After GoalCreated |
| GoalArchived | Personal Direction | Planning, Progress | UserId, GoalId | Goal archived | Archive succeeds | After GoalCreated |
| GoalChangeProposalApplied | Personal Direction | AI, Progress | UserId, GoalId, proposal id | AI proposal accepted by Goal | Apply command succeeds | After AIProposalGenerated |
| DailyPlanCreated | Personal Planning | Progress, Dashboard | UserId, DailyPlanId, PlanDate | Daily plan exists | Create Daily Plan succeeds | Before plan item facts |
| PlanItemAdded | Personal Planning | Progress, Dashboard | UserId, DailyPlanId, PlanItemId | Plan item added | Add Plan Item succeeds | After DailyPlanCreated |
| PlanItemUpdated | Personal Planning | Progress, Dashboard | UserId, DailyPlanId, PlanItemId | Plan item changed | Update succeeds | After PlanItemAdded |
| PlanItemReordered | Personal Planning | Dashboard | UserId, DailyPlanId, ordered item ids | Plan item order changed | Reorder succeeds | After PlanItemAdded |
| PlanItemCompleted | Personal Planning | Progress, Dashboard, Communications | UserId, DailyPlanId, PlanItemId, completed at | Plan item completed | Mark Complete succeeds | After PlanItemAdded |
| PlanItemSkipped | Personal Planning | Progress, Dashboard | UserId, DailyPlanId, PlanItemId, skipped at | Plan item skipped | Skip succeeds | After PlanItemAdded |
| PlanProposalApplied | Personal Planning | AI, Progress | UserId, DailyPlanId, proposal id | AI proposal accepted by Daily Plan | Apply command succeeds | After AIProposalGenerated |
| StudyWorkspaceCreated | Learning | Dashboard | UserId, workspace id | Study workspace exists | Create Workspace succeeds | Before material/session facts |
| StudyMaterialUploaded | Learning | Processing jobs, Dashboard | UserId, material id, storage reference | Material accepted | Upload succeeds | Before processing |
| StudyMaterialRejected | Learning | Communications | UserId, rejection reason code | Upload rejected | Validation fails | After upload attempt |
| StudyMaterialProcessingRequested | Learning | Processing jobs | UserId, material id | Material processing should run | Request processing succeeds | After upload |
| StudyMaterialProcessed | Learning | Progress, Dashboard, Communications | UserId, material id, processing metadata | Material ready | Processing succeeds | After processing requested |
| StudyMaterialProcessingFailed | Learning | Communications | UserId, material id, failure category | Material processing failed | Processing fails | After processing requested |
| StudySessionCompleted | Learning | Progress, Dashboard | UserId, study session id, occurred at | Study activity completed | Complete session succeeds | After session start |
| ExternalCourseAdded | Learning | Dashboard | UserId, course reference | Course tracked | Add course succeeds | Before enrollment optional |
| CourseEnrollmentCreated | Learning | Progress, Dashboard | UserId, enrollment id, course reference | User enrolled/tracks course | Enroll succeeds | After course added/reference valid |
| CourseProgressRecorded | Learning | Progress, Dashboard | UserId, enrollment id, progress fact | Course progress recorded | Update progress succeeds | After enrollment |
| CourseCompleted | Learning | Progress, Dashboard, Communications | UserId, enrollment id | Course completed by user | Complete succeeds | After enrollment |
| LanguageLearningProfileConfigured | Learning | Dashboard | UserId, language code | Language learning configured | Configure succeeds | Before language plan/session |
| LearningPlanCreated | Learning | Dashboard | UserId, plan id, language/subject reference | Learning plan exists | Create succeeds | After configuration if required |
| LearningSessionCompleted | Learning | Progress, Dashboard | UserId, session id, language code | Language session completed | Complete succeeds | After session start |
| VocabularyProgressRecorded | Learning | Progress | UserId, vocabulary progress id | Vocabulary progress recorded | Mark progress succeeds | After vocabulary item added |
| BodyMeasurementRecorded | Wellbeing | Progress, Dashboard | UserId, measurement id, kind, unit, recorded at | Sensitive measurement recorded | Record succeeds | After wellbeing profile |
| BodyMeasurementCorrected | Wellbeing | Progress, Audit | UserId, measurement id, correction reference | Measurement corrected | Correct succeeds | After original recorded |
| NutritionProfileCreated | Wellbeing | Dashboard | UserId, profile id | Nutrition profile exists | Create succeeds | Before nutrition plan/meal optional |
| MealRecorded | Wellbeing | Progress, Dashboard | UserId, meal id, occurred at | Meal recorded | Record Meal succeeds | After nutrition profile if required |
| MealRecordUpdated | Wellbeing | Progress | UserId, meal id, correction marker | Meal corrected | Update succeeds | After MealRecorded |
| NutritionPlanCreated | Wellbeing | Dashboard | UserId, meal plan id | Meal plan exists | Create succeeds | Before plan updates |
| NutritionPlanProposalApplied | Wellbeing | AI, Progress | UserId, meal plan id, proposal id | AI proposal accepted by Meal Plan | Apply succeeds | After AIProposalGenerated |
| FitnessProfileCreated | Wellbeing | Dashboard | UserId, profile id | Fitness profile exists | Create succeeds | Before workout plan/session optional |
| WorkoutPlanCreated | Wellbeing | Dashboard | UserId, workout program id | Workout program exists | Create succeeds | Before plan updates |
| WorkoutSessionStarted | Wellbeing | Dashboard | UserId, session id | Workout activity started | Start succeeds | Before exercise/completion |
| ExerciseRecorded | Wellbeing | Dashboard | UserId, session id, exercise record id | Exercise recorded | Record exercise succeeds | After WorkoutSessionStarted |
| WorkoutSessionCompleted | Wellbeing | Progress, Dashboard | UserId, session id, occurred at | Workout activity completed | Complete succeeds | After WorkoutSessionStarted |
| SpiritualProfileConfigured | Spirituality | Dashboard | UserId, profile id | Spiritual preferences exist | Configure succeeds | Before spiritual plan/progress optional |
| PrayerProgressRecorded | Spirituality | Progress, Dashboard | UserId, prayer reference, occurred at | Prayer progress recorded | Record succeeds | After spiritual profile if required |
| PrayerProgressUpdated | Spirituality | Progress | UserId, record id, correction marker | Prayer progress corrected/updated | Update succeeds | After record |
| SpiritualPlanCreated | Spirituality | Dashboard | UserId, plan id | Spiritual plan exists | Create succeeds | Before proposal apply |
| SpiritualPlanProposalApplied | Spirituality | AI, Progress | UserId, plan id, proposal id | AI proposal accepted by Spiritual Plan | Apply succeeds | After AIProposalGenerated |
| ProgressFactRecorded | Progress & Insights | Dashboard | UserId, source event id, metric refs | Source fact accepted into ledger | Ingestion succeeds | After source event |
| ProgressSummaryUpdated | Progress & Insights | Dashboard, Communications | UserId, metric code, period, freshness | Derived summary changed | Calculation/rebuild succeeds | After ProgressFactRecorded |
| ProgressProjectionRebuilt | Progress & Insights | Dashboard, Audit | UserId, rebuild id | Projection rebuilt | Authorized rebuild completes | After rebuild command |
| DashboardProjectionUpdated | Progress & Insights | Presentation | UserId, widget keys, freshness | Dashboard projection refreshed | Summary/projection update | After source summary |
| AIRequestAuthorized | AI Assistance | AI jobs, Audit | UserId, request id, capability, target ref | AI request may proceed | Authorization succeeds | Before provider selection |
| AIRequestRejectedByPolicy | AI Assistance | Requesting context, Audit | UserId, request id, reason code | AI request blocked | Authorization/policy fails | Terminal |
| AIRequestRedacted | AI Assistance | AI jobs, Audit | UserId, request id, redaction outcome | Context minimized | Redaction completes | After authorization |
| AIProviderSelected | AI Assistance | AI jobs, Observability | UserId, request id, provider code | Provider selected | Routing succeeds | After redaction |
| AIResponseGenerated | AI Assistance | Requesting context | UserId, request id, result reference | AI response available | Provider call succeeds | After provider selected |
| AIResponseFailed | AI Assistance | Requesting context, Communications | UserId, request id, failure category | AI response unavailable | Provider/policy fails | After authorization |
| AIProposalGenerated | AI Assistance | Target context | UserId, proposal id, target ref | AI proposal available | Generation succeeds | Before target apply |
| AIProposalApplied | AI Assistance | Audit, Usage | UserId, proposal id, target ref | Proposal was accepted by target command | Target reports success | After target event |
| AIProposalRejected | AI Assistance | Audit | UserId, proposal id, target ref | Proposal rejected | User/target rejects | After proposal generated |
| NotificationCreated | Communications | Dashboard | UserId, notification id, template key | Notification exists | Approved request accepted | Before delivery |
| InAppNotificationCreated | Communications | Dashboard, SignalR delivery | UserId, notification id | In-app notification persisted | Notification created | Before SignalR attempt |
| NotificationDelivered | Communications | Dashboard | UserId, notification id, channel | Delivery succeeded | Provider/SignalR success | After NotificationCreated |
| NotificationRead | Communications | Dashboard | UserId, notification id | User read notification | Mark Read succeeds | After creation |
| NotificationDeliveryFailed | Communications | Operations | UserId, notification id, channel, reason | Delivery failed | Provider/SignalR failure | After attempt |
| EmailQueued | Communications | Email job processor | UserId, notification id, template key | Email queued | Email channel approved | After NotificationCreated |
| EmailSent | Communications | Operations | UserId, notification id | Email sent | Provider success | After EmailQueued |
| EmailFailed | Communications | Operations | UserId, notification id, reason | Email failed | Provider failure | After EmailQueued |

## Supplemental Event Definitions

These events are required by the aggregate model but are either pending policy approval, internal to one context, or secondary to the main integration flow. They still follow the same event standards.

| Event | Publisher | Consumers | Payload | Business Meaning | Trigger | Ordering Requirements |
|---|---|---|---|---|---|---|
| ExternalLoginUnlinked | Identity & Access | Audit | UserId, provider code, external login id | External identity was unlinked | Approved unlink command succeeds | After GoogleAccountLinked or future provider link |
| RefreshTokenExpired | Identity & Access | Audit/cleanup projections | UserId, session id, token id | Refresh token expired | Cleanup or expiry evaluation | After RefreshTokenIssued |
| LanguageLearningProfileUpdated | Learning | Dashboard | UserId, language profile id, changed field classes | Language profile changed | Update succeeds | After LanguageLearningProfileConfigured |
| LearningPlanUpdated | Learning | Dashboard | UserId, learning plan id, changed field classes | Learning plan content changed | Update succeeds | After LearningPlanCreated |
| LearningPlanProposalApplied | Learning | AI Assistance, Progress | UserId, learning plan id, proposal id | AI proposal accepted by Learning Plan | Apply succeeds | After AIProposalGenerated |
| LearningSessionCancelled | Learning | Dashboard | UserId, session id, cancelled at UTC | Language session cancelled | Cancel succeeds | After session start |
| StudyMaterialRemoved | Learning | Dashboard, storage cleanup process | UserId, material id, removal reason | Study material removed from domain use | Remove succeeds | After StudyMaterialUploaded |
| StudySessionCancelled | Learning | Dashboard | UserId, study session id, cancelled at UTC | Study session cancelled | Cancel succeeds | After session start |
| LifePlanCreated | Personal Planning | Dashboard | UserId, life plan id | Life plan exists | Create succeeds | Before life plan updates |
| LifePlanUpdated | Personal Planning | Dashboard | UserId, life plan id, changed field classes | Life plan changed | Update succeeds | After LifePlanCreated |
| LifePlanArchived | Personal Planning | Dashboard | UserId, life plan id | Life plan archived | Archive succeeds where approved | After LifePlanCreated |
| PlanProposalRejected | Personal Planning | AI Assistance, Audit | UserId, daily plan id, proposal id, reason code | AI plan proposal rejected | Reject succeeds | After AIProposalGenerated |
| GoalChangeProposalRejected | Personal Direction | AI Assistance, Audit | UserId, goal id, proposal id, reason code | AI goal proposal rejected | Reject succeeds | After AIProposalGenerated |
| NutritionProfileUpdated | Wellbeing | Dashboard | UserId, nutrition profile id, changed field classes | Nutrition profile changed | Update succeeds | After NutritionProfileCreated |
| NutritionPlanUpdated | Wellbeing | Dashboard, Progress where applicable | UserId, meal plan id, changed field classes | Nutrition plan changed | Update succeeds | After NutritionPlanCreated |
| NutritionPlanProposalRejected | Wellbeing | AI Assistance, Audit | UserId, meal plan id, proposal id, reason code | AI nutrition proposal rejected | Reject succeeds | After AIProposalGenerated |
| MealRecordRemoved | Wellbeing | Progress, Dashboard | UserId, meal id, removal marker | Meal record removed under policy | Remove succeeds | After MealRecorded |
| FitnessProfileUpdated | Wellbeing | Dashboard | UserId, fitness profile id, changed field classes | Fitness profile changed | Update succeeds | After FitnessProfileCreated |
| WorkoutPlanUpdated | Wellbeing | Dashboard, Progress where applicable | UserId, workout program id, changed field classes | Workout program changed | Update succeeds | After WorkoutPlanCreated |
| WorkoutPlanProposalApplied | Wellbeing | AI Assistance, Progress | UserId, workout program id, proposal id | AI workout proposal accepted | Apply succeeds | After AIProposalGenerated |
| WorkoutPlanProposalRejected | Wellbeing | AI Assistance, Audit | UserId, workout program id, proposal id, reason code | AI workout proposal rejected | Reject succeeds | After AIProposalGenerated |
| WorkoutSessionCancelled | Wellbeing | Dashboard | UserId, workout session id, cancelled at UTC | Workout session cancelled | Cancel succeeds | After WorkoutSessionStarted |
| SpiritualProfileUpdated | Spirituality | Dashboard | UserId, spiritual profile id, changed field classes | Spiritual profile changed | Update succeeds | After SpiritualProfileConfigured |
| SpiritualPlanModificationProposed | Spirituality | AI Assistance, Dashboard | UserId, spiritual plan id, proposal id | Spiritual plan modification proposal exists | AIProposalGenerated targets Spiritual Plan | Before SpiritualPlanProposalApplied |
| SpiritualPlanProposalRejected | Spirituality | AI Assistance, Audit | UserId, spiritual plan id, proposal id, reason code | AI spiritual proposal rejected | Reject succeeds | After AIProposalGenerated |
| PrayerTimeDataUpdated | Spirituality | Dashboard, Communications | UserId, source reference, convention reference | Deterministic prayer-time data updated | Approved provider/calculation succeeds | Only after prayer-time source approval |
| ProgressMetricUpdated | Progress & Insights | Progress projections, Dashboard | Metric code, version, changed field classes | Metric definition changed | Approved metric update succeeds | Before future summary calculations use it |
| ProgressDiscrepancyDetected | Progress & Insights | Operations, Audit | UserId, discrepancy id, source summary | Progress discrepancy detected | Reconciliation finds mismatch | After source fact/projection exists |
| ProgressDiscrepancyResolved | Progress & Insights | Operations, Dashboard | UserId, discrepancy id, resolution code | Progress discrepancy resolved | Authorized repair succeeds | After ProgressDiscrepancyDetected |
| DashboardProjectionRebuilt | Progress & Insights | Presentation, Operations | UserId, rebuild id, freshness | Dashboard projection rebuilt | Authorized rebuild succeeds | After source summaries |
| DashboardDataUnavailable | Progress & Insights | Presentation, Operations | UserId, widget key, reason code | Dashboard cannot present a widget | Source data unavailable | During dashboard composition |
| ProgressExplanationGenerated | Progress & Insights | Presentation, AI Assistance | UserId, summary reference, explanation reference | Progress explanation available | AI explanation result accepted as advisory | After deterministic summary exists |
| AIUsageRecorded | AI Assistance | Quota projections, Operations | UserId, usage id, capability, provider-neutral usage | AI usage recorded | AI request completes or fails with billable usage | After AIResponseGenerated or AIResponseFailed |
| AIUsageReconciled | AI Assistance | Quota projections, Operations | UserId, usage period, reconciliation result | AI usage reconciled | Reconciliation completes | After usage records exist |
| CopilotSessionDeleted | AI Assistance | Audit | UserId, session id, deletion policy reference | Copilot session deleted under policy | Delete succeeds where allowed | After CopilotSessionStarted |
| NotificationPreferencesUpdated | Communications | Communications delivery policy, Dashboard | UserId, changed preference keys | Notification preferences changed | Update succeeds | Before future delivery decisions |

## Event Validation Report

| Check | Result |
|---|---|
| Every event has exactly one publisher | Pass |
| Events are past-tense facts | Pass; request events from earlier workshop become commands or internal AI request records where needed |
| Sensitive data minimized | Pass with policy dependency |
| Cross-context mutation avoided | Pass |
| Ordering requirements identified | Pass at domain level; exact outbox implementation belongs to later technical design |
