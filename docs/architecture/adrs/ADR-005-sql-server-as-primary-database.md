# ADR-005: SQL Server as Primary Database

## Status

Accepted

## Context

Version 1 needs transactional persistence for identity, goals, plans, progress, entitlements, and audit records. The mandatory technology stack specifies SQL Server and the platform is Azure-ready with UAE North as the primary region.

## Decision

Use SQL Server as the primary system of record. Production deployment will use an Azure-supported SQL Server offering selected during infrastructure design. UTC is the canonical persisted time standard. Redis, Blob Storage, and background-job storage do not replace SQL Server as the authoritative source for core business data.

## Consequences

The system receives mature relational transactions, integrity constraints, backup capabilities, and Azure integration. Schema migrations, indexing, retention, and restore procedures require deliberate governance.

## Alternatives Considered

- PostgreSQL: rejected because SQL Server is mandatory for this project.
- NoSQL as the primary store: rejected because core Version 1 workflows require relational integrity and transactions.

