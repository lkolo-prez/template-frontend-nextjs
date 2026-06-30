import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About the AirCloud Next.js frontend template.",
};

export default function AboutPage() {
  return (
    <article className="prose-sm space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">About</h1>
      <p className="text-muted-foreground">
        This page lives in the <code>(marketing)</code> route group, which
        demonstrates how to organize related routes and share layout without
        leaking the group name into the URL.
      </p>
      <p className="text-muted-foreground">
        The template ships with strict security defaults: a per-request CSP
        nonce, HSTS, and a hardened CI/CD supply chain (SBOM, keyless cosign
        signing, SLSA provenance, Trivy, CodeQL, and OpenSSF Scorecard).
      </p>
    </article>
  );
}
