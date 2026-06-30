import type { Config } from "tailwindcss";

/**
 * Tailwind v4 is configured CSS-first in app/globals.css via @theme. This file
 * exists mainly to give editors and IntelliSense the content globs and to keep
 * a single discoverable place for any future JS-side configuration.
 */
export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
} satisfies Config;
