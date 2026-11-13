import {
  node,
  field,
  form,
  panel,
  stat,
  button,
  group,
  empty,
  mount,
  read,
  save,
  id,
  notice,
  download,
  csv,
  validateList,
} from "./ui.js";
import { book, valid, advance, filter, summary, statuses } from "./model.js";
const key = "reading-shelf.v1";
let items = read(key, [], (data) => validateList(data, valid));
let query = "",
  status = "all",
  editing = null;
function commit() {
  save(key, items);
  render();
}
function render() {
  const b = items.find((i) => i.id === editing);
  const total = summary(items);
  const editor = form(
    [
      field("Book title", "title", "text", b?.title || "", { maxLength: 200 }),
      field("Author", "author", "text", b?.author || "", {
        required: false,
        maxLength: 200,
      }),
      field("Total pages", "pages", "number", b?.pages || "", {
        min: 1,
        max: 100000,
      }),
      field("Current page", "current", "number", b?.current || 0, {
        min: 0,
        max: 100000,
      }),
      field("Shelf", "status", "select", b?.status || "wish", {
        choices: statuses,
      }),
      field("Rating", "rating", "select", b?.rating || 0, {
        choices: [
          { value: 0, label: "Not rated" },
          ...[1, 2, 3, 4, 5].map((n) => ({ value: n, label: n + " / 5" })),
        ],
      }),
      field("Notes", "notes", "textarea", b?.notes || "", {
        required: false,
        maxLength: 4000,
      }),
    ],
    (data) => {
      const entry = book(data, editing || id());
      items = items.filter((i) => i.id !== entry.id).concat(entry);
      editing = null;
      commit();
      notice("Book saved.");
    },
    editing ? "Save book" : "Add to shelf",
  );
  const search = field("Search books", "search", "search", query, {
    required: false,
  });
  search.querySelector("input").addEventListener("change", (e) => {
    query = e.target.value;
    render();
  });
  const shelves = field("Shelf filter", "shelf", "select", status, {
    choices: ["all", ...statuses],
  });
  shelves.querySelector("select").addEventListener("change", (e) => {
    status = e.target.value;
    render();
  });
  const visible = filter(items, query, status);
  mount(
    node(
      "div",
      { class: "stats" },
      stat("Finished", total.finished),
      stat("Reading now", total.reading),
      stat("Pages read", total.pages),
    ),
    node(
      "div",
      { class: "grid" },
      panel(
        editing ? "Revisit the details" : "A new chapter",
        editor,
        ...(editing
          ? [
              button("Cancel editing", () => {
                editing = null;
                render();
              }),
            ]
          : []),
      ),
      panel(
        "Your shelf",
        node("div", { class: "toolbar" }, search, shelves),
        ...(visible.length
          ? visible.map((b) =>
              node(
                "article",
                { class: "task" },
                group(
                  node("span", { class: "badge" }, b.status),
                  ...(b.rating
                    ? [node("span", { class: "small" }, "★".repeat(b.rating))]
                    : []),
                ),
                node("h3", {}, b.title),
                node("p", {}, b.author),
                node(
                  "div",
                  {
                    class: "progress",
                    "aria-label": `${b.current} of ${b.pages} pages`,
                  },
                  node("span", {
                    style: `width:${(b.current / b.pages) * 100}%`,
                  }),
                ),
                node(
                  "p",
                  { class: "small" },
                  `${b.current} / ${b.pages} pages`,
                ),
                ...(b.notes ? [node("p", {}, b.notes)] : []),
                group(
                  button("Update page", () => {
                    const value = prompt(
                      "What page are you on?",
                      String(b.current),
                    );
                    if (value !== null) {
                      items = items.map((i) =>
                        i.id === b.id ? advance(i, value) : i,
                      );
                      commit();
                    }
                  }),
                  button("Edit", () => {
                    editing = b.id;
                    render();
                    document.querySelector("[name=title]").focus();
                  }),
                  button(
                    "Delete",
                    () => {
                      if (confirm("Remove this book?")) {
                        items = items.filter((i) => i.id !== b.id);
                        commit();
                      }
                    },
                    "danger",
                  ),
                ),
              ),
            )
          : [empty("A good book is a good beginning. Add one to your shelf.")]),
        button("Export CSV", () =>
          download(
            "reading-shelf.csv",
            csv([
              [
                "title",
                "author",
                "pages",
                "current",
                "shelf",
                "rating",
                "notes",
              ],
              ...items.map((b) => [
                b.title,
                b.author,
                b.pages,
                b.current,
                b.status,
                b.rating,
                b.notes,
              ]),
            ]),
            "text/csv",
          ),
        ),
      ),
    ),
  );
}
render();
