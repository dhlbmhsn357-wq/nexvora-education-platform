# ADR-011: Redis

## Status

Accepted

## Context

The platform needs distributed caching, rate-limiting support, and ephemeral coordination across horizontally scalable API instances. SQL Server should remain the primary system of record.

## Decision

Use Redis for approved distributed cache and ephemeral workload scenarios. Each cache entry must have an owner, user/authorization-aware key strategy where applicable, expiry, invalidation rule, and stale-data tolerance. Redis must not be the sole authoritative store for core business data.

## Consequences

Read performance and distributed coordination can improve without sacrificing correctness. Cache failure must degrade safely, and sensitive data, credentials, and tokens are prohibited from caching unless a separate approved security design permits it.

## Alternatives Considered

- In-memory cache only: rejected because it does not work consistently across multiple instances.
- SQL Server as a general-purpose cache: rejected because it adds unnecessary load to the primary database.

