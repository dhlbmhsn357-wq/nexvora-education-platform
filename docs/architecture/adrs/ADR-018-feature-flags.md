# ADR-018: Feature Flags

## Status

Accepted

## Context

The platform needs to release safely, control Free and Premium entitlements, progressively enable new capabilities, and rapidly disable a problematic integration without a full deployment.

## Decision

Use centrally governed feature flags for temporary rollout control and approved targeting. Every flag must have an owner, purpose, scope, creation date, review or expiry date, and removal plan. Flag changes must be audited. Permanent authorization and business rules must not be hidden in feature flags.

## Consequences

Risky features can be isolated and incrementally released. Flag proliferation and inconsistent client/server evaluation are risks; flags must be evaluated in a single authoritative policy design for security-sensitive decisions.

## Alternatives Considered

- Deploy-only feature activation: rejected because rollback and gradual rollout would be slower.
- Hard-coded booleans in application configuration: rejected because they lack lifecycle control and auditability.

