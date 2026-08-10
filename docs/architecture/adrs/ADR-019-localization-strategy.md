# ADR-019: Arabic-First Localization Strategy

## Status

Accepted

## Context

Arabic is the default product language, English is supported, and both RTL and LTR experiences are mandatory. Localization affects UI layout, validation, notifications, dates, numbers, units, accessibility, and AI interactions.

## Decision

Design localization as a first-class cross-cutting capability. Persist UTC for time, retain or derive the user's display time zone through an approved profile design, and render dates, numbers, units, and text according to locale. All UI strings and API-safe user messages must use localization resources; RTL must be explicitly supported and tested.

## Consequences

Arabic quality is built into every feature rather than retrofitted later. Teams must avoid hard-coded display strings, handle bidirectional layout intentionally, and define translation ownership and fallback behavior before content-heavy features ship.

## Alternatives Considered

- English-first with later translation: rejected because Arabic is the default requirement.
- CSS-only RTL conversion: rejected because it does not cover content, accessibility, formatting, or interaction design.

