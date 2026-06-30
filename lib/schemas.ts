import { z } from "zod";

/**
 * Shared Zod schemas. Reuse these on the server (server actions / route
 * handlers) and the client (form validation) so the contract stays in one
 * place and is inferred into TypeScript types.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2_000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const healthSchema = z.object({
  status: z.literal("ok"),
  uptime: z.number().nonnegative(),
  timestamp: z.string().datetime(),
  version: z.string(),
});

export type Health = z.infer<typeof healthSchema>;
