"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "./SettingsProvider";
import { PhoneIcon, MessageIcon, CameraIcon } from "./primitives";

/**
 * Mobile-only fixed action bar.
 *
 * Most traffic here is somebody on a phone standing next to broken equipment,
 * so the primary action never scrolls away. Hidden on the request form itself,
 * where it would compete with the form's own submit.
 */
export function StickyCallBar() {
  const pathname = usePathname();
  const settings = useSettings();
  if (pathname === "/request-service") return null;

  const canText = Boolean(settings.smsHref);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink bg-panel md:hidden">
      <div className={`grid ${canText ? "grid-cols-[1.5fr_1fr_1fr]" : "grid-cols-2"}`}>
        <a
          href={settings.phoneHref}
          className="flex items-center justify-center gap-2 bg-tape px-3 py-4 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink"
        >
          <PhoneIcon />
          Call now
        </a>

        {canText && (
          <a
            href={settings.smsHref!}
            className="flex items-center justify-center gap-2 border-l border-rule px-3 py-4 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink"
          >
            <MessageIcon />
            Text
          </a>
        )}

        <Link
          href="/request-service"
          className="flex items-center justify-center gap-2 border-l border-rule px-3 py-4 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink"
        >
          <CameraIcon />
          Request
        </Link>
      </div>
    </div>
  );
}
