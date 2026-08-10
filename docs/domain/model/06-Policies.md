# LifePilot AI - Domain Model - Policies

**Status:** Milestone 0.3 draft for approval.

## Policy Rules

- Policies are deterministic rules that react to commands, events, or context.
- AI output can never be a policy.
- Policies may enqueue work or request notifications through application orchestration, but domain policy itself remains infrastructure-free.

## Policy Catalog

| Bounded Context | Policy | Trigger | Decision | Outcome |
|---|---|---|---|---|
| Identity & Access | Unique Email Policy | Register Account | Whether normalized email can be used | Create or reject User Account |
| Identity & Access | Verified Email Access Policy | Feature access attempt | Whether unverified user may access feature | Allow/deny verified-only behavior; exact feature list pending |
| Identity & Access | Refresh Token Rotation Policy | Token refresh | Whether token can rotate | Rotate/revoke/reject |
| Identity & Access | Admin Support Access Policy | Admin support action | Whether support access is permitted | Allow with audit or reject |
| Identity & Access | Role Mutation Policy | Assign/Revoke Role | Whether actor can mutate role | RoleAssigned/RoleRevoked or reject |
| Profile & Personalization | Locale Policy | Update Locale | Whether locale is Arabic/English | Update locale and derived direction |
| Profile & Personalization | Time-Zone Policy | Update Time Zone | Whether identifier follows approved standard | Update/reject; standard pending |
| Profile & Personalization | Profile Ownership Policy | Profile command | Whether actor owns profile | Allow/reject |
| Profile & Personalization | Consent Policy | Consent command | Whether consent purpose is approved | Record/withdraw or reject |
| Personal Direction | Goal Ownership Policy | Goal command | Whether actor owns Goal | Allow/reject |
| Personal Direction | Goal Lifecycle Policy | Goal state command | Whether transition is valid | Change state or reject |
| Personal Direction | Goal Progress Policy | Record progress | Whether progress fact is allowed | Record fact or reject |
| Personal Direction | Goal AI Proposal Policy | Apply proposal | Whether proposal targets this Goal and passes rules | Apply/reject proposal |
| Personal Planning | Daily Plan Ownership Policy | Daily plan command | Whether actor owns plan | Allow/reject |
| Personal Planning | Plan Item Transition Policy | Item state command | Whether transition is valid | Change item state or reject |
| Personal Planning | Planning Scheduling Policy | Time/recurrence/reminder request | Pending | No scheduling behavior until approved |
| Personal Planning | Plan AI Proposal Policy | Apply proposal | Whether proposal targets this Daily Plan and passes rules | Apply/reject proposal |
| Learning | Workspace Access Policy | Material/session command | Whether actor owns workspace/material | Allow/reject |
| Learning | Material Upload Policy | Upload request | Pending file/security rules | Accept/reject upload |
| Learning | Course Authority Policy | Course command | Whether course data is user-declared | Prevent provider verification claims |
| Learning | Language Assessment Policy | Level/proficiency change | Pending | No authoritative proficiency until approved |
| Learning | Learning AI Proposal Policy | Apply proposal | Whether proposal is valid for target learning aggregate | Apply/reject |
| Wellbeing | Sensitive Wellbeing Data Policy | Wellbeing access/write | Whether owner/authorized actor may access data | Allow/reject/audit where approved |
| Wellbeing | Body Measurement Ownership Policy | Measurement command | Whether Wellbeing owns and validates measurement | Record/correct or reject |
| Wellbeing | Nutrition Safety Policy | Nutrition recommendation/plan | Whether medical/calculation boundaries are respected | Allow/reject |
| Wellbeing | Workout Safety Policy | Workout recommendation/plan | Whether medical/injury boundaries are respected | Allow/reject |
| Wellbeing | Wellbeing AI Proposal Policy | Apply proposal | Whether proposal avoids diagnosis/calculation/scheduling | Apply/reject |
| Spirituality | Spiritual Privacy Policy | Spiritual command/read | Whether actor owns data | Allow/reject |
| Spirituality | Islamic Content Governance Policy | AI question/explanation | Whether request is allowed under cultural safety rules | Allow/reject/safe failure |
| Spirituality | Prayer-Time Authority Policy | Prayer-time request | Pending deterministic source and consent | Reject until approved |
| Spirituality | Spiritual AI Proposal Policy | Apply proposal | Whether proposal passes spiritual rules | Apply/reject |
| Progress & Insights | Source Fact Ingestion Policy | Source integration event | Whether fact source/type is approved and idempotent | Record or ignore/reject |
| Progress & Insights | Metric Calculation Policy | Summary update | Whether metric definition is approved | Calculate or block |
| Progress & Insights | Correction/Reconciliation Policy | Rebuild/repair | Whether repair is authorized and auditable | Rebuild/reconcile or reject |
| Progress & Insights | Dashboard Authorization Policy | Dashboard view | Which widgets/read models user may see | Compose projection |
| AI Assistance | AI Capability Policy | AI request | Whether capability is allowed | Authorize/reject |
| AI Assistance | Data Minimization Policy | Authorized AI request | What data may be sent to provider | Redacted request |
| AI Assistance | Provider Routing Policy | Redacted request | Which provider may handle it | Provider selected or failure |
| AI Assistance | AI Quota Policy | AI request | Whether usage limit allows request | Allow/reject; quota rules pending |
| AI Assistance | Proposal Application Policy | Target result callback | Whether proposal was applied/rejected by target | Record outcome |
| Communications | Notification Eligibility Policy | Notification request/source event | Whether notification may be created | Create/reject notification |
| Communications | Delivery Channel Policy | Notification created | Which channels are allowed | In-app/email selection |
| Communications | Reminder Timing Policy | Reminder request | Pending consent/quiet hours/frequency | No reminder timing until approved |
| Communications | Read State Policy | Mark notification read | Whether actor owns notification | Mark read or reject |

## Pending Policy Gates

- Privacy retention, deletion, export, and minor-consent rules.
- Notification consent, quiet hours, reminder timing, and delivery frequency.
- AI provider routing, quota, prompt retention, fallback, and safety policy.
- Progress metrics, periods, streaks, achievements, and scoring.
- Food database, nutrition calculations, workout catalog, prayer-time source, OCR provider, and language assessment.

