/**
 * Tiny className combiner. Filters falsy values and joins with a space.
 * Intentionally dependency-free; swap for `clsx`+`tailwind-merge` if you need
 * conflict resolution between Tailwind utilities.
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}
