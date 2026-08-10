# ADR-014: Azure Blob Storage

## Status

Accepted

## Context

The platform may require durable storage for user-uploaded files and generated artifacts. Storing binary content directly in SQL Server would increase database size and complicate lifecycle management.

## Decision

Use Azure Blob Storage for approved object storage. SQL Server stores authorized metadata and ownership records. Upload, download, file validation, malware-scanning policy, retention, deletion, and access-token strategy must be specified before file features are implemented.

## Consequences

Binary storage scales independently and aligns with Azure deployment. Objects must never be accessible by predictable public URLs unless explicitly approved; access must be scoped, time-bound, audited where required, and tied to ownership checks.

## Alternatives Considered

- SQL Server binary columns as the default file store: rejected due to scalability and operational costs.
- Local server filesystem: rejected because it is incompatible with containerized horizontal scaling.

