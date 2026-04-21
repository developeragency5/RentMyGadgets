import { describe, it, expect, beforeEach, vi } from "vitest";

const { mockSetTypeParser, mockParseTextArray } = vi.hoisted(() => ({
  mockSetTypeParser: vi.fn(),
  mockParseTextArray: vi.fn((val: string) => [`mocked:${val}`]),
}));

vi.mock("@neondatabase/serverless", () => ({
  types: {
    builtins: {
      BOOL: 16,
      TIMESTAMP: 1114,
      TIMESTAMPTZ: 1184,
    },
    setTypeParser: mockSetTypeParser,
  },
}));

vi.mock("../parseTextArray", () => ({
  parseTextArray: mockParseTextArray,
}));

import { registerNeonTypeParsers } from "../neonSetup";

function getParser(oid: number): (val: string) => unknown {
  const call = mockSetTypeParser.mock.calls.find((c: unknown[]) => c[0] === oid);
  if (!call) throw new Error(`No parser registered for OID ${oid}`);
  return call[1];
}

describe("registerNeonTypeParsers", () => {
  beforeEach(() => {
    mockSetTypeParser.mockClear();
    mockParseTextArray.mockClear();
    registerNeonTypeParsers();
  });

  it("registers parsers for BOOL, TIMESTAMP, TIMESTAMPTZ, and TEXT_ARRAY (1009)", () => {
    expect(mockSetTypeParser).toHaveBeenCalledTimes(4);
    const oids = mockSetTypeParser.mock.calls.map((c: unknown[]) => c[0]);
    expect(oids).toContain(16);
    expect(oids).toContain(1114);
    expect(oids).toContain(1184);
    expect(oids).toContain(1009);
  });

  describe("BOOL parser", () => {
    it('returns true for "t"', () => {
      expect(getParser(16)("t")).toBe(true);
    });

    it('returns true for "true"', () => {
      expect(getParser(16)("true")).toBe(true);
    });

    it("returns true for boolean true coerced to string", () => {
      expect(getParser(16)(true as unknown as string)).toBe(true);
    });

    it('returns false for "f"', () => {
      expect(getParser(16)("f")).toBe(false);
    });

    it('returns false for "false"', () => {
      expect(getParser(16)("false")).toBe(false);
    });

    it("returns false for arbitrary strings", () => {
      expect(getParser(16)("yes")).toBe(false);
      expect(getParser(16)("1")).toBe(false);
      expect(getParser(16)("")).toBe(false);
    });
  });

  describe("TIMESTAMP parser", () => {
    it("returns a Date for a valid timestamp string", () => {
      const result = getParser(1114)("2024-06-15 12:30:00");
      expect(result).toBeInstanceOf(Date);
      expect((result as Date).getFullYear()).toBe(2024);
    });

    it("returns null when value is null", () => {
      expect(getParser(1114)(null as unknown as string)).toBeNull();
    });
  });

  describe("TIMESTAMPTZ parser", () => {
    it("returns a Date for a valid timestamptz string", () => {
      const result = getParser(1184)("2024-06-15T12:30:00Z");
      expect(result).toBeInstanceOf(Date);
    });

    it("returns null when value is null", () => {
      expect(getParser(1184)(null as unknown as string)).toBeNull();
    });
  });

  describe("TEXT_ARRAY (OID 1009) parser", () => {
    it("delegates to parseTextArray", () => {
      const result = getParser(1009)("{hello,world}");
      expect(mockParseTextArray).toHaveBeenCalledWith("{hello,world}");
      expect(result).toEqual(["mocked:{hello,world}"]);
    });
  });
});
