# ADR-004: Vertical Slice Architecture

## Status

Accepted

## Context

LifePilot AI has multiple independently valuable product capabilities. Organizing Application code only by technical type would scatter a single user outcome across many folders and make ownership difficult.

## Decision

Organize Application features by business capability. A vertical slice owns its command or query, handler, validation, authorization, mapping, tests, and related contracts. Shared cross-cutting behavior remains centralized only when it is genuinely common.

## Consequences

Features are easier to discover, review, test, and deliver incrementally. Duplicate abstractions must not be introduced prematurely; extraction into shared code requires demonstrated reuse and ownership clarity.

## Alternatives Considered

- Technical folders such as Controllers, Services, Repositories, and DTOs: rejected because they fragment a feature across the solution.
- Fully independent deployable service per feature: rejected because it conflicts with the modular-monolith decision.

