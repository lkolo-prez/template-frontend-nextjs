/**
 * Root-level loading UI rendered as a Suspense fallback during navigation.
 */
export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-4 px-6 py-16"
    >
      <span className="sr-only">Loading…</span>
      <div className="h-9 w-2/3 animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted" />
    </main>
  );
}
