# ADR-012: Hangfire

## Status

Accepted

## Context

The product requires reliable background processing for approved tasks such as email delivery, notification processing, scheduled maintenance, and retryable integration work. Long-running work must not occupy HTTP request threads.

## Decision

Use Hangfire for background and recurring jobs. Jobs must be idempotent, observable, authorized where applicable, and safe to retry. Job payloads must carry references rather than unnecessary sensitive data, and job execution must use the same Application-layer rules as synchronous workflows.

## Consequences

Background workloads gain persistence, retries, and operational visibility. Teams must define queue ownership, concurrency limits, retry policy, failure escalation, and idempotency for every job type.

## Alternatives Considered

- Fire-and-forget tasks in API processes: rejected because they are not reliable across restarts or scaling events.
- Azure Functions for all jobs: deferred; Hangfire is mandated and better suited to the initial modular-monolith workflow.

