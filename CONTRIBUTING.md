# Contributing to Reading Shelf

Describe the problem, expected behavior, and a minimal example in an issue or pull request. Keep unrelated changes separate.

Before submitting, run:

```sh
npm run check && npm test
```

Add regression coverage for calculations, parsing, or state transitions. UI changes should be checked with keyboard input and a narrow screen. Do not add external services, analytics, or hidden data transmission. Keep examples synthetic and never include credentials or private datasets.

Keep domain logic separate from rendering and preserve local-only persistence.
