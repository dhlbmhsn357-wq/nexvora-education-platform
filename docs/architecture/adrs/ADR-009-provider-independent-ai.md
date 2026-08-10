# ADR-009: Provider-Independent AI

## Status

Accepted

## Context

OpenAI, Google Gemini, and Claude are approved integrations. Availability, price, quality, capabilities, data-processing terms, and regional behavior can differ by provider and evolve over time.

## Decision

Define provider-neutral AI request, response, capability, and error contracts behind the AI Gateway. Provider-specific SDKs, models, credentials, and payload transformations remain in Infrastructure adapters. Routing is configured by approved feature policy rather than hard-coded in business features.

## Consequences

The platform can test with fakes, change providers, and implement controlled fallback without rewriting use cases. A lowest-common-denominator abstraction must not erase required capabilities; feature contracts must explicitly declare the capabilities they require.

## Alternatives Considered

- Standardize on one provider: rejected because it creates avoidable vendor lock-in and resilience risk.
- Expose provider-specific models to Application: rejected because it couples product behavior to vendors.

