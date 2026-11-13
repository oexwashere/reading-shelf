# Design notes

## Scope

Keep a considered reading list, track your place, and remember what stayed with you.

## Implementation decisions

Book length and reading progress are validated as integer pages. Finishing a book fills its page count; lowering a finished book’s progress returns it to the reading shelf. Search spans titles, authors, and notes.

## Boundaries

There is no book metadata API, barcode scanner, reading-session timeline, or cloud synchronization. Page totals reflect current book progress, not a historical record of rereads. CSV export is a backup format; import is not implemented.

## Verification

Domain functions are tested with the Node built-in test runner; browser workflows are checked separately.

Tests describe expected behavior rather than depending on a live external service. CI configuration is included, but remote CI execution is not implied by local test results.
