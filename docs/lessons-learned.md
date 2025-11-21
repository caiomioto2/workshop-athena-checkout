# Lessons Learned: Payment API & Frontend

## Payment API Integration
-   **Issue**: 400 Bad Request from AbacatePay.
-   **Cause**: Mismatch between internal model (`phone`) and external API requirement (`cellphone`).
-   **Lesson**: Always validate payload structure against 3rd party API docs, especially for required fields. Error messages are the source of truth.
-   **Pattern**: Create a mapped payload object explicitly before sending, rather than spreading `...body`.

## Frontend Layout
-   **Issue**: Absolute positioned cards not centering.
-   **Fix**: Use `grid place-items-center` on the parent relative container.
-   **Lesson**: Framer Motion cards with absolute positioning need a structured parent context to align correctly.

## Project Hygiene
-   **Issue**: Duplicate API routes (`/api/payment` vs `/api/abacate-payment`).
-   **Fix**: Deleted the redundant one.
-   **Lesson**: Regularly audit `app/api` for unused or duplicate endpoints to prevent routing confusion.
