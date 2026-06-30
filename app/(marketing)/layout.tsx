import type { ReactNode } from "react";

/**
 * Layout for the `(marketing)` route group. Route groups let us share UI and
 * metadata across a set of routes without affecting the URL path — e.g. both
 * `/about` and future marketing pages render inside this shell.
 */
export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm">
        <a href="/" className="text-muted-foreground hover:underline">
          Home
        </a>
      </nav>
      {children}
    </div>
  );
}
