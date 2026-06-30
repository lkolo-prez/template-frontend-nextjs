import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { env } from "@/env";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">
          {env.client.NEXT_PUBLIC_APP_NAME}
        </h1>
        <p className="text-balance text-muted-foreground">
          A hardened Next.js 15 starter: App Router, React 19, TypeScript
          strict, Tailwind v4, TanStack Query, Zod, and a nonce-based CSP.
        </p>
      </header>

      <Card className="space-y-4">
        <h2 className="text-lg font-medium">Getting started</h2>
        <ul className="list-inside list-disc text-sm text-muted-foreground">
          <li>
            Edit <code className="font-mono">app/page.tsx</code> to change this
            page.
          </li>
          <li>
            Health endpoint:{" "}
            <code className="font-mono">/api/health</code>
          </li>
          <li>Run quality gates with `make security` and `pnpm test`.</li>
        </ul>
        <div className="flex gap-3">
          <Button asChild>
            <a href="/about">About this template</a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://github.com/aircloud/template-frontend-nextjs"
              rel="noreferrer noopener"
            >
              Source
            </a>
          </Button>
        </div>
      </Card>
    </main>
  );
}
