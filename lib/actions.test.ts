import { describe, expect, it } from "vitest";
import { submitContact } from "./actions";

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

describe("submitContact", () => {
  it("returns field errors for invalid input", async () => {
    const result = await submitContact({ ok: false }, form({ email: "nope" }));
    expect(result.ok).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.message).toMatch(/fix the errors/i);
  });

  it("accepts valid input", async () => {
    const result = await submitContact(
      { ok: false },
      form({
        name: "Ada Lovelace",
        email: "ada@example.com",
        message: "Hello from the contact form test.",
      }),
    );
    expect(result).toEqual({ ok: true, message: expect.any(String) });
  });
});
