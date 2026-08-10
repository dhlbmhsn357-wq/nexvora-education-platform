# ADR-002: Clean Architecture

## Status

Accepted

## Context

LifePilot AI contains sensitive personal data, multiple external integrations, AI providers, and a required long-term technology stack. Business rules must remain testable and must not become coupled to HTTP, SQL Server, Azure, or provider SDKs.

## Decision

Organize the backend into Domain, Application, Infrastructure, Presentation, and Shared layers. Dependencies point inward: Presentation and Infrastructure depend on Application and Domain; Application depends on Domain; Domain remains framework-independent. Shared contains stable primitives and contracts only.

## Consequences

Business rules can be tested without infrastructure and integrations can be replaced with limited impact. The composition root may reference Infrastructure to register implementations. Layer boundaries must be enforced by solution structure and architecture tests.

## Alternatives Considered

- Layered API with business logic in controllers: rejected because it mixes delivery and domain concerns.
- Hexagonal architecture without the named layers: compatible in principle, but rejected as the primary terminology because Clean Architecture is the mandated project standard.

