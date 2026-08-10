# ADR-007: No Generic Repository Pattern

## Status

Accepted

## Context

EF Core DbContext already provides collection access, change tracking, transactions, and persistence. A generic repository would duplicate these abstractions and tends to hide query intent behind a lowest-common-denominator API.

## Decision

Do not introduce a generic repository or a generic unit-of-work wrapper. Use DbContext as the unit of work. Create an aggregate-specific repository only when it expresses a meaningful domain persistence boundary or encapsulates a complex persistence concern not appropriately handled by a query handler.

## Consequences

Queries remain explicit and optimized for their use cases. Repository interfaces, if created, must be domain-specific and must not expose generic CRUD operations. This prevents artificial abstractions while retaining appropriate persistence encapsulation.

## Alternatives Considered

- Generic `IRepository<T>`: rejected because it duplicates EF Core and obscures business intent.
- Repository for every entity: rejected because not every entity is an aggregate root or deserves its own abstraction.

