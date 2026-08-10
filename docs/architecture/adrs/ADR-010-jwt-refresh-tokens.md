# ADR-010: JWT and Refresh Tokens

## Status

Accepted

## Context

Version 1 requires email/password and Google authentication, role-based authorization, stateless API access, session revocation, and secure long-lived sign-in behavior.

## Decision

Use short-lived signed JWT access tokens and rotating refresh tokens. Refresh tokens must be stored securely in hashed form, be single-use where rotation applies, support expiry and revocation, and be associated with a session/device record. Authorization uses explicit role and policy checks.

## Consequences

The API can scale statelessly while retaining revocation capability. Token issuance, storage transport, cookie policy, lifetime values, and Google account-linking rules must be specified in the authentication security design before implementation.

## Alternatives Considered

- Long-lived JWTs without refresh tokens: rejected because revocation and breach containment are inadequate.
- Server-side session cookies only: rejected because JWT and refresh tokens are mandated for this platform.

