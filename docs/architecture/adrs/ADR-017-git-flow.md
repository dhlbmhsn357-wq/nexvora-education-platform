# ADR-017: Git Flow

## Status

Accepted

## Context

The project requires controlled releases, GitHub source control, parallel feature development, and a clear separation between stable production code and ongoing development.

## Decision

Adopt Git Flow with protected `main` and `develop` branches, feature branches for new work, and controlled release and hotfix branches as required. Changes enter protected branches only through reviewed pull requests and required automated quality checks.

## Consequences

Release history and stabilization are explicit. The team must avoid long-lived feature branches, define branch protection and review policy, and keep deployment configuration compatible with the chosen branching model.

## Alternatives Considered

- Trunk-based development: rejected because Git Flow is the mandated source-control model.
- Direct commits to main: rejected because it lacks adequate review and release controls.

