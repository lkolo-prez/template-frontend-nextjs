import { isValidElement, type ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-nonce": "test-nonce" }),
}));

const { default: RootLayout, metadata } = await import("./layout");

describe("RootLayout", () => {
  it("passes the CSP nonce to the providers", async () => {
    const html = (await RootLayout({ children: "child" })) as ReactElement<{
      lang: string;
      children: ReactElement<{ children: ReactElement<{ nonce?: string }> }>;
    }>;
    expect(isValidElement(html)).toBe(true);
    expect(html.props.lang).toBe("en");
    const providers = html.props.children.props.children;
    expect(providers.props.nonce).toBe("test-nonce");
  });

  it("exposes site metadata", () => {
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });
});
