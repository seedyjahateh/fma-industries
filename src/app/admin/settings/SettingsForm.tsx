"use client";

import { useActionState } from "react";

import { saveSettings, type ActionState } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/settings";
import { Field, Fieldset, TextArea, Toggle } from "@/components/admin/AdminChrome";

/** Pull the open/close pair for a given weekday out of the structured hours. */
function slot(settings: SiteSettings, day: string, fallback: [string, string]) {
  const entry = settings.openingHours.find((h) => h.days.includes(day));
  return { opens: entry?.opens ?? fallback[0], closes: entry?.closes ?? fallback[1] };
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(saveSettings, {});

  const weekday = slot(settings, "Monday", ["07:00", "18:00"]);
  const saturday = slot(settings, "Saturday", ["08:00", "14:00"]);

  return (
    <form action={formAction} className="space-y-6 pb-4">
      <Fieldset
        legend="Opening hours"
        hint="What customers read on the website. Write it however you say it, for example 7:00 AM – 6:00 PM, or Closed."
      >
        <Field label="Monday to Friday" name="hours_weekday" defaultValue={settings.hours.weekday} required />
        <Field label="Saturday" name="hours_saturday" defaultValue={settings.hours.saturday} required />
        <Field label="Sunday" name="hours_sunday" defaultValue={settings.hours.sunday} required />
      </Fieldset>

      <Fieldset
        legend="Hours for Google"
        hint="The same hours in 24-hour time. Google reads these to show whether you are open. Keep them matching the ones above."
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Weekdays open" name="weekday_opens" type="time" defaultValue={weekday.opens} required />
          <Field label="Weekdays close" name="weekday_closes" type="time" defaultValue={weekday.closes} required />
          <Field label="Saturday open" name="saturday_opens" type="time" defaultValue={saturday.opens} required />
          <Field label="Saturday close" name="saturday_closes" type="time" defaultValue={saturday.closes} required />
        </div>
      </Fieldset>

      <Fieldset legend="Emergency cover">
        <Toggle
          label="Advertise emergency service"
          name="emergency_available"
          defaultChecked={settings.emergency.available}
          hint="Only turn this on if you will genuinely answer the phone out of hours. It is on the front page and the emergency page."
        />
        <Field
          label="What to call it"
          name="emergency_label"
          defaultValue={settings.emergency.label}
          required
        />
      </Fieldset>

      <Fieldset legend="Contact">
        <Field
          label="Phone number as customers should see it"
          name="phone_display"
          defaultValue={settings.phoneDisplay}
          inputMode="tel"
          required
        />
        <Field
          label="Phone number for the call button"
          name="phone_e164"
          hint="International format, no spaces. For example +19804537227."
          defaultValue={settings.phoneHref.replace(/^tel:/, "")}
          inputMode="tel"
          required
        />
        <Toggle
          label="This number can receive text messages"
          name="sms_enabled"
          defaultChecked={Boolean(settings.smsHref)}
          hint="Adds a Text button next to Call on phones."
        />
        <Field
          label="Email for job requests"
          name="email"
          type="email"
          hint="Leave blank until you have one. The website hides email until it is filled in."
          defaultValue={settings.email ?? ""}
        />
      </Fieldset>

      <Fieldset
        legend="Brands you service"
        hint="One per line, or separated by commas. Cross off anything you do not work on."
      >
        <TextArea label="Brands" name="brands" rows={7} defaultValue={settings.brands.join("\n")} />
      </Fieldset>

      {state.error && (
        <p className="border border-alarm bg-panel-2 p-4 text-sm text-ink" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="border border-ink bg-panel-2 p-4 text-sm text-ink" role="status">
          {state.ok}
        </p>
      )}

      {/* Sticky so Save is always reachable without scrolling to the bottom of a
          long form on a phone. */}
      <div className="sticky bottom-0 -mx-5 border-t border-rule bg-panel/95 px-5 py-4 backdrop-blur">
        <button
          type="submit"
          disabled={pending}
          className="min-h-12 w-full bg-tape px-6 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-tape disabled:bg-panel-3 disabled:text-slate"
        >
          {pending ? "Saving" : "Save and update website"}
        </button>
      </div>
    </form>
  );
}
