import test from "node:test";
import assert from "node:assert/strict";
import { book, advance, filter, summary } from "../src/model.js";
const data = {
  title: "A Book",
  author: "Writer",
  pages: "200",
  current: "20",
  status: "reading",
  rating: "0",
};
test("finished shelf records all pages", () => {
  assert.equal(book({ ...data, status: "finished" }, "1").current, 200);
});
test("progress updates mark completion and allow correction", () => {
  const b = book(data, "1");
  const done = advance(b, 200);
  assert.equal(done.status, "finished");
  assert.equal(advance(done, 100).status, "reading");
  assert.throws(() => advance(b, 201));
});
test("search includes author and notes", () => {
  const b = book({ ...data, notes: "Beautiful prose" }, "1");
  assert.equal(filter([b], "PROSE", "reading").length, 1);
  assert.equal(filter([b], "", "wish").length, 0);
});
test("summary and validation use bounded integer pages", () => {
  assert.equal(summary([book(data, "1")]).pages, 20);
  assert.throws(() => book({ ...data, current: "201" }, "1"));
  assert.throws(() => book({ ...data, pages: "2.5" }, "1"));
});
