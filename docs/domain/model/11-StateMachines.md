# LifePilot AI - Domain Model - State Machines

**Status:** Milestone 0.3 draft for approval.  
**Note:** States marked `proposed` require Product Owner approval before implementation.

## Aggregate State Diagrams

### Identity & Access

```mermaid
stateDiagram-v2
    [*] --> RegisteredUnverified: RegisterWithEmail
    RegisteredUnverified --> ActiveVerified: VerifyEmail
    [*] --> ActiveVerified: ApprovedGoogleLogin
    ActiveVerified --> Disabled: DisableAccount
    Disabled --> ActiveVerified: RestoreAccount
    RegisteredUnverified --> Deleted: ExecuteApprovedDeletion
    ActiveVerified --> Deleted: ExecuteApprovedDeletion
    Disabled --> Deleted: ExecuteApprovedDeletion
```

```mermaid
stateDiagram-v2
    [*] --> Linked: LinkExternalIdentity
    Linked --> Unlinked: Unlink proposed
```

```mermaid
stateDiagram-v2
    [*] --> Issued: IssueRefreshToken
    Issued --> Rotated: Rotate
    Issued --> Revoked: Revoke
    Issued --> Expired: Expire
    Rotated --> Revoked: RevokeChain
```

```mermaid
stateDiagram-v2
    [*] --> Assigned: AssignRole
    Assigned --> Revoked: RevokeRole
```

### Profile & Personalization

```mermaid
stateDiagram-v2
    [*] --> Incomplete: ProfileCreated
    Incomplete --> Complete: ProfileCompleted
    Complete --> Complete: ProfileUpdated
    Complete --> Complete: LocaleOrTimeZoneChanged
    Incomplete --> Deleted: AccountDeleted
    Complete --> Deleted: AccountDeleted
```

```mermaid
stateDiagram-v2
    [*] --> Default: CreateDefaultPreferences
    Default --> Customized: UpdatePreferences
    Customized --> Customized: UpdatePreferences
```

```mermaid
stateDiagram-v2
    [*] --> Granted: ConsentRecorded
    Granted --> Withdrawn: ConsentWithdrawn
```

### Personal Direction

```mermaid
stateDiagram-v2
    [*] --> Draft: GoalCreated proposed
    Draft --> Active: Activate proposed
    Active --> Paused: PauseGoal proposed
    Paused --> Active: ResumeGoal proposed
    Active --> Completed: CompleteGoal
    Active --> Archived: ArchiveGoal
    Paused --> Archived: ArchiveGoal
    Completed --> Archived: ArchiveGoal proposed
```

### Personal Planning

```mermaid
stateDiagram-v2
    [*] --> Active: LifePlanCreated
    Active --> Archived: ArchiveLifePlan proposed
```

```mermaid
stateDiagram-v2
    [*] --> Open: DailyPlanCreated
    Open --> Amended: AddOrUpdateOrReorderItem
    Amended --> Amended: AddOrUpdateOrReorderItem
    Open --> Closed: CloseDay proposed
    Amended --> Closed: CloseDay proposed
```

```mermaid
stateDiagram-v2
    [*] --> Planned: PlanItemAdded
    Planned --> Completed: MarkComplete
    Planned --> Skipped: Skip
    Planned --> Removed: Remove
    Completed --> Removed: Remove proposed
    Skipped --> Removed: Remove proposed
```

### Learning

```mermaid
stateDiagram-v2
    [*] --> Active: StudyWorkspaceCreated
    Active --> Archived: Archive proposed
```

```mermaid
stateDiagram-v2
    [*] --> Uploaded: StudyMaterialUploaded
    Uploaded --> Processing: ProcessingRequested
    Processing --> Processed: ProcessingSucceeded
    Processing --> Failed: ProcessingFailed
    Uploaded --> Removed: Remove
    Processed --> Removed: Remove
    Failed --> Removed: Remove
```

```mermaid
stateDiagram-v2
    [*] --> Started: StartStudySession
    Started --> Completed: Complete
    Started --> Cancelled: Cancel proposed
```

```mermaid
stateDiagram-v2
    [*] --> Active: ExternalCourseAdded
    Active --> Archived: Archive
```

```mermaid
stateDiagram-v2
    [*] --> Enrolled: CourseEnrollmentCreated
    Enrolled --> InProgress: CourseProgressRecorded
    InProgress --> Completed: CompleteCourse
    Enrolled --> Completed: CompleteCourse
    Enrolled --> Archived: Archive
    InProgress --> Archived: Archive
```

```mermaid
stateDiagram-v2
    [*] --> Configured: LanguageLearningProfileConfigured
    Configured --> Configured: UpdateProfile
```

```mermaid
stateDiagram-v2
    [*] --> Active: LearningPlanCreated
    Active --> Active: LearningPlanUpdated
    Active --> Retired: Retire proposed
```

```mermaid
stateDiagram-v2
    [*] --> Started: StartLearningSession
    Started --> Completed: Complete
    Started --> Cancelled: Cancel proposed
```

### Wellbeing

```mermaid
stateDiagram-v2
    [*] --> Active: WellbeingProfileCreated
    Active --> Active: BodyMeasurementRecorded
    Active --> Active: BodyMeasurementCorrected
```

```mermaid
stateDiagram-v2
    [*] --> Recorded: RecordBodyMeasurement
    Recorded --> Corrected: CorrectBodyMeasurement
    Recorded --> Superseded: SupersedeBodyMeasurement
```

```mermaid
stateDiagram-v2
    [*] --> Created: NutritionProfileCreated
    Created --> Created: NutritionProfileUpdated
```

```mermaid
stateDiagram-v2
    [*] --> Recorded: MealRecorded
    Recorded --> Corrected: MealRecordUpdated
    Recorded --> Removed: MealRecordRemoved
    Corrected --> Removed: MealRecordRemoved
```

```mermaid
stateDiagram-v2
    [*] --> Active: NutritionPlanCreated
    Active --> Active: NutritionPlanUpdated
    Active --> Retired: Retire proposed
```

```mermaid
stateDiagram-v2
    [*] --> Created: FitnessProfileCreated
    Created --> Created: FitnessProfileUpdated
```

```mermaid
stateDiagram-v2
    [*] --> Active: WorkoutPlanCreated
    Active --> Active: WorkoutPlanUpdated
    Active --> Retired: Retire proposed
```

```mermaid
stateDiagram-v2
    [*] --> Started: WorkoutSessionStarted
    Started --> Started: ExerciseRecorded
    Started --> Completed: CompleteWorkoutSession
    Started --> Cancelled: Cancel proposed
```

### Spirituality

```mermaid
stateDiagram-v2
    [*] --> Configured: SpiritualProfileConfigured
    Configured --> Configured: UpdatePreferences
```

```mermaid
stateDiagram-v2
    [*] --> Recorded: PrayerProgressRecorded
    Recorded --> Corrected: PrayerProgressUpdated
```

```mermaid
stateDiagram-v2
    [*] --> Active: SpiritualPlanCreated
    Active --> Active: SpiritualPlanProposalApplied
    Active --> Retired: Retire proposed
```

### Progress & Insights

```mermaid
stateDiagram-v2
    [*] --> Empty: CreateLedger
    Empty --> Recording: ProgressFactRecorded
    Recording --> Summarized: ProgressSummaryUpdated
    Summarized --> Recording: NewFact
    Summarized --> DiscrepancyDetected: DetectDiscrepancy
    DiscrepancyDetected --> Reconciled: ResolveDiscrepancy
    Reconciled --> Summarized: ProjectionRebuilt
```

```mermaid
stateDiagram-v2
    [*] --> Draft: CreateMetricDefinition proposed
    Draft --> Active: ApproveMetric proposed
    Active --> Retired: RetireMetric proposed
```

### AI Assistance

```mermaid
stateDiagram-v2
    [*] --> Submitted: SubmitAIRequest
    Submitted --> Rejected: RejectByPolicy
    Submitted --> Authorized: Authorize
    Authorized --> Redacted: Redact
    Redacted --> ProviderSelected: SelectProvider
    ProviderSelected --> Generated: RecordResponse
    ProviderSelected --> Failed: RecordFailure
```

```mermaid
stateDiagram-v2
    [*] --> Generated: AIProposalGenerated
    Generated --> Applied: TargetCommandApplied
    Generated --> Rejected: UserOrTargetRejected
    Generated --> Expired: Expire proposed
```

```mermaid
stateDiagram-v2
    [*] --> Open: OpenUsagePeriod proposed
    Open --> Reconciled: ReconcileUsage proposed
    Reconciled --> Closed: ClosePeriod proposed
```

```mermaid
stateDiagram-v2
    [*] --> Started: CopilotSessionStarted
    Started --> Closed: Close proposed
    Started --> Deleted: DeleteIfPolicyAllows
```

### Communications

```mermaid
stateDiagram-v2
    [*] --> Created: NotificationCreated
    Created --> Delivered: NotificationDelivered
    Delivered --> Read: NotificationRead
    Created --> Failed: DeliveryFailed
    Failed --> Delivered: RetrySucceeded
    Created --> Expired: Expire
    Failed --> Expired: Expire
```

```mermaid
stateDiagram-v2
    [*] --> Default: CreateDefaultPreferences
    Default --> Updated: UpdatePreferences
    Updated --> Withdrawn: WithdrawConsent proposed
```

## State Machine Validation Report

| Check | Result |
|---|---|
| All aggregate state diagrams included | Pass |
| Proposed states clearly marked | Pass |
| AI has no transition into target state without target command | Pass |
| Pending scheduling/metric/retention behaviors not finalized | Pass |
