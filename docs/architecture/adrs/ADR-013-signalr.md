# ADR-013: SignalR

## Status

Accepted

## Context

Version 1 supports in-app notifications and may need timely user-visible updates. Polling would add avoidable latency and load for interactive notification scenarios.

## Decision

Use SignalR for authenticated, authorized real-time delivery of approved in-app events. Persistent notification history remains in the primary database; SignalR is a delivery channel, not a system of record. Clients must recover safely after disconnects and retrieve missed events through authorized APIs.

## Consequences

Users receive timely updates while durability remains independent of connection state. Hub methods and group membership must enforce authorization and user isolation; broad broadcast behavior is prohibited without explicit approval.

## Alternatives Considered

- Polling-only notifications: rejected because it is less efficient for real-time user updates.
- SignalR as notification persistence: rejected because connection delivery is not durable.

