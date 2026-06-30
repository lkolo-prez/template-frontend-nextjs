import { z } from "zod";

/**
 * Type-safe, validated environment access (t3-env style, no extra dependency).
 *
 * Rules:
 *  - Server-only secrets live in `serverSchema` and are NEVER referenced from
 *    client components. Importing `env.server` in a client bundle is a build
 *    error because of the runtime guard below.
 *  - Public values must be prefixed `NEXT_PUBLIC_` so Next.js inlines them and
 *    they are statically analyzable.
 */

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  // Example server-only configuration. Replace with real values.
  API_BASE_URL: z.string().url().default("https://api.aircloud.com.pl"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("AirCloud Frontend"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("https://app.aircloud.com.pl"),
});

function formatErrors(error: z.ZodError): string {
  return error.issues
    .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
    .join("\n");
}

const parsedServer = serverSchema.safeParse(process.env);
if (!parsedServer.success) {
  throw new Error(
    `Invalid server environment variables:\n${formatErrors(parsedServer.error)}`,
  );
}

// Only the NEXT_PUBLIC_* values are available in the browser bundle.
const parsedClient = clientSchema.safeParse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
if (!parsedClient.success) {
  throw new Error(
    `Invalid public environment variables:\n${formatErrors(parsedClient.error)}`,
  );
}

const isServer = typeof window === "undefined";

/**
 * Accessing server config in the browser is a programming error; throwing here
 * surfaces it during development rather than leaking values.
 */
export const env = {
  get server() {
    if (!isServer) {
      throw new Error("env.server may only be accessed on the server.");
    }
    return parsedServer.data;
  },
  client: parsedClient.data,
} as const;
