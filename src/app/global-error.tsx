"use client";

import { business } from "@/config/business";

/**
 * Last-resort boundary: catches failures in the root layout itself, so it has
 * to supply its own <html> and <body> and cannot rely on the design system
 * loading. Everything here is inline for that reason.
 *
 * Next 16 renamed this prop from `reset` to `retry`.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: "#edeff0",
          color: "#0e1417",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
        }}
      >
        <main style={{ maxWidth: "34rem", margin: "0 auto", padding: "2rem 1.5rem" }}>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#5d6870",
              fontFamily: "ui-monospace, Menlo, monospace",
            }}
          >
            Something went wrong
          </p>

          <h1
            style={{
              margin: "1.25rem 0 0",
              fontSize: 40,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            The site didn&apos;t load.
          </h1>

          <p style={{ margin: "1.25rem 0 0", fontSize: 17, lineHeight: 1.5, color: "#5d6870" }}>
            Our end, not yours. Call us and we&apos;ll sort your job out over the phone.
          </p>

          <a
            href={business.phoneHref}
            style={{
              display: "inline-block",
              marginTop: "1.75rem",
              padding: "14px 24px",
              background: "#f5c400",
              color: "#0e1417",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "0.08em",
            }}
          >
            {business.phoneDisplay}
          </a>

          <button
            type="button"
            onClick={retry}
            style={{
              display: "inline-block",
              marginTop: "1.75rem",
              marginLeft: 10,
              padding: "14px 24px",
              background: "transparent",
              border: "1px solid rgba(14,20,23,0.28)",
              color: "#0e1417",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            Try again
          </button>

          {error.digest && (
            <p style={{ marginTop: "2.5rem", fontSize: 12, color: "#5d6870" }}>
              Reference {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
