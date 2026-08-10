# LifePilot AI - Domain Model - Factory Methods

**Status:** Milestone 0.3 draft for approval.  
**Note:** This document names factory methods conceptually. It is not implementation code.

## Factory Method Rules

- Factories create aggregates in a valid initial state.
- Factories do not call repositories, providers, queues, or AI.
- Factories require owner identity for all user-owned aggregates.
- Factories must reject pending/TBD behavior until product rules are approved.

## Aggregate Factory Catalog

| Aggregate | Factory | Required Inputs | Initial State | Factory Rules |
|---|---|---|---|---|
| User Account | RegisterWithEmail | EmailAddress, password hash result, correlation id | RegisteredUnverified | Email uniqueness result must be supplied; password policy pending |
| User Account | RegisterOrLinkGoogle | Provider subject through ACL, email reference | ActiveVerified or RegisteredUnverified per provider policy pending | Provider claims normalized; no provider model leakage |
| External Login Link | LinkExternalIdentity | UserId, provider code, provider subject from ACL | Linked | Provider subject must not already be linked to another active user |
| Refresh Token Session | IssueForAuthenticatedUser | UserId, token hash, expiry UTC | Issued | Account must be active |
| Role Assignment | CreateDefaultForUser | UserId | User role assigned | Only approved default role |
| Profile | CreateForUser | UserId, default locale/time zone where approved | Incomplete | One Profile per UserId |
| User Preferences | CreateDefaultPreferences | UserId, approved defaults | Default | Preference catalog pending |
| Consent Record | CreateConsent | UserId, purpose, policy version | Granted | Purpose taxonomy must be approved |
| Goal | CreateGoal | UserId, GoalTitle, optional description | Draft or Active pending lifecycle approval | Must be owner-created; title rules pending |
| Life Plan | CreateLifePlan | UserId, title | Active | Must not capture source-domain state |
| Daily Plan | CreateForDate | UserId, PlanDate | Open/Draft pending approval | Duplicate-date policy pending |
| Study Workspace | CreateWorkspace | UserId, optional subject/title | Active | Sharing not approved |
| Study Material | CreateUploadedMaterial | UserId, workspace id, storage reference, file metadata | Uploaded | Upload validation rules pending |
| Study Session | StartSession | UserId, workspace/material refs where approved | Started | Completion rules pending |
| External Course | AddCourse | UserId, CourseReference | Active | Provider verification not implied |
| Course Enrollment | Enroll | UserId, CourseReference | Enrolled | Progress scale pending |
| Language Learning Profile | Configure | UserId, LanguageCode | Configured | Assessment/proficiency pending |
| Learning Plan | CreateLearningPlan | UserId, language/subject reference | Active | Curriculum/lesson behavior pending |
| Learning Session | StartLanguageSession | UserId, language code | Started | AI cannot create authoritative proficiency |
| Wellbeing Profile | CreateWellbeingProfile | UserId | Active | Body measurement owner |
| Body Measurement Record | RecordMeasurement | UserId, measurement kind, value, unit, instant UTC | Recorded | Unit catalog pending |
| Nutrition Profile | CreateNutritionProfile | UserId, WellbeingProfileReference | Created | Medical rules pending |
| Meal Record | RecordMeal | UserId, meal time UTC/user-date context | Recorded | Food/macro rules pending |
| Meal Plan | CreateMealPlan | UserId, plan purpose | Active | Not medical prescription |
| Fitness Profile | CreateFitnessProfile | UserId, WellbeingProfileReference | Created | Safety rules pending |
| Workout Program | CreateWorkoutProgram | UserId, plan purpose | Active | Exercise catalog pending |
| Workout Session | StartWorkoutSession | UserId, optional program reference | Started | Exercise metrics pending |
| Spiritual Profile | ConfigureSpiritualProfile | UserId, spiritual preferences | Configured | Prayer-time settings pending |
| Prayer Progress Record | RecordPrayerProgress | UserId, PrayerReference, status where approved | Recorded | Self-reported only |
| Spiritual Plan | CreateSpiritualPlan | UserId, purpose | Active | Content governance pending |
| Progress Ledger | CreateForUser | UserId | Empty | May also be created on first fact |
| Progress Fact | RecordFromSourceEvent | UserId, source event envelope | Recorded | Idempotency by SourceEventId |
| Progress Metric Definition | CreateMetricDefinition | Metric code/spec | Draft | Requires approved metric specification |
| AI Request Record | SubmitAIRequest | UserId, capability, target reference, correlation id | Submitted | Capability must be approved |
| AI Proposal Record | CreateProposal | Request id, target reference, provider-neutral result | Generated | Proposal is not business state |
| AI Usage Record | OpenUsagePeriod | UserId, capability, usage period | Open | Quota periods and Free/Premium limits pending |
| Copilot Session | StartSession | UserId | Started | Retention pending |
| Notification | CreateFromRequest | Recipient, template key, safe parameters | Created | Eligibility policy must pass |
| Notification Preference | CreateDefault | UserId | Default | Ownership/consent policy pending |

## Factory Validation Report

| Check | Result |
|---|---|
| Factories avoid infrastructure | Pass |
| Factories create valid initial state | Pass with pending-state caveats |
| Factories do not implement TBD behavior | Pass |
| AI proposal creation separated from business-state application | Pass |
