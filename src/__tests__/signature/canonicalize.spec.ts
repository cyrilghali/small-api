import { canonicalizeJson } from "#strategies/implementations/hmac-signature.strategy";
import { describe, expect, it } from "vitest";

describe("canonicalizeJson", () => {
  it.each([
    [null, "null"],
    ["hello", '"hello"'],
    [42, "42"],
    [true, "true"],
    [false, "false"],
  ])("primitives: %s", (input, expected) => {
    expect(canonicalizeJson(input)).toBe(expected);
  });

  it("should handle undefined", () => {
    expect(canonicalizeJson(undefined)).toBe(undefined);
  });

  it.each([
    [{ z: 1, a: 2, m: 3 }, '{"a":2,"m":3,"z":1}'],
    [{}, "{}"],
    [{ name: "John", city: "NYC", age: 30 }, '{"age":30,"city":"NYC","name":"John"}'],
    [{ z: -1, a: 0, m: 5 }, '{"a":0,"m":5,"z":-1}'],
    [{ price: 19.99, tax: 2.5 }, '{"price":19.99,"tax":2.5}'],
    [{ big: 9007199254740991 }, '{"big":9007199254740991}'],
    [{ empty: "", key: "value" }, '{"empty":"","key":"value"}'],
    [{ emoji: "🔐", name: "José" }, '{"emoji":"🔐","name":"José"}'],
    [{ z_key: 1, "a-key": 2 }, '{"a-key":2,"z_key":1}'],
  ])("objects: sorts keys %#", (input, expected) => {
    expect(canonicalizeJson(input)).toBe(expected);
  });

  it.each([
    [[3, 1, 2], "[3,1,2]"],
    [[], "[]"],
    [{ arr: [1], multi: [1, 2] }, '{"arr":[1],"multi":[1,2]}'],
    [[null, 42, "str", true, { n: "o" }], '[null,42,"str",true,{"n":"o"}]'],
  ])("arrays: preserve order %#", (input, expected) => {
    expect(canonicalizeJson(input)).toBe(expected);
  });

  it("nested structures sort at all levels", () => {
    const obj = {
      z: { inner_z: 1, inner_a: 2 },
      a: { inner_z: 3, inner_a: 4 },
    };
    expect(canonicalizeJson(obj)).toBe('{"a":{"inner_a":4,"inner_z":3},"z":{"inner_a":2,"inner_z":1}}');
  });

  it("deeply nested objects and arrays", () => {
    const obj = {
      data: {
        users: [
          { id: 2, active: false },
          { id: 1, active: true },
        ],
        meta: { count: 2, ts: "2025-01-01" },
      },
    };
    expect(canonicalizeJson(obj)).toBe('{"data":{"meta":{"count":2,"ts":"2025-01-01"},"users":[{"active":false,"id":2},{"active":true,"id":1}]}}');
  });

  it("same output regardless of key order", () => {
    const p1 = { userId: "123", currency: "USD", amount: 100 };
    const p2 = { currency: "USD", amount: 100, userId: "123" };
    const p3 = { amount: 100, userId: "123", currency: "USD" };

    expect(canonicalizeJson(p1)).toBe(canonicalizeJson(p2));
    expect(canonicalizeJson(p2)).toBe(canonicalizeJson(p3));
  });

  it("escapes and special characters in strings", () => {
    const obj = {
      newline: "line1\nline2",
      tab: "a\tb",
      quote: 'hello "world"',
    };
    const result = canonicalizeJson(obj);
    expect(result).toContain('\\"');
    expect(result).toContain("\\n");
    expect(result).toContain("\\t");
  });

  it("numeric string keys sort lexicographically", () => {
    const obj = { "10": "c", "1": "a", "2": "b" };
    expect(canonicalizeJson(obj)).toBe('{"1":"a","2":"b","10":"c"}');
  });

  it("mixed types at all nesting levels", () => {
    const obj = {
      bool: true,
      nil: null,
      arr: [true, false],
      nested: { val: null, num: 0 },
    };
    expect(canonicalizeJson(obj)).toBe('{"arr":[true,false],"bool":true,"nested":{"num":0,"val":null},"nil":null}');
  });

  it("very long strings", () => {
    const longStr = "x".repeat(1000);
    const obj = { content: longStr };
    const result = canonicalizeJson(obj);
    expect(result).toContain(longStr);
    expect(JSON.parse(result).content).toBe(longStr);
  });
});
