# LifePilot AI - Domain Model - Invariants

**Status:** Milestone 0.3 draft for approval.

## Global Invariants

| Invariant | Owner | Enforcement |
|---|---|---|
| Business logic must not exist in controllers | Architecture | Application/Domain design and architecture tests later |
| Controllers only call MediatR | Presentation | Later API design |
| Domain does not depend on Infrastructure | Architecture | Clean Architecture boundary |
| AI must never calculate, schedule, manage business rules, grant access, or mutate business state directly | AI Assistance plus target contexts | AI gateway and target command validation |
| All dates are stored in UTC | Shared platform | Value object/application validation |
| Arabic and English are Version 1 locales; RTL/LTR required | Profile & Personalization | Locale policy |
| No shared mutable business data between contexts | Architecture | Context contracts and aggregate ownership |
| Sensitive data minimized in events/logs/prompts/notifications | All contexts | Event, AI, Communications, Observability policies |
| Every user-owned aggregate carries owner identity | All user-owned contexts | Aggregate factory/invariant |
| Future multi-tenancy must be possible without Version 1 organization behavior | Architecture | Identifier and data isolation readiness |

## Aggregate Invariants

| Aggregate | Invariants |
|---|---|
| User Account | Unique normalized email; disabled/deleted accounts cannot authenticate; credentials are never plain text; Google provider claims pass through ACL. |
| Refresh Token Session | Token hashes only; revoked/expired token cannot rotate; rotation invalidates previous token. |
| Role Assignment | Only approved roles; role change requires authorized actor and audit; Premium is not a role. |
| Profile | One profile per UserId; does not store credentials, roles, refresh tokens, body measurements, goals, plans, or progress. |
| Consent Record | Consent has purpose, policy version, actor, timestamp; no unapproved consent purpose. |
| Goal | One owner; deterministic lifecycle; Planner/Progress/Dashboard/AI cannot mutate; completed/archived progress requires reopen policy. |
| Life Plan | Does not own source-domain activity state; cannot become cross-domain super-aggregate. |
| Daily Plan | One owner and plan date; item ordering unique; AI cannot schedule or complete; specialized plan content remains outside. |
| Study Workspace | One owner; sharing not approved; material content not exposed cross-context. |
| Study Material | One owner/workspace; blob reference is not domain ownership; raw content excluded from events/logs. |
| Study Session | Completion is user/deterministic; AI cannot infer completion. |
| External Course | User-declared course reference only; no provider partnership/certificate authority implied. |
| Course Enrollment | User-declared progress unless approved import exists; AI cannot assert completion. |
| Language Learning Profile | No authoritative proficiency without approved assessment. |
| Learning Plan | Does not own daily scheduling; curriculum rules pending. |
| Learning Session | AI cannot complete session or assign proficiency. |
| Wellbeing Profile | Sole owner of body measurements; sensitive owner-private data. |
| Meal Record | No authoritative calories/macros without approved deterministic source; AI cannot calculate. |
| Meal Plan | Not medical prescription; no daily scheduling ownership. |
| Fitness Profile | Does not own body measurements; no diagnosis. |
| Workout Program | Owns workout content, not daily schedule; no medical prescription. |
| Workout Session | Completion is user/deterministic; AI cannot infer. |
| Spiritual Profile | Spiritual preferences private; global locale/time zone remain Profile-owned. |
| Prayer Progress Record | Self-reported; AI cannot verify observance; prayer times require approved deterministic source. |
| Spiritual Plan | No daily scheduling ownership; no binding religious ruling. |
| Progress Ledger | One progress fact per source event; source owns corrections; summaries are rebuildable; AI cannot calculate progress. |
| Progress Metric Definition | Metrics deterministic and approved; AI cannot define authoritative metrics. |
| AI Request Record | Authenticated user, approved capability, minimum context, correlation id; raw prompts not shared contracts. |
| AI Proposal Record | Proposal is not target business state until target command accepts it. |
| Copilot Session | Does not own target-domain state; retention pending. |
| Notification | One recipient; safe template parameters; delivery state owned by Communications. |
| Notification Preference | Cannot override legal consent; quiet-hours/frequency pending. |

## Cross-Context Invariants

| Boundary | Invariant |
|---|---|
| Identity -> Product contexts | Product contexts use UserId/claims, never credentials or token data. |
| Profile -> Product contexts | Contexts may consume locale/time zone/preferences, never mutate Profile. |
| Direction -> Planning | Daily Plan holds GoalReference only; it cannot mutate Goal. |
| Source contexts -> Progress | Source facts are immutable; Progress does not update source aggregates. |
| Source contexts -> Communications | Notification requests use safe parameters and do not transfer business ownership. |
| AI -> Target contexts | AI returns proposals/results only; target context validates and applies. |
| Dashboard -> Sources | Dashboard projections read summaries; they never recalculate source truth. |

