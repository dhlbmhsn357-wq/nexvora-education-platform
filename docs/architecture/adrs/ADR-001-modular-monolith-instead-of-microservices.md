# ADR-001: Modular Monolith Instead of Microservices

## Status

Accepted

## Context

LifePilot AI Version 1 is a personal consumer platform with twelve planned modules and an expected scale of 10,000 users and 1,000 concurrent users. The product needs strong domain boundaries, reliable delivery, and a future path to enterprise multi-tenancy, but it does not yet have independent team ownership, separately scalable workloads, or operational evidence that requires distributed services.

## Decision

Build Version 1 as a modular monolith. Modules will have explicit domain ownership and dependency boundaries inside one deployable application and primary database. Module interfaces must be designed so a module can be extracted later when justified by scale, ownership, deployment, or reliability requirements.

## Consequences

The platform gains simpler deployment, debugging, transactions, and local development while retaining deliberate boundaries. Teams must prevent cross-module coupling and direct access to another module's internal data. A future microservice extraction will require an approved ADR backed by measurable evidence.

## Alternatives Considered

- Microservices from day one: rejected because distributed-system complexity is not justified for Version 1.
- Unstructured monolith: rejected because it would make future extraction and ownership difficult.

