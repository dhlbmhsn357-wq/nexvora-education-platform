# LifePilot AI - Domain Model - Domain Services

**Status:** Milestone 0.3 draft for approval.

## Domain Service Rules

- Domain Services are stateless.
- They contain deterministic domain behavior that does not naturally belong to one aggregate.
- They do not call databases, provider SDKs, HTTP clients, queues, Redis, Hangfire, SignalR, or email services.
- Application services/handlers orchestrate dependencies; Domain Services decide domain meaning.

## Service Catalog

| Bounded Context | Domain Service | Responsibility | Dependencies | Stateless Behavior |
|---|---|---|---|---|
| Identity & Access | Account Registration Policy | Decide if a registration request can create a User Account | Email uniqueness result supplied by application; password policy input | Validates account creation rules and returns accepted/rejected decision |
| Identity & Access | Credential Validation Policy | Validate credential status rules | Password verification result supplied externally | Determines whether active/verified account may authenticate |
| Identity & Access | Token Rotation Policy | Decide if refresh token can rotate | Current token session state | Rejects revoked/expired/reused token states |
| Identity & Access | Role Authorization Policy | Decide whether actor may assign/revoke roles | Actor permissions supplied by application | Validates role mutation authority |
| Profile & Personalization | Profile Completeness Evaluator | Determine whether profile is complete | Profile state and approved required fields | Returns completion state without side effects |
| Profile & Personalization | Locale Validator | Validate supported locale and derived text direction | Supported locale catalog | Derives RTL/LTR and rejects unsupported locale |
| Profile & Personalization | Time-Zone Validator | Validate time-zone identifier | Approved IANA/Windows strategy pending | Returns accepted/rejected time zone |
| Personal Direction | Goal State Transition Policy | Decide allowed goal lifecycle transition | Goal state | Rejects invalid transition |
| Personal Direction | Goal Progress Evaluator | Validate goal-owned progress records | Goal state and approved progress rules | Determines whether progress fact is acceptable |
| Personal Direction | Goal Archival Policy | Decide if goal can be archived | Goal state | Blocks invalid archive states |
| Personal Direction | AI Goal Proposal Validator | Validate AI proposal against goal rules | Proposal envelope and Goal state | Returns deterministic acceptance eligibility |
| Personal Planning | Plan Item Transition Policy | Decide allowed plan item status transition | Daily Plan and Plan Item state | Validates planned/completed/skipped/removed transitions |
| Personal Planning | Plan Conflict Validator | Validate proposed changes against approved planning rules | Daily Plan state | Currently limited because conflicts/time blocks pending |
| Personal Planning | Plan Proposal Validator | Validate AI plan proposal | Proposal envelope and Daily Plan state | Confirms proposal is applicable but does not call AI |
| Learning | Study Material Access Policy | Validate owner access to workspace/material | UserId, workspace/material refs | Accepts/rejects access |
| Learning | Course Reference Validator | Validate user-entered course reference | CourseReference | Validates shape only; no provider authority |
| Learning | Enrollment Ownership Policy | Validate enrollment belongs to owner | UserId, enrollment state | Accepts/rejects mutation |
| Learning | Language Level Validator | Validate approved level values | Learning profile state | Does not infer proficiency |
| Learning | Learning Progress Policy | Validate source learning progress facts | Session/enrollment state | Accepts deterministic facts only |
| Learning | AI Learning Proposal Validator | Validate AI learning proposal | Proposal envelope and target aggregate state | Returns applicable/rejected |
| Wellbeing | Measurement Validation Service | Validate measurement value/unit | Measurement value and approved unit catalog | Does not calculate BMI unless approved |
| Wellbeing | Nutrition Record Policy | Validate meal record transitions | Meal Record state | Allows record/update/remove under policy |
| Wellbeing | Workout State Transition Policy | Validate workout session/program transitions | Workout state | Allows start/record/complete/cancel |
| Wellbeing | Safety Disclaimer Policy | Determine disclaimer requirement | Feature area and user context supplied | Ensures medical authority is not implied |
| Wellbeing | Wellbeing AI Proposal Validator | Validate nutrition/workout proposal | Proposal envelope and target aggregate state | Rejects medical/calculation/scheduling authority |
| Spirituality | Spiritual Content Safety Policy | Validate spiritual AI content boundaries | Request capability and policy version | Rejects binding ruling/prayer-time calculation authority |
| Spirituality | Prayer Progress Policy | Validate prayer progress state | Prayer Progress Record | Accepts self-reported progress only |
| Spirituality | Spiritual Plan Proposal Validator | Validate spiritual plan proposal | Proposal envelope and plan state | Rejects direct AI mutation or unsupported content |
| Spirituality | Prayer-Time Data Policy | Validate deterministic prayer-time source if approved | Provider/calculation result supplied by application | Pending; no behavior until source approved |
| Progress & Insights | Progress Calculation Service | Calculate approved metrics deterministically | Progress facts and active metric definition | Produces derived summaries; never calls AI |
| Progress & Insights | Metric Validation Service | Validate metric definitions | Metric definition draft | Rejects non-deterministic or unapproved metrics |
| Progress & Insights | Progress Reconciliation Service | Compare ledger/projection consistency | Ledger and projection snapshots | Produces discrepancy/resolution decisions |
| Progress & Insights | Dashboard Composition Policy | Select authorized widgets/read models | User authorization, preferences, feature flags supplied | Composes projection eligibility |
| AI Assistance | AI Capability Authorization | Decide whether AI capability may run | User, feature, entitlement, consent, target context | Accepts/rejects AI request |
| AI Assistance | Prompt Data Minimization Policy | Decide permitted context fields | Capability, target context, consent | Produces redaction/minimization decision |
| AI Assistance | Provider Selection Policy | Select approved provider | Capability, provider health/cost inputs supplied | Chooses provider without leaking provider API |
| AI Assistance | Quota/Entitlement Policy | Decide usage allowance | Usage counters and entitlement policy | Accepts/rejects request; exact quotas pending |
| AI Assistance | Proposal Envelope Validator | Validate provider-neutral proposal shape | AI result and target ref | Confirms proposal can be returned to target context |
| Communications | Notification Eligibility Policy | Decide whether notification may be created | Source event/request, preferences, consent | Accepts/rejects notification creation |
| Communications | Template Rendering Policy | Validate template and safe parameters | Template key and parameter map | Ensures safe parameters only |
| Communications | Delivery Preference Policy | Determine channels | Preferences, locale/time zone supplied | Selects in-app/email only if approved |
| Communications | Email Dispatch Policy | Validate email dispatch eligibility | Notification state and channel decision | Queues allowed email delivery |

## Service Validation Report

| Check | Result |
|---|---|
| No service owns persistent state | Pass |
| No provider or infrastructure access in domain service | Pass |
| AI rules remain outside target business rules | Pass |
| Pending services identified | Pass |

