"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

/**
 * Client-side providers. We create the QueryClient lazily with useState so each
 * browser session gets a stable instance and we never share state between
 * requests on the server.
 */
export function Providers({
  children,
  nonce,
}: {
  children: ReactNode;
  // Forwarded from middleware so any provider emitting inline content can pass
  // the CSP nonce along if needed.
  nonce?: string | undefined;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  void nonce;

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
