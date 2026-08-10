# ADR-008: AI Gateway Pattern

## Status

Accepted

## Context

LifePilot AI uses multiple AI providers for limited assistive purposes. AI must not own business rules, calculations, scheduling, authorization, or irreversible decisions. Direct provider use throughout feature code would create policy, security, and operational inconsistencies.

## Decision

Create an Application-facing AI Gateway contract. Infrastructure implements provider adapters, routing, timeouts, retries, rate limits, redaction, audit metadata, cost and usage telemetry, and failure handling. AI responses are treated as untrusted proposals and are subject to deterministic Application validation before any state change.

## Consequences

Provider policy is centralized and testable, while Domain remains unaware of provider SDKs. The gateway becomes a critical control point and must have rigorous tests, observability, and least-data processing rules.

## Alternatives Considered

- Provider SDK calls from controllers or handlers: rejected because policy enforcement would be fragmented.
- A single provider-specific service: rejected because it conflicts with approved provider independence.

