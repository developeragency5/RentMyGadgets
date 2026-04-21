import { describe, it, expect } from "vitest";
import { parseTextArray } from "./parseTextArray";

describe("parseTextArray", () => {
  it("returns empty array for non-string, non-array input", () => {
    expect(parseTextArray(null)).toEqual([]);
    expect(parseTextArray(undefined)).toEqual([]);
    expect(parseTextArray(42)).toEqual([]);
  });

  it("filters non-strings from native arrays", () => {
    expect(parseTextArray(["a", 1, "b", null])).toEqual(["a", "b"]);
  });

  it("parses JSON array strings", () => {
    expect(parseTextArray('["a","b"]')).toEqual(["a", "b"]);
  });

  it("returns empty array for malformed JSON", () => {
    expect(parseTextArray("[not json")).toEqual([]);
  });

  it("parses simple PostgreSQL arrays", () => {
    expect(parseTextArray("{a,b,c}")).toEqual(["a", "b", "c"]);
  });

  it("handles empty PostgreSQL array", () => {
    expect(parseTextArray("{}")).toEqual([]);
  });

  it("strips quotes from quoted PostgreSQL elements", () => {
    expect(parseTextArray('{"hello","world"}')).toEqual(["hello", "world"]);
  });

  it("handles quoted elements with commas", () => {
    expect(parseTextArray('{"url?a=1,b=2","simple"}')).toEqual(["url?a=1,b=2", "simple"]);
  });

  it("handles multiple quoted elements with commas", () => {
    expect(parseTextArray('{"a,b","c,d","e"}')).toEqual(["a,b", "c,d", "e"]);
  });

  it("handles backslash-escaped quotes inside quoted elements", () => {
    expect(parseTextArray('{"say \\"hi\\"",other}')).toEqual(['say "hi"', "other"]);
  });

  it("handles backslash-escaped backslashes", () => {
    expect(parseTextArray('{"path\\\\dir",other}')).toEqual(["path\\dir", "other"]);
  });

  it("treats NULL elements as empty strings", () => {
    expect(parseTextArray("{a,NULL,b}")).toEqual(["a", "", "b"]);
  });

  it("handles mixed quoted and unquoted elements", () => {
    expect(parseTextArray('{plain,"with,comma"}')).toEqual(["plain", "with,comma"]);
  });

  it("handles single element array", () => {
    expect(parseTextArray("{onlyone}")).toEqual(["onlyone"]);
  });

  it("handles single quoted element", () => {
    expect(parseTextArray('{"only,one"}')).toEqual(["only,one"]);
  });
});
