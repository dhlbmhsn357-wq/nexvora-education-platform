# LifePilot AI — Domain Decomposition Analysis

**Status:** Proposed architecture and product-discovery artifact.  
**Purpose:** Validate domain ownership before defining Bounded Contexts in Milestone 0.2.  
**Decision:** The current twelve-module product map is useful for navigation and release planning, but it is **not an optimal one-to-one domain decomposition**. “AI” is a capability, not a business domain, and Dashboard is primarily a projection, not an independent source-of-truth domain.

## 1. Classification and redesigned domain topology

| Current product module | Recommended domain | DDD category | Why |
|---|---|---|---|
| User Profile | Profile & Personalization | Supporting | It adapts the product to a person, but does not provide the product's differentiating life-management rules. Authentication is separated as a generic capability. |
| Goals | Personal Direction | Core | Goals define user intent and are central to the Life Operating System value proposition. |
| Study AI | Learning | Supporting | Study workspace and learning activity are valuable but use domain-specific content workflows; “AI” remains a shared capability. |
| External Courses | Learning | Supporting | Course enrollment and self-reported course progress belong with learning, not as an isolated external-integration domain. |
| Nutrition AI | Wellbeing | Supporting | Nutrition records and plans are specialized wellbeing behavior; AI is not their owner. |
| Gym AI | Wellbeing | Supporting | Fitness plans and sessions are specialized wellbeing behavior and share sensitive wellbeing concepts with nutrition. |
| Islamic AI | Spirituality | Core | Spiritual progress is an explicit, differentiated product outcome that needs culturally specific rules and governance. |
| Language Learning | Learning | Supporting | It is a learning specialization with its own sessions and curriculum, but should share only controlled references with other learning capabilities. |
| Life Planner | Personal Planning | Core | Converting user intent into deliberate daily action is the principal product orchestration capability. |
| Progress Tracking | Progress & Insights | Core | Cross-domain progress is a product differentiator and must own derived progress facts, not merely report them. |
| Dashboard | Progress & Insights projection | Generic presentation capability | It composes authorized read models; it must not become an independent business source of truth. |
| AI Copilot | AI Assistance | Supporting | It orchestrates approved assistive requests and governance; it must never own the business rules of the target domain. |

### Recommended logical domains

1. **Identity & Access** — generic domain; authentication, sessions, external login, roles, account security.
2. **Profile & Personalization** — supporting domain; locale, time zone, preferences, consent, profile completeness.
3. **Personal Direction** — core domain; goals and milestones.
4. **Personal Planning** — core domain; daily plans and plan items.
5. **Learning** — supporting domain; study workspace, external courses, language learning.
6. **Wellbeing** — supporting domain; nutrition, fitness, and a single sensitive wellbeing-profile boundary.
7. **Spirituality** — core domain; prayer progress and approved spiritual planning/content rules.
8. **Progress & Insights** — core domain; deterministic progress ledger, metrics, summaries, and dashboard projections.
9. **AI Assistance** — supporting domain; request governance, provider-neutral execution, proposals, and usage records.
10. **Communications** — generic domain; durable notifications, delivery preferences, email dispatch, SignalR delivery.

Generic technical capabilities such as Blob Storage, Redis, Hangfire, localization, observability, feature flags, and provider adapters remain infrastructure/platform concerns rather than business domains.

## 2. Domain-by-domain decomposition

### 2.1 User Profile → Profile & Personalization (Supporting)

- **Business purpose:** Make the personal product understandable, localized, and configurable for its owner.
- **Owns:** profile display data, locale, text direction, time zone, user preferences, profile completeness, approved privacy preferences and consent records.
- **Does not own:** password credentials, refresh tokens, Google identity, roles, body measurements, goals, plans, activity records, or notifications.
- **Dependencies:** upstream Identity & Access for account identity; downstream domains consume a stable profile reference, locale, and time zone only.
- **Upstream / downstream:** Identity & Access publishes account lifecycle facts; Profile publishes preference changes to Planning, Communications, and localization-aware projections.
- **Shared concepts:** `UserId`, locale, time zone, consent. These must be value objects/contracts, not shared mutable records.
- **Duplicates to eliminate:** a separate locale/time-zone copy in every module; body measurements in both Profile and Wellbeing.
- **Extraction readiness:** high after identity/profile contracts are stable. It has a narrow data surface and event interface.

### 2.2 Goals → Personal Direction (Core)

- **Business purpose:** Capture long-term personal intent and measurable milestones.
- **Owns:** Goal lifecycle, milestones, user-declared goal progress facts, and goal-specific state transitions.
- **Does not own:** daily scheduling, plan-item execution, cross-domain scoring, dashboard widgets, AI provider selection, or reminders.
- **Dependencies:** consumes account/profile references; publishes facts to Planning, Progress & Insights, Communications, and AI Assistance.
- **Upstream / downstream:** Profile is upstream for owner and locale; Personal Planning may reference a Goal but must not mutate it; Progress consumes goal facts.
- **Shared concepts:** `UserId`, `GoalId`, date/time, status. A plan item holds `GoalReference`, not a copy of goal content.
- **Duplicates to eliminate:** goal completion percentage independently calculated in Planner, Dashboard, or Copilot.
- **Extraction readiness:** medium-high; requires versioned goal references and event contracts.

### 2.3 Study AI → Learning (Supporting)

- **Business purpose:** Manage private study materials, study sessions, and approved AI-assisted learning actions.
- **Owns:** study workspace, material metadata/access, processing state, study sessions, study-derived content metadata.
- **Does not own:** generic file storage, OCR-provider behavior, course enrollment, language curriculum, cross-domain progress, or AI governance.
- **Dependencies:** Azure Blob through infrastructure; AI Assistance for AI requests; Progress & Insights consumes completed-session facts.
- **Upstream / downstream:** Profile provides ownership and locale; Study publishes material/session facts; Progress and Dashboard consume derived facts only.
- **Shared concepts:** `UserId`, `StudyWorkspaceId`, material reference, session completion. Material content is not a shared concept.
- **Duplicates to eliminate:** separate “study plan” aggregate if it is actually a Personal Planning plan; study plans should be a typed reference or explicitly separate after requirements approval.
- **Extraction readiness:** medium; file processing and AI workloads make it a likely future workload boundary after retention/OCR decisions.

### 2.4 External Courses → Learning (Supporting)

- **Business purpose:** Let a user track self-selected external courses and their self-reported enrollment/progress.
- **Owns:** external course reference, user enrollment, self-reported course progress, archive/completion state.
- **Does not own:** course-provider catalog authority, payment, certificate verification, scraping, or study-material storage.
- **Dependencies:** Profile for owner; Progress & Insights consumes completion facts; optional AI Assistance may explain or recommend but does not own course state.
- **Upstream / downstream:** Course enrollment is upstream to Learning projections and Progress; no external provider is currently upstream.
- **Shared concepts:** `UserId`, `CourseReference`, `CourseEnrollmentId`; a URL is not proof of a provider relationship.
- **Duplicates to eliminate:** separate generic learning-progress record duplicated with Progress & Insights.
- **Extraction readiness:** high if external providers are later integrated; presently it remains part of Learning to avoid premature service boundaries.

### 2.5 Nutrition AI → Wellbeing (Supporting)

- **Business purpose:** Record personal nutrition activity and manage user-owned nutrition plans under approved safety constraints.
- **Owns:** nutrition profile, meal records, nutrition plan state, nutrition-specific plan proposals.
- **Does not own:** global profile preferences, medical diagnosis, authoritative food database data, fitness sessions, cross-domain progress, or AI provider routing.
- **Dependencies:** Profile for identity/locale; Wellbeing Profile for approved shared measurements; AI Assistance for proposals; Progress consumes approved nutrition facts.
- **Upstream / downstream:** Wellbeing Profile is upstream; Nutrition publishes meal/plan facts downstream to Progress and Communications.
- **Shared concepts:** `UserId`, approved `WellbeingProfileReference`, measurement units, date/time.
- **Duplicates to eliminate:** height/weight/body measurements in Nutrition, Gym, and User Profile; centralize their ownership in Wellbeing Profile.
- **Extraction readiness:** medium; safety, food-data, and regulatory decisions must precede extraction.

### 2.6 Gym AI → Wellbeing (Supporting)

- **Business purpose:** Manage user-owned workout plans and recorded workout sessions.
- **Owns:** fitness profile extensions, workout plans, workout sessions, exercise records, fitness-specific plan proposals.
- **Does not own:** nutrition records, medical advice, wearable integrations, cross-domain scoring, or AI governance.
- **Dependencies:** Wellbeing Profile; AI Assistance; Progress & Insights; Communications for approved reminders.
- **Upstream / downstream:** Workout completion is a downstream consumer of user/profile context and an upstream fact for Progress.
- **Shared concepts:** `UserId`, `WellbeingProfileReference`, units, time, exercise reference. Exercise catalog ownership is unresolved.
- **Duplicates to eliminate:** body measurements and plan-scheduling logic duplicated between Gym, Nutrition, and Life Planner.
- **Extraction readiness:** medium; workloads may justify extraction after device integrations or high session volume.

### 2.7 Islamic AI → Spirituality (Core)

- **Business purpose:** Support private spiritual progress and approved Islamic educational assistance with respectful governance.
- **Owns:** spiritual preferences, prayer-progress records, spiritual plans, approved content interaction metadata.
- **Does not own:** authoritative religious rulings, prayer-time calculations until an approved deterministic source exists, global user preferences, AI provider routing, or generic notifications.
- **Dependencies:** Profile for locale/time zone and ownership; a future deterministic prayer-time service only if approved; AI Assistance; Progress & Insights.
- **Upstream / downstream:** publishes private progress facts to Progress; consumes profile preferences; Communications consumes approved notification requests.
- **Shared concepts:** `UserId`, locale, time zone, spiritual progress fact. Prayer-time data must have a clearly named authoritative source.
- **Duplicates to eliminate:** location/time-zone preference duplication; generic plan state duplicated with Life Planner.
- **Extraction readiness:** medium-high because culturally specific governance and potential prayer-time workloads may later need independent ownership.

### 2.8 Language Learning → Learning (Supporting)

- **Business purpose:** Support user-owned language plans, sessions, and vocabulary progress.
- **Owns:** learning profile, language plan, learning sessions, vocabulary state and language-specific progress facts.
- **Does not own:** generic study material, external course enrollment, cross-domain progress, translation-provider contracts, or AI provider routing.
- **Dependencies:** Profile, AI Assistance, and Progress & Insights. Any speech, dictionary, or assessment provider is not yet approved.
- **Upstream / downstream:** publishes session and vocabulary facts to Progress; consumes identity, locale, and eligible AI capability.
- **Shared concepts:** `UserId`, language code, plan reference, learning-session fact.
- **Duplicates to eliminate:** generic `LearningPlan` copied into Study, Courses, and Language; use separate aggregates with controlled references unless an approved unified plan is defined.
- **Extraction readiness:** medium; retain inside Learning until curriculum and external-provider requirements make it independently owned.

### 2.9 Life Planner → Personal Planning (Core)

- **Business purpose:** Turn user-directed intent into a deliberate, user-controlled daily plan.
- **Owns:** life plans, daily plans, plan items, order, explicit completion/skip state, planner-specific preferences.
- **Does not own:** goal state, recurring scheduling policy until approved, external calendar state, AI scheduling authority, activity progress scoring, or notification delivery.
- **Dependencies:** Personal Direction for optional GoalReference; Profile for locale/time-zone; AI Assistance for proposals; Progress for consumption of completed-item facts.
- **Upstream / downstream:** Goal facts are upstream; Planner publishes item completion/skip facts to Progress and notification requests to Communications.
- **Shared concepts:** `UserId`, `GoalReference`, `PlanItemId`, time window only after scheduling requirements are approved.
- **Duplicates to eliminate:** “study plan,” “workout plan,” and “spiritual plan” must not each independently implement daily scheduling. Planner owns cross-domain daily scheduling; specialized plans own their content.
- **Extraction readiness:** high after plan/goal contracts stabilize; it is a strong future core-service candidate.

### 2.10 Progress Tracking → Progress & Insights (Core)

- **Business purpose:** Create auditable, deterministic cross-domain progress summaries from source-domain facts.
- **Owns:** progress ledger, metric definitions, derived summaries, reconciliation state, correction audit trail.
- **Does not own:** source module records, source lifecycle state, user preferences, dashboard layout, or AI calculations.
- **Dependencies:** receives versioned completion/progress integration events from every contributing domain; publishes derived summary events.
- **Upstream / downstream:** Goals, Planning, Learning, Wellbeing, and Spirituality are upstream; Dashboard projections and AI explanation requests are downstream.
- **Shared concepts:** `UserId`, `SourceEventId`, metric period, activity category, immutable progress fact.
- **Duplicates to eliminate:** completion percentages and streaks independently computed in source modules, Dashboard, or Copilot.
- **Extraction readiness:** high after event contracts, replay/reconciliation, and eventual-consistency UX are designed.

### 2.11 Dashboard → Progress & Insights projection (Generic presentation capability)

- **Business purpose:** Present an authorized, localized composition of existing user read models.
- **Owns:** dashboard layout/preferences if approved, widget projections, freshness metadata.
- **Does not own:** goals, plans, activities, progress calculations, notifications, or AI provider state.
- **Dependencies:** Profile for preferences; Progress & Insights and other read models for facts; Communications for notification feed.
- **Upstream / downstream:** entirely downstream of published facts and projections; it publishes no business fact.
- **Shared concepts:** `UserId`, widget contract, freshness marker. Widgets must reference source read models.
- **Duplicates to eliminate:** dashboard-owned “summary” tables that become alternative sources of truth.
- **Extraction readiness:** low as a service; it should remain a projection/API composition concern unless independent scale warrants a read-model service.

### 2.12 AI Copilot → AI Assistance (Supporting)

- **Business purpose:** Safely authorize, route, govern, observe, and record approved AI assistance for user-requested work.
- **Owns:** AI request lifecycle, capability authorization, redaction outcome metadata, provider-neutral response/proposal metadata, usage/quota records, applied-proposal audit links.
- **Does not own:** goals, plans, nutrition, workout, spiritual, learning, progress, business calculations, scheduling, or user permissions.
- **Dependencies:** Identity & Access, Profile/consent, feature entitlements, all requesting domains, provider adapters, and observability.
- **Upstream / downstream:** target domain requests assistance; AI Assistance returns a proposal to the target domain; it emits sanitized usage and reliability facts to operations.
- **Shared concepts:** `UserId`, AI capability, target aggregate reference, proposal envelope, correlation ID. Prompt content is not a shared mutable concept.
- **Duplicates to eliminate:** per-module provider SDK calls, provider selection rules, prompt logging, quotas, and proposal audit code.
- **Extraction readiness:** medium-high after its API, policy, and data-minimization boundaries are stable; it is a likely future platform service, not the owner of product domains.

## 3. Ownership conflicts and required resolutions

| Conflict | Risk | Required resolution |
|---|---|---|
| Identity mixed with User Profile | Security/account data may leak into preference workflows | Split Identity & Access from Profile & Personalization. |
| Body measurements in Profile, Nutrition, and Gym | Contradictory sensitive data and unclear deletion rules | Wellbeing owns body measurements; Profile may display an authorized summary only. |
| Goals versus Life Planner | Planner may incorrectly mutate goals or own goal completion | Goals own goal lifecycle; Planner owns plan items and uses GoalReference. |
| Specialized plans versus Life Planner | Study, workout, nutrition, and spiritual plans may each reinvent daily scheduling | Specialized domains own plan content; Personal Planning owns cross-domain daily schedule. |
| Source progress versus Progress Tracking | Multiple percentages/streaks become inconsistent | Source domains publish immutable facts; Progress & Insights owns derived cross-domain metrics. |
| Dashboard versus Progress Tracking | Dashboard could become a hidden source of calculations | Dashboard is read-only projection composition. |
| Module-specific AI | Inconsistent privacy, cost, and safety controls | AI Assistance owns provider interaction and governance; target domain owns validation/application. |
| Notification delivery scattered in modules | Duplicate or non-durable delivery | Communications owns durable notification and delivery; domains publish notification requests/facts. |

## 4. Cyclic dependencies and hidden coupling

### Prohibited cycles

1. **Goals ↔ Planner:** Goals may publish goal facts; Planner may reference GoalId. Planner must not require synchronous goal mutation to complete a plan item.
2. **Source domains ↔ Progress:** Source domains publish facts; Progress publishes summaries. Source domains must not synchronously depend on their own derived summary.
3. **AI Assistance ↔ target domains:** Target domains request a capability; AI returns an envelope. AI Assistance must not import or mutate target aggregates.
4. **Dashboard ↔ all domains:** Dashboard only consumes read models; no domain may depend on dashboard state.

### Hidden coupling to avoid

- Copying user locale, time zone, body measurements, goal completion, or notification settings into multiple writable models.
- Allowing AI prompts or outputs to become the data contract between business domains.
- Calling another domain's repository or table directly instead of using an approved contract/event.
- Treating a database foreign key as permission to share lifecycle ownership.
- Reusing a generic `Plan`, `Progress`, or `Profile` entity across unrelated aggregate boundaries.

## 5. Context Dependency Matrix

**Legend:** `P` = row publishes a business/integration event consumed by column; `R` = row requires a stable reference/read contract from column; `A` = row requests AI assistance; `N` = row requests notification delivery; `—` = no direct domain dependency. Rows are consumers/publishers; columns are counterpart domains.

| From \ To | I&A | Profile | Direction | Planning | Learning | Wellbeing | Spirituality | Progress | AI Assist | Comms |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Identity & Access (I&A) | — | P | — | — | — | — | — | — | — | N |
| Profile & Personalization | R | — | P | P | P | P | P | P | P | P |
| Personal Direction | R | R | — | P | — | — | — | P | A | N |
| Personal Planning | R | R | R | — | — | — | — | P | A | N |
| Learning | R | R | — | R | — | — | — | P | A | N |
| Wellbeing | R | R | — | R | — | — | — | P | A | N |
| Spirituality | R | R | — | R | — | — | — | P | A | N |
| Progress & Insights | R | R | R | R | R | R | R | — | A | N |
| AI Assistance | R | R | R | R | R | R | R | R | — | N |
| Communications | R | R | — | R | — | — | — | R | — | — |

Interpretation: the matrix permits one-way published facts and stable references, not shared write access. AI Assistance has references to target domains only to authorize and return a proposal envelope; target domains retain write ownership.

## 6. Module Communication Matrix

| Source module/domain | Target | Communication | Permitted payload | Ownership rule |
|---|---|---|---|---|
| Identity & Access | Profile | `AccountRegistered`, account status | UserId, lifecycle state | Profile creates its own profile record. |
| Profile | All user-owned domains | Stable profile contract | UserId, locale, time zone, allowed preferences | Recipients never write Profile data. |
| Goals | Personal Planning | Goal reference/facts | GoalId, owner, permitted status | Planner references; it does not update the goal. |
| Goals | Progress | Goal facts | GoalId, fact type, occurrence time | Progress derives summaries only. |
| Personal Planning | Progress | Plan-item facts | PlanItemId, category, completion/skip fact | Planner remains source of item state. |
| Learning: Study | Progress | Study-session facts | Workspace/session reference, completion fact | No study material content is sent. |
| Learning: Courses | Progress | Course progress facts | Enrollment reference, completion fact | External provider claims are not assumed. |
| Learning: Language | Progress | Learning facts | Plan/session/vocabulary fact | Progress does not assign proficiency. |
| Wellbeing: Nutrition | Progress | Nutrition activity facts | Meal/plan fact type, time, approved metric inputs | Raw sensitive details are minimized. |
| Wellbeing: Fitness | Progress | Workout facts | Session/exercise completion fact | Progress does not change workouts. |
| Spirituality | Progress | Spiritual activity facts | Private progress fact, time | No content or ruling data is sent. |
| Progress | Dashboard | Summary projection | Authorized summary, freshness metadata | Dashboard never recalculates source data. |
| All eligible domains | AI Assistance | AI capability request | Minimum authorized context, target reference | AI cannot write target state. |
| AI Assistance | Requesting domain | Proposal/result envelope | Provider-neutral result, audit/correlation ref | Target command validates and applies changes. |
| All domains | Communications | Notification request/fact | UserId, template key, safe parameters, urgency | Communications owns persistence/delivery. |
| Communications | Dashboard | Notification read model | Authorized notification summary | Dashboard displays; it does not deliver. |

## 7. Future Extraction Matrix

| Candidate boundary | Data it must exclusively own | Extraction trigger | Dependencies that must become contracts | Readiness | Principal blocker |
|---|---|---|---|---|---|
| Identity & Access | credentials, sessions, external identities, roles | dedicated security ownership, multiple clients, compliance need | account lifecycle and authorization claims | Medium | identity-provider and account-linking specification incomplete |
| Profile & Personalization | preferences, locale, time zone, consent | independent profile team or broad client use | profile reference/versioned preference events | High | privacy/consent policy incomplete |
| Personal Direction | goals and milestones | independent scale/team or goal integrations | GoalReference and goal fact events | Medium-High | lifecycle and metric rules incomplete |
| Personal Planning | daily plans and plan items | scheduling integrations or heavy planner workloads | goal references, completion facts, notification requests | High | scheduling/recurrence rules incomplete |
| Learning | study, courses, language data | OCR/content workloads or learning team ownership | session/progress events, AI proposal contract | Medium | curriculum, OCR, provider decisions incomplete |
| Wellbeing | nutrition, fitness, wellbeing profile | health integration or compliance separation | approved measurement reference and progress facts | Medium | safety, food, medical, and device requirements incomplete |
| Spirituality | spiritual preferences/progress | culturally specialized team or prayer-time integration | private progress facts and deterministic time data contract | Medium-High | prayer-time and content-governance policy incomplete |
| Progress & Insights | ledger, metrics, derived summaries | high projection/replay load | immutable source-event contracts | High | metric definitions and eventual-consistency UX incomplete |
| AI Assistance | requests, policy, usage, proposal metadata | independent AI scale/cost/security ownership | AI capability/proposal contracts | Medium-High | quotas, retention, provider policy incomplete |
| Communications | notification history, delivery preferences | high delivery scale or channel expansion | notification-request contract | High | consent, quiet-hours, provider selection incomplete |
| Dashboard | none beyond projection state | only if read traffic greatly exceeds core workload | versioned read models | Low | it is not a business source-of-truth boundary |

## 8. Ownership answers for cross-cutting concerns

### AI ownership

AI Assistance owns provider selection, capability authorization, redaction metadata, quotas, usage, retries, observability, and proposal envelopes. It does **not** own any business aggregate. The target domain owns the command that validates, accepts, rejects, and audits a proposal.

### Notification ownership

Communications owns notification persistence, user delivery preferences, channel dispatch, delivery outcome, and SignalR/email mechanics. Business domains own the fact that may request a notification and the meaning of the template parameters.

### Scheduling ownership

Personal Planning owns user-visible cross-domain daily planning. Specialized domains own their plan content. Hangfire owns technical execution of approved scheduled jobs; it does not own scheduling business rules. AI owns neither scheduling nor scheduled-job creation.

### Progress ownership

Each source domain owns its activity and completion facts. Progress & Insights owns cross-domain ledger entries, deterministic metric calculation, period summaries, reconciliation, and derived progress views. Dashboard only displays authorized projections.

### Data ownership

No domain may directly write another domain's tables or aggregates. Stable identifiers and versioned events are the default cross-domain mechanism. Sensitive wellbeing data belongs to Wellbeing, not User Profile; raw study material belongs to Learning; AI provider metadata belongs to AI Assistance.

## 9. Is the current modular decomposition optimal?

**No.** The current list is an appropriate product-module catalog but is not an optimal domain decomposition because:

1. It labels several domains with an implementation capability (“AI”), which would incorrectly distribute AI provider, privacy, and audit rules.
2. It treats Dashboard as a standalone module even though it should be a downstream projection without business-state ownership.
3. It separates Gym and Nutrition without defining a single owner for shared sensitive wellbeing measurements.
4. It does not distinguish Identity & Access from Profile & Personalization.
5. It does not establish a single owner for cross-domain progress, notifications, and daily scheduling.
6. It risks duplicating plan logic across Goals, Study, Gym, Nutrition, Islamic, Language, and Life Planner.

### Required redesign before Milestone 0.2

Adopt the ten logical domains in Section 1 as the working decomposition. Retain the approved twelve names as user-facing product areas and delivery slices, but do not create one Bounded Context, database ownership model, or microservice per name. Specifically:

- Reclassify **Study AI**, **Nutrition AI**, **Gym AI**, and **Islamic AI** as feature areas that use the shared AI Assistance domain.
- Fold **Dashboard** into Progress & Insights as a downstream projection and presentation capability.
- Establish **Identity & Access**, **Communications**, and **Wellbeing Profile** as explicit ownership boundaries.
- Keep Goals and Life Planner separate core domains connected by references/events, not shared writable state.

This redesigned decomposition removes the identified ownership conflicts and breaks the principal cyclic dependencies while preserving future extraction options.

## 10. Approval gates before Bounded Context design

Before Milestone 0.2, approve or amend:

1. The ten-domain topology and DDD classifications.
2. Wellbeing ownership of body measurements.
3. Personal Planning ownership of cross-domain daily scheduling.
4. Progress & Insights ownership of derived cross-domain metrics.
5. Communications ownership of durable notifications and delivery.
6. AI Assistance ownership of provider governance, with target domains owning all business-state changes.
7. Dashboard as a projection, not a domain source of truth.

The unresolved product rules listed in Event-Storming.md remain required inputs to detailed aggregate design.
