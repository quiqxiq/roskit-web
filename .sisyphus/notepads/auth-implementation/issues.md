# Issues - Auth Implementation

## Known: Password validation mismatch
Form requires min 7 chars, backend only requires min 1. Keeping stricter client-side validation as it's a UX improvement.

## Known: Test mocks outdated
Existing test files mock auth-store incorrectly — will be updated as part of Task 1 refactoring.

## Known: Backend required for real QA
Playwright QA scenarios require backend running at localhost:8080. Tests can still run in isolation.
