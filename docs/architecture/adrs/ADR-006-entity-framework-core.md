# ADR-006: Entity Framework Core

## Status

Accepted

## Context

The backend requires a productive, testable persistence approach that supports SQL Server, migrations, transactions, and aggregate-focused data access in ASP.NET Core 9.

## Decision

Use Entity Framework Core as the primary object-relational mapper. DbContext represents the unit of work when transactional consistency is required. EF Core migrations are the controlled mechanism for schema evolution. Performance-critical queries may use explicitly approved EF Core projections or narrowly scoped SQL where measured evidence justifies it.

## Consequences

Persistence is integrated with the .NET stack and supports transactional use cases. Teams must avoid leaking EF tracking behavior into Presentation and must measure, index, and optimize expensive queries rather than bypassing EF Core by default.

## Alternatives Considered

- Dapper as the primary persistence mechanism: rejected because it would require more manual mapping and migration coordination.
- Raw ADO.NET: rejected because its implementation cost is not justified for the primary data-access path.
