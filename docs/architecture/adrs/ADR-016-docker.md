# ADR-016: Docker

## Status

Accepted

## Context

The platform must be reproducible across developer machines, CI, staging, and Azure-ready deployment environments. Its dependencies include SQL Server, Redis, object storage emulation, API, and frontend components.

## Decision

Containerize deployable application components with Docker. Provide a controlled local development composition for required dependencies. Images must be reproducible, minimized, vulnerability-scanned, configured through environment-specific settings, and must not contain secrets.

## Consequences

Local and CI environments become more consistent and deployments gain portability. Docker configuration requires active maintenance, image patching, health checks, non-root execution where feasible, and clear separation of development-only dependencies from production architecture.

## Alternatives Considered

- Manual local dependency installation: rejected because it is difficult to reproduce and support.
- VM-only deployment: rejected because Docker is mandatory and less portable.

