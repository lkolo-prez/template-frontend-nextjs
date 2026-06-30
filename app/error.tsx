"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Route-segment error boundary. Receives the thrown error and a `reset`
 * function to retry rendering. We deliberately do not render `error.message`
 * to the user in production to avoid leaking internals.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hook your observability client here (e.g. report to Sentry/OTel).
    // The `digest` correlates client errors with server logs.
    console.error("Unhandled route error", { digest: error.digest });
  }, [error]);

  return (
    <main
      role="alert"
      className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        An unexpected error occurred. You can try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
