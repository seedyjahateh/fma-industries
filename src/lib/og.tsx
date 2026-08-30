import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { business } from "@/config/business";

/**
 * Shared Open Graph card renderer.
 *
 * Fonts have to be read from disk as real buffers: `next/font/google` keeps its
 * files inside the build and does not expose a path, so the faces are vendored
 * into src/assets instead. Satori accepts TTF, OTF and WOFF but NOT WOFF2,
 * which is why these are .woff.
 *
 * Satori supports only a subset of CSS. Notably every element with more than
 * one child needs an explicit `display: flex`, and there is no `gap` shorthand
 * inheritance, so the layout below is more verbose than the site's own markup.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const PANEL = "#edeff0";
const INK = "#0e1417";
const SLATE = "#5d6870";
const TAPE = "#f5c400";
const RULE = "rgba(14,20,23,0.14)";

/** Read once per server process rather than per request. */
let fontCache: { display: ArrayBuffer; mono: ArrayBuffer } | null = null;

async function fonts() {
  if (fontCache) return fontCache;
  const dir = join(process.cwd(), "src", "assets");
  const [display, mono] = await Promise.all([
    readFile(join(dir, "Archivo-Bold.woff")),
    readFile(join(dir, "IBMPlexMono-Medium.woff")),
  ]);
  fontCache = {
    display: display.buffer.slice(display.byteOffset, display.byteOffset + display.byteLength) as ArrayBuffer,
    mono: mono.buffer.slice(mono.byteOffset, mono.byteOffset + mono.byteLength) as ArrayBuffer,
  };
  return fontCache;
}

/** Hazard tape, drawn as discrete bars because satori has no repeating gradients. */
function TapeStrip() {
  return (
    <div style={{ display: "flex", height: 16, width: "100%" }}>
      {Array.from({ length: 60 }, (_, i) => (
        <div
          key={i}
          style={{ flex: 1, background: i % 2 === 0 ? TAPE : INK }}
        />
      ))}
    </div>
  );
}

export async function renderOgImage({
  eyebrow,
  title,
}: {
  /** Mono kicker, e.g. the service area or category. */
  eyebrow: string;
  /** Two or three words. Long titles wrap badly at this size. */
  title: string;
}) {
  const { display, mono } = await fonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: PANEL,
          fontFamily: "Archivo",
        }}
      >
        <TapeStrip />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "58px 64px",
          }}
        >
          {/* Wordmark */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ fontSize: 30, color: INK, letterSpacing: "-0.02em" }}>FMA</div>
            <div style={{ display: "flex", width: 44, height: 16, marginLeft: 14, marginRight: 14 }}>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{ flex: 1, background: i % 2 === 0 ? TAPE : INK }} />
              ))}
            </div>
            <div
              style={{
                fontFamily: "IBM Plex Mono",
                fontSize: 17,
                letterSpacing: "0.16em",
                color: SLATE,
              }}
            >
              INDUSTRIES
            </div>
          </div>

          {/* Statement */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "IBM Plex Mono",
                fontSize: 20,
                letterSpacing: "0.14em",
                color: SLATE,
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </div>
            <div
              style={{
                marginTop: 22,
                fontSize: title.length > 34 ? 76 : 96,
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                color: INK,
                textTransform: "uppercase",
                maxWidth: 1000,
              }}
            >
              {title}
            </div>
          </div>

          {/* Spec rail */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderTop: `1px solid ${RULE}`,
              paddingTop: 26,
              fontFamily: "IBM Plex Mono",
              fontSize: 19,
              letterSpacing: "0.1em",
              color: SLATE,
              textTransform: "uppercase",
            }}
          >
            <div style={{ display: "flex" }}>6 TRADES</div>
            <div style={{ display: "flex", margin: "0 18px" }}>·</div>
            <div style={{ display: "flex" }}>{business.yearsExperience}+ YEARS</div>
            <div style={{ display: "flex", margin: "0 18px" }}>·</div>
            <div style={{ display: "flex" }}>
              {business.address.city}, {business.address.state}
            </div>
            <div style={{ display: "flex", marginLeft: "auto", color: INK }}>
              {business.phoneDisplay}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Archivo", data: display, style: "normal", weight: 700 },
        { name: "IBM Plex Mono", data: mono, style: "normal", weight: 500 },
      ],
    }
  );
}
