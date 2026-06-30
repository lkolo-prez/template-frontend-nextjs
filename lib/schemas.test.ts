import { describe, expect, it } from "vitest";
import { contactSchema } from "./schemas";

describe("contactSchema", () => {
  it("accepts a valid payload", () => {
    const result = contactSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Hello there, this is a valid message.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({
      name: "Ada",
      email: "not-an-email",
      message: "Hello there, this is a valid message.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a short message", () => {
    const result = contactSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      message: "too short",
    });
    expect(result.success).toBe(false);
  });
});
