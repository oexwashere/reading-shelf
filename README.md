# Reading Shelf

Keep a considered reading list, track your place, and remember what stayed with you.

## Features

- Wish list, currently reading, and finished shelves
- Page progress with validated totals
- Ratings, notes, search, and shelf filters
- Reading summaries and CSV backups

## Get started

![Application preview](screenshot.png)

Requires **Node.js 20+** for the development server and tests. The app has no runtime dependencies, package install step, or production build.

```sh
git clone https://github.com/oexwashere/reading-shelf.git
cd reading-shelf
npm start
```

Open `http://127.0.0.1:4186`. Override `PORT` to select a different development port. The server binds only to localhost. ES modules require an HTTP server; opening `index.html` through `file://` is unsupported.

## Your workspace

Start with the empty workspace and add your own records through the labeled forms. Changes are saved in browser storage after each action. Destructive operations are explicit; relevant removals ask for confirmation. Export controls download a local backup or portable report.

Use one browser tab at a time. There is no account or synchronization service. If browser storage is blocked, the app reports that changes cannot be retained.

## Verify

```sh
npm run check
npm test
```

The Node test suite checks the pure domain model, including invalid input and important boundary cases. GitHub Actions is configured for Node 20, 22, and 24. Chromium workflow and responsive-layout checks were also run during development; these are separate from the unit-test command.

## Deploy

Serve `index.html` and `src/` with any static host. Relative paths support project subdirectories. For GitHub Pages, select deployment from `main` and `/ (root)` in Pages settings. No secrets or API keys are needed.

## Architecture

`src/model.js` contains pure domain logic. `src/app.js` owns interactions and rendering. `src/ui.js` provides DOM creation, validated storage loading, forms, and exports. DOM text nodes are used for user-entered content; the app does not execute stored HTML. `server.mjs` is a small development-only static server.

Book length and reading progress are validated as integer pages. Finishing a book fills its page count; lowering a finished book’s progress returns it to the reading shelf. Search spans titles, authors, and notes.

## Limitations and data handling

There is no book metadata API, barcode scanner, reading-session timeline, or cloud synchronization. Page totals reflect current book progress, not a historical record of rereads. CSV export is a backup format; import is not implemented.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep changes focused and include a regression test when behavior changes.

## License

[MIT](LICENSE) · oexwashere
