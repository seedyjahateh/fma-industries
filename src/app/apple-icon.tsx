import { ImageResponse } from "next/og";

/**
 * iOS home-screen icon. Safari does not use icon.svg, so this renders the same
 * mark as a PNG at the size Apple asks for. No text: at 180px on a home screen
 * the chevrons read and letterforms do not.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e1417",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 64 64">
          <g fill="#f5c400">
            <path d="M14 44 L28 20 h9 L23 44 Z" />
            <path d="M31 44 L45 20 h9 L40 44 Z" />
          </g>
        </svg>
      </div>
    ),
    size
  );
}
