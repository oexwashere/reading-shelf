export const statuses = ["wish", "reading", "finished"];
export function book(data, id) {
  const title = data.title?.trim(),
    author = data.author?.trim() || "Unknown author";
  const pages = Number(data.pages),
    current = Number(data.current || 0),
    rating = Number(data.rating || 0);
  if (!title || title.length > 200 || author.length > 200)
    throw Error("Use a title and author under 200 characters.");
  if (
    !Number.isInteger(pages) ||
    pages < 1 ||
    pages > 100000 ||
    !Number.isInteger(current) ||
    current < 0 ||
    current > pages
  )
    throw Error(
      "Pages must be whole numbers; progress cannot exceed the book length.",
    );
  if (
    !statuses.includes(data.status) ||
    !Number.isInteger(rating) ||
    rating < 0 ||
    rating > 5
  )
    throw Error("Choose a valid shelf and rating.");
  return {
    id,
    title,
    author,
    pages,
    current: data.status === "finished" ? pages : current,
    status: data.status,
    rating,
    notes: (data.notes || "").slice(0, 4000),
  };
}
export function valid(b) {
  return (
    b &&
    typeof b.id === "string" &&
    typeof b.title === "string" &&
    typeof b.author === "string" &&
    typeof b.notes === "string" &&
    Number.isInteger(b.pages) &&
    b.pages >= 1 &&
    b.pages <= 100000 &&
    Number.isInteger(b.current) &&
    b.current >= 0 &&
    b.current <= b.pages &&
    statuses.includes(b.status) &&
    Number.isInteger(b.rating) &&
    b.rating >= 0 &&
    b.rating <= 5
  );
}
export function advance(b, value) {
  const current = Number(value);
  if (!Number.isInteger(current) || current < 0 || current > b.pages)
    throw Error("Choose a page between 0 and " + b.pages + ".");
  return {
    ...b,
    current,
    status:
      current === b.pages
        ? "finished"
        : b.status === "wish" || b.status === "finished"
          ? "reading"
          : b.status,
  };
}
export function filter(books, query = "", status = "all") {
  const term = query.trim().toLowerCase();
  return books.filter(
    (b) =>
      (status === "all" || b.status === status) &&
      (b.title + " " + b.author + " " + b.notes).toLowerCase().includes(term),
  );
}
export function summary(books) {
  return {
    finished: books.filter((b) => b.status === "finished").length,
    reading: books.filter((b) => b.status === "reading").length,
    pages: books.reduce((n, b) => n + b.current, 0),
  };
}
