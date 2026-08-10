# LifePilot AI - Domain Model - Lifecycle

**Status:** Milestone 0.3 draft for approval.

## Platform Lifecycle Overview

```mermaid
flowchart TD
    Register["User Registered"]
    Verify["Email Verified"]
    Profile["Profile Completed"]
    CreateIntent["Goal / Plan / Learning / Wellbeing / Spirituality Aggregate Created"]
    Activity["Activity or Source Fact Recorded"]
    Progress["Progress Fact Recorded"]
    Summary["Progress Summary Updated"]
    Dashboard["Dashboard Projection Updated"]
    Notify["Notification Created if policy allows"]
    AI["Optional AI Assistance Requested"]
    Proposal["AI Proposal Generated"]
    Apply["Target Aggregate Applies Proposal"]

    Register --> Verify --> Profile --> CreateIntent --> Activity --> Progress --> Summary --> Dashboard
    Activity --> Notify
    CreateIntent --> AI --> Proposal --> Apply --> Activity
```

## Lifecycle Diagrams by Context

### Identity & Access

```mermaid
flowchart LR
    Registered["Registered"]
    Verification["Verification Requested"]
    Verified["Verified/Active"]
    Session["Refresh Session Issued"]
    Rotated["Session Rotated"]
    Disabled["Disabled"]
    Deleted["Deleted"]

    Registered --> Verification --> Verified --> Session --> Rotated
    Verified --> Disabled --> Verified
    Registered --> Deleted
    Verified --> Deleted
    Disabled --> Deleted
```

### Profile & Personalization

```mermaid
flowchart LR
    Created["Profile Created"]
    Completed["Profile Completed"]
    Preferences["Preferences Updated"]
    Locale["Locale/Time Zone Updated"]
    Consent["Consent Recorded/Withdrawn"]
    Removed["Removed by Account Policy"]

    Created --> Completed
    Completed --> Preferences
    Completed --> Locale
    Completed --> Consent
    Created --> Removed
    Completed --> Removed
```

### Personal Direction

```mermaid
flowchart LR
    Created["Goal Created"]
    Milestone["Milestone Added/Updated"]
    Progress["Goal Progress Recorded"]
    Paused["Paused/Resumed proposed"]
    Completed["Goal Completed"]
    Archived["Goal Archived"]

    Created --> Milestone --> Progress --> Completed
    Created --> Paused --> Progress
    Created --> Archived
    Completed --> Archived
```

### Personal Planning

```mermaid
flowchart LR
    Day["Daily Plan Created"]
    Item["Plan Item Added"]
    Change["Item Updated/Reordered"]
    Done["Completed or Skipped"]
    Close["Day Closed proposed"]
    Progress["Progress Fact Published"]

    Day --> Item --> Change --> Done --> Progress
    Done --> Close
```

### Learning

```mermaid
flowchart LR
    Workspace["Workspace Created"]
    Material["Material Uploaded"]
    Process["Material Processed/Failed"]
    Study["Study Session Completed"]
    Course["Course Enrolled/Progressed"]
    Language["Language Session Completed"]
    Progress["Learning Facts Published"]

    Workspace --> Material --> Process
    Workspace --> Study --> Progress
    Course --> Progress
    Language --> Progress
```

### Wellbeing

```mermaid
flowchart LR
    Profile["Wellbeing Profile Created"]
    Measure["Body Measurement Recorded"]
    Nutrition["Nutrition Profile / Meal / Meal Plan"]
    Fitness["Fitness Profile / Workout Program / Workout Session"]
    Complete["Meal or Workout Fact Published"]
    Progress["Wellbeing Progress Updated"]

    Profile --> Measure
    Profile --> Nutrition --> Complete --> Progress
    Profile --> Fitness --> Complete
```

### Spirituality

```mermaid
flowchart LR
    Config["Spiritual Profile Configured"]
    Prayer["Prayer Progress Recorded"]
    Plan["Spiritual Plan Created"]
    AI["Optional Islamic AI Assistance"]
    Progress["Spiritual Fact Published"]

    Config --> Prayer --> Progress
    Config --> Plan --> AI
    AI --> Plan
```

### Progress & Insights

```mermaid
flowchart LR
    Source["Source Event Consumed"]
    Fact["Progress Fact Recorded"]
    Metric["Metric Applied if approved"]
    Summary["Summary Updated"]
    Dashboard["Dashboard Projection Updated"]
    Reconcile["Rebuild/Reconcile"]

    Source --> Fact --> Metric --> Summary --> Dashboard
    Summary --> Reconcile --> Dashboard
```

### AI Assistance

```mermaid
flowchart LR
    Request["AI Request Submitted"]
    Auth["Authorized or Rejected"]
    Redact["Redacted"]
    Provider["Provider Selected"]
    Result["Response/Failure Recorded"]
    Proposal["Proposal Generated"]
    Target["Target Aggregate Applies/Rejects"]

    Request --> Auth
    Auth --> Redact --> Provider --> Result
    Result --> Proposal --> Target
```

### Communications

```mermaid
flowchart LR
    Request["Notification Request or Event"]
    Eligible["Eligibility Evaluated"]
    Created["Notification Created"]
    InApp["In-App Delivery/SignalR Attempt"]
    Email["Email Queued/Sent"]
    Read["Read/Expired"]

    Request --> Eligible --> Created
    Created --> InApp --> Read
    Created --> Email
```

## Lifecycle Validation Report

| Check | Result |
|---|---|
| Every bounded context has lifecycle coverage | Pass |
| Lifecycle does not introduce new business rules | Pass |
| Pending lifecycle decisions marked as proposed/pending | Pass |
| AI lifecycle remains advisory/proposal-based | Pass |

## Domain Validation Report

| Validation Area | Result | Notes |
|---|---|---|
| Every approved bounded context has a domain model | Pass | Identity & Access, Profile & Personalization, Personal Direction, Personal Planning, Learning, Wellbeing, Spirituality, Progress & Insights, AI Assistance, and Communications are covered. |
| Every aggregate has root, purpose, responsibility, boundary, invariants, commands, events, entities, value objects, state, lifecycle, factory rules, and validation rules | Pass | See `01-Aggregates.md`. Pending rules are explicitly marked. |
| Every entity has identity, attributes, behavior, rules, and state changes | Pass | See `02-Entities.md`. |
| Every value object has immutability, validation, equality, and serialization guidance | Pass | See `03-ValueObjects.md`. |
| Every domain event has publisher, consumers, payload, meaning, trigger, and ordering | Pass | See `04-DomainEvents.md`. |
| Every domain service has responsibility, dependencies, and stateless behavior | Pass | See `05-DomainServices.md`. |
| State diagrams exist for aggregate state families | Pass | See `11-StateMachines.md`. |
| Lifecycle diagrams exist for every bounded context | Pass | See this document. |
| Aggregate relationship diagram exists | Pass | See `01-Aggregates.md`. |
| No duplicated aggregate ownership | Pass | Wellbeing owns body measurements, AI Assistance owns AI governance, Progress & Insights owns dashboard/progress, Communications owns notifications. |
| No shared mutable business data | Pass | Shared data is limited to identifiers, UTC instants, locale codes, and event envelopes. |
| No DDD violations left unresolved | Pass with pending gates | Potential violations were redesigned or marked pending. |

## Remaining Product Gates Before Implementation

The following are not implementation blockers for the domain model documents, but they remain blockers for code, database schema, API contracts, and tests:

- Goal lifecycle final states and reopen behavior.
- Daily plan duplicate-date, close-day, rollover, scheduling, recurrence, priority, and reminder behavior.
- Upload type, file size, malware scanning, OCR provider, and study material retention.
- Nutrition food database, units, allergies, macros, calories, medical disclaimers, and age restrictions.
- Workout exercise catalog, equipment, safety, injury, and workout metric rules.
- Prayer-time provider/calculation method, location consent, convention, and spiritual content policy.
- Language curriculum, assessment, vocabulary, and spaced-repetition rules.
- Progress metrics, streaks, achievements, rollup periods, and dashboard widget catalog.
- AI provider routing, quotas, fallback, prompt retention, redaction policy depth, and provider data-processing approval.
- Notification consent, quiet hours, reminder timing, delivery frequency, and email provider policy.
- Privacy retention, account deletion, data export, minor consent, and support access policy.
