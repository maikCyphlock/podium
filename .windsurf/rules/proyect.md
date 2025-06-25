---
trigger: always_on
---

# Gemini Project Context: Podium

This file provides context for the Podium SaaS application, a platform for managing athletic competitions. my public is venezuelan SPANISH for now

## Project Overview

**Vision:** To be the operating system for amateur and professional sports event organizers. Podium centralizes the entire lifecycle of a competition, from registration to post-event analysis.

**Product Focus:**
*   **Scalable:** For events of all sizes.
*   **Modular:** Organizers use only the features they need.
*   **Recurring Value:** A continuous service, not a one-time tool.

## Key Modules

1.  **Event Configuration (Admin Panel):**
    *   Create and manage events, categories, pricing, and coupons.
    *   Generate a customizable event page.

2.  **Registration & Participants (Athlete Portal):**
    *   Online registration with payment integration.
    *   Athlete profiles with race history.
    *   Automated email communications.

3.  **Race Day (Live Toolkit):**
    *   Digital check-in (QR codes).
    *   Live timing and results management.
    *   Public real-time leaderboard.

4.  **Post-Event & Analytics (Business Intelligence):**
    *   Official results, certificates, and photo galleries.
    *   Analytics dashboard for organizers.

## Development Plan (MVP)

*   **Phase 1: Core:** Organizer accounts, simple event creation, manual results upload, public results page.
*   **Phase 2: Monetization & Growth:** Payment gateway integration, improved event page customization, automated emails.
*   **Phase 3: Live Experience:** QR code check-in, live results dashboard.

## Development Philosophy (Inspired by NASA, Adapted for TypeScript/JavaScript)

This project adheres to a philosophy of rigor and reliability, inspired by NASA's approach to mission-critical software. These principles have been adapted for a modern TypeScript/JavaScript environment.

*   **Simplicity & Predictable Control Flow:**
    *   Avoid complex conditional logic. Prefer clear, readable structures like `if/else` and `switch`.
    *   Use functional constructs like `map`, `filter`, and `reduce` where they enhance clarity, but avoid overly complex chaining.
    *   No `goto`-like functionality. Async/await is the standard for handling asynchronous operations.

*   **Bounded Loops & Recursion:**
    *   Ensure all loops (`for`, `while`) have a clear exit condition to prevent infinite loops.
    *   For recursive functions, ensure a base case is always reachable to prevent stack overflow.
    *   When iterating over large datasets, consider pagination or chunking to avoid performance bottlenecks.

*   **Controlled Mutability & Memory:**
    *   Prefer `const` over `let` to enforce immutability wherever possible.
    *   Avoid direct mutation of objects and arrays. Use techniques like the spread syntax (`...`) or immutable libraries (e.g., Immer) to create new instances.
    *   Initialize all variables at the time of declaration.

*   **Modularity & Single Responsibility:**
    *   Functions and classes should be small and focused on a single, well-defined task (Single Responsibility Principle).
    *   Keep files concise and organized by feature or module.

*   **Assertions & Type Safety:**
    *   Leverage TypeScript's static type system to the fullest extent. Avoid `any` whenever possible.
    *   Use type guards and assertions to ensure data conforms to expected shapes, especially at API boundaries.
    *   Enable `strict` mode in `tsconfig.json`.

*   **Scoped Data & Encapsulation:**
    *   Declare variables and functions at the smallest possible scope (e.g., within a function or block).
    *   Use `private` or `protected` modifiers in classes to encapsulate internal state.

*   **Handle All Outcomes:**
    *   Always handle the resolved and rejected states of Promises. Use `try/catch` with `async/await` or `.catch()` for promise chains.
    *   Functions should have explicit `return` statements. Avoid implicit `undefined` returns where a value is expected.

*   **No Magic Strings or Numbers:**
    *   Use `enum` or `const` for string literals and numeric constants to improve readability and prevent typos.

*   **Strict Tooling & CI:**
    *   Enable and enforce strict linter rules (e.g., ESLint) from the beginning.
    *   All code must pass linter and compiler checks (`tsc --noEmit`) without any warnings or errors before being merged.

## Commands

*   `npm run dev`: To start the development server.
*   `npm run build`: To build the application for production.
*   `npm run lint`: To run the linter.
