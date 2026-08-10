# ADR-020: Logging and Observability

## Status

Accepted

## Context

LifePilot AI has sensitive data, asynchronous jobs, real-time connections, AI providers, and a 99.9% availability target. Production operation requires evidence-based diagnosis and alerting without exposing private information.

## Decision

Use structured Serilog logging together with centralized metrics, distributed tracing, dependency health checks, correlation identifiers, dashboards, alerts, and operational runbooks. Instrument HTTP requests, MediatR use cases, SQL Server, Redis, Blob Storage, Hangfire, SignalR, authentication, and AI Gateway calls. Logging must follow approved redaction and retention policies.

## Consequences

The platform can detect, investigate, and measure failures across synchronous and asynchronous workflows. Observability adds operational cost and data-handling responsibility; telemetry must be access-controlled, sampled appropriately, and prohibited from recording secrets, tokens, or unnecessary sensitive personal data.

## Alternatives Considered

- Console logs only: rejected because they do not support production diagnosis or alerting.
- Provider-specific telemetry scattered across features: rejected because it prevents consistent correlation and privacy controls.

