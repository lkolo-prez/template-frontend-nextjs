"use server";

import { contactSchema } from "@/lib/schemas";

export type ContactState = {
  ok: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

/**
 * Example server action wired for `useActionState`. It validates input with the
 * shared Zod schema on the server — never trust client-side validation alone.
 *
 * Server actions are POST-only and CSRF-protected by Next.js via the
 * `allowedOrigins` config in next.config.ts.
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the errors and try again.",
    };
  }

  // TODO: persist / forward to your backend (env.server.API_BASE_URL).
  return { ok: true, message: "Thanks — we'll be in touch." };
}
