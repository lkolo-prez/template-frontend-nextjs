/**
 * Tailwind CSS v4 is wired through its PostCSS plugin. No tailwind.config.js is
 * required — theme tokens live in app/globals.css via @theme. A
 * `tailwind.config.ts` is still provided for editor tooling and content hints.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
