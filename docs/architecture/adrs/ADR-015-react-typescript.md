# ADR-015: React and TypeScript

## Status

Accepted

## Context

LifePilot AI requires a modern, accessible, localized web client with Arabic-first RTL support, robust forms, server-state handling, and a future mobile-client path.

## Decision

Build the web frontend with React 19, TypeScript, Vite, Tailwind CSS, Shadcn UI, TanStack Query, React Hook Form, and Zod. TypeScript strictness, accessible components, localization, and RTL/LTR support are mandatory. The web client consumes versioned API contracts and contains presentation logic only.

## Consequences

The frontend receives a typed, component-based foundation and prescribed libraries. Business rules and authorization decisions remain authoritative on the backend; frontend validation improves user experience but never replaces server validation.

## Alternatives Considered

- JavaScript React: rejected because type safety is required for a large platform.
- Server-rendered MVC as the primary client: rejected because React 19 and Vite are mandated.

