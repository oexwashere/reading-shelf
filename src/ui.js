export const $ = (selector) => document.querySelector(selector);
export function node(tag, attributes = {}, ...children) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    if (key.startsWith("on"))
      element.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key === "class") element.className = value;
    else if (key === "value" || key === "checked" || key === "disabled")
      element[key] = value;
    else if (value !== false && value != null)
      element.setAttribute(key, String(value));
  }
  for (const child of children.flat(Infinity))
    if (child != null)
      element.append(
        child instanceof Node ? child : document.createTextNode(String(child)),
      );
  return element;
}
export function notice(message, error = false) {
  const e = $("#notice");
  e.textContent = message;
  e.classList.toggle("error", error);
}
export function read(key, fallback, validate) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return structuredClone(fallback);
    const data = JSON.parse(raw);
    if (!validate(data)) throw Error("Saved data is invalid.");
    return data;
  } catch {
    notice(
      "Saved data could not be loaded. A fresh workspace is shown; the old data has not been overwritten.",
      true,
    );
    return structuredClone(fallback);
  }
}
export function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    notice(
      "Browser storage is unavailable. Your changes work in this tab but are not saved.",
      true,
    );
    return false;
  }
}
export const id = () => crypto.randomUUID();
export function button(label, action, className = "secondary") {
  return node(
    "button",
    {
      type: "button",
      class: className,
      onClick: () => {
        try {
          action();
        } catch (e) {
          notice(e.message, true);
        }
      },
    },
    label,
  );
}
export function field(label, name, type = "text", value = "", options = {}) {
  const input =
    type === "select"
      ? node(
          "select",
          { name, required: true },
          ...options.choices.map((choice) =>
            node(
              "option",
              { value: choice.value ?? choice },
              choice.label ?? choice,
            ),
          ),
        )
      : node(type === "textarea" ? "textarea" : "input", {
          name,
          ...(type === "textarea" ? { rows: 3 } : { type }),
          required: options.required !== false,
          ...(options.min != null ? { min: options.min } : {}),
          ...(options.max != null ? { max: options.max } : {}),
          ...(options.step ? { step: options.step } : {}),
          ...(options.maxLength ? { maxlength: options.maxLength } : {}),
          placeholder: options.placeholder ?? "",
        });
  input.setAttribute("aria-label", label);
  input.value = value;
  return node("label", {}, node("span", {}, label), input);
}
export function form(fields, submit, label = "Save item") {
  return node(
    "form",
    {
      onSubmit: (event) => {
        event.preventDefault();
        try {
          submit(Object.fromEntries(new FormData(event.target)));
        } catch (e) {
          notice(e.message, true);
        }
      },
    },
    ...fields,
    node("button", { type: "submit", class: "primary" }, label),
  );
}
export function panel(title, ...children) {
  return node(
    "section",
    { class: "panel" },
    node("h2", {}, title),
    ...children,
  );
}
export function stat(label, value) {
  return node(
    "div",
    { class: "stat" },
    node("span", {}, label),
    node("strong", {}, value),
  );
}
export function empty(message) {
  return node("p", { class: "empty" }, message);
}
export function download(filename, text, type = "application/json") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = node("a", { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export const today = () => new Date().toLocaleDateString("en-CA");
export function localDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function csv(rows) {
  return rows
    .map((row) =>
      row
        .map((value) => '"' + String(value ?? "").replaceAll('"', '""') + '"')
        .join(","),
    )
    .join("\r\n");
}
export function mount(...children) {
  $("#app").replaceChildren(...children);
}
export function group(...children) {
  return node("div", { class: "group" }, ...children);
}
export function validateList(data, validator) {
  return Array.isArray(data) && data.length <= 2000 && data.every(validator);
}
export function removeItem(items, item, render) {
  if (confirm("Delete this item? This cannot be undone.")) {
    items.splice(items.indexOf(item), 1);
    render();
  }
}
