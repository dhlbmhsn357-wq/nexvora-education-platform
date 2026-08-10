# ADR-003: CQRS and MediatR

## Status

Accepted

## Context

The platform requires clear separation between state changes and data retrieval, centralized validation and authorization, and controllers that contain no business logic.

## Decision

Use CQRS in the Application layer. Commands express intentional state changes; queries retrieve data without changing state. Use MediatR to dispatch commands and queries from Presentation to Application handlers. Cross-cutting pipeline behaviors will host approved validation, logging, authorization, and transaction concerns.

## Consequences

Use cases become independently testable and controllers remain thin. CQRS does not require separate databases or event sourcing; Version 1 may use a shared SQL Server database while keeping command and query models logically separate.

## Alternatives Considered

- Service classes called directly from controllers: rejected because use-case boundaries and cross-cutting policy enforcement would be inconsistent.
- Separate command and query databases immediately: rejected because operational complexity is not yet justified.

