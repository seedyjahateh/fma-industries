"use client";

import { useMemo, useRef, useState } from "react";

import { useSettings } from "./SettingsProvider";
import { services } from "@/config/services";
import { areas, additionalTowns } from "@/config/areas";
import { resizeImage, MAX_PHOTOS, MAX_PHOTO_BYTES, MAX_TOTAL_BYTES } from "@/lib/resizeImage";
import { ArrowIcon, CameraIcon, CheckIcon, PhoneIcon, BoltIcon } from "./primitives";

const URGENCY = [
  { value: "emergency", label: "Emergency, down right now", hint: "Losing product or revenue" },
  { value: "today", label: "Today if possible", hint: "Working badly, needs attention fast" },
  { value: "this-week", label: "This week", hint: "Not urgent, shouldn't wait" },
  { value: "quote", label: "Quote for planned work", hint: "Replacement, install, or an agreement" },
] as const;

const CONTACT_WINDOWS = ["Any time", "Morning", "Afternoon", "Evening", "Before we open", "After we close"];
const cityOptions = [...areas.map((a) => a.city), ...additionalTowns].sort();

type Status = "idle" | "submitting" | "success" | "error";
const STEPS = ["Property", "Problem", "Equipment", "Contact"] as const;

/* -------------------------------------------------------------------------
   Field primitives
------------------------------------------------------------------------- */

const inputClass =
  // Placeholders carry example values, so they are content and take the full
  // 4.5:1 bar. slate-dim would put them at 3.34:1.
  "w-full border border-rule bg-panel px-3.5 py-3 text-sm text-ink placeholder:text-slate focus:border-ink focus:outline-none";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label flex items-baseline gap-1.5 text-slate">
        {label}
        {required && <span className="text-alarm">*</span>}
      </span>
      {hint && <span className="mt-1 block text-xs text-slate">{hint}</span>}
      <span className="mt-2.5 block">{children}</span>
    </label>
  );
}

function Choice({
  selected,
  onClick,
  title,
  hint,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-start gap-3.5 border p-4 text-left transition-colors ${
        selected ? "border-ink bg-panel-2" : "border-rule bg-panel hover:border-rule-strong"
      }`}
    >
      <span
        aria-hidden
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
          selected ? "border-ink bg-tape text-ink" : "border-rule-strong"
        }`}
      >
        {selected && <CheckIcon className="h-2.5 w-2.5" />}
      </span>
      <span>
        <span className="font-display-tight block text-sm uppercase text-ink">{title}</span>
        {hint && <span className="mt-1 block text-xs leading-snug text-slate">{hint}</span>}
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------
   Form
------------------------------------------------------------------------- */

export function IntakeForm() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const [propertyType, setPropertyType] = useState<"business" | "home" | null>(null);
  const [serviceSlug, setServiceSlug] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoNotice, setPhotoNotice] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedService = useMemo(
    () => services.find((s) => s.slug === serviceSlug),
    [serviceSlug]
  );
  const settings = useSettings();
  const emergencyPhone = settings.emergency;
  const isEmergency = urgency === "emergency";

  async function onPhotosPicked(fileList: FileList | null) {
    if (!fileList?.length) return;
    setPhotoNotice(null);

    const incoming = Array.from(fileList);
    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) {
      setPhotoNotice(`Maximum ${MAX_PHOTOS} photos.`);
      return;
    }

    const accepted: File[] = [];
    let total = photos.reduce((sum, f) => sum + f.size, 0);

    for (const file of incoming.slice(0, room)) {
      if (file.size > MAX_PHOTO_BYTES) {
        setPhotoNotice(`"${file.name}" is over 8MB.`);
        continue;
      }
      const resized = await resizeImage(file);
      if (total + resized.size > MAX_TOTAL_BYTES) {
        setPhotoNotice("Size limit reached. Remove one to add another.");
        break;
      }
      total += resized.size;
      accepted.push(resized);
    }

    if (incoming.length > room) {
      setPhotoNotice(`Only the first ${room} added.`);
    }

    setPhotos((prev) => [...prev, ...accepted]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const canAdvance = [Boolean(propertyType && serviceSlug), Boolean(urgency), true, true][step];

  function go(next: number) {
    setStep(next);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setError(null);

    const data = new FormData(event.currentTarget);
    data.set("propertyType", propertyType ?? "");
    data.set("service", selectedService?.name ?? "");
    data.set("serviceSlug", serviceSlug ?? "");
    data.set("urgency", urgency ?? "");
    data.set("urgencyLabel", URGENCY.find((u) => u.value === urgency)?.label ?? "");
    data.set("symptoms", symptoms.join(", "));
    photos.forEach((photo) => data.append("photos", photo));

    try {
      const response = await fetch("/api/request-service", { method: "POST", body: data });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Something went wrong sending your request.");
      }
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  /* --------------------------- Success --------------------------- */

  if (status === "success") {
    return (
      <div className="border border-ink bg-panel">
        <div className="tape-stripes h-2" aria-hidden />
        <div className="p-8 text-center md:p-12">
          <span className="mx-auto flex h-12 w-12 items-center justify-center bg-tape text-ink">
            <CheckIcon className="h-5 w-5" />
          </span>

          <h2 className="font-display mt-7 text-h3 uppercase text-ink">Request received</h2>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-slate">
            {isEmergency ? (
              <>
                Marked as an emergency.{" "}
                <strong className="text-ink">Call {emergencyPhone.display} now</strong> if the
                equipment is already down. The phone is always faster.
              </>
            ) : (
              <>
                We&apos;ll confirm a time shortly. If it gets worse before you hear back, call{" "}
                {settings.phoneDisplay}.
              </>
            )}
          </p>

          <a
            href={emergencyPhone.href}
            className="mt-8 inline-flex items-center gap-2.5 whitespace-nowrap bg-tape px-7 py-4 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-tape"
          >
            <PhoneIcon />
            {emergencyPhone.display}
          </a>
        </div>
      </div>
    );
  }

  /* --------------------------- Form --------------------------- */

  return (
    <form ref={formRef} onSubmit={onSubmit} className="scroll-mt-28">
      {/* Progress */}
      <ol className="mb-10 grid grid-cols-4 gap-1.5" aria-label="Progress">
        {STEPS.map((label, i) => (
          <li key={label}>
            <div className={`h-1 w-full ${i <= step ? "bg-tape" : "bg-rule"}`} />
            {/* Inactive steps use `slate`, not `slate-dim`: these are real text
                labels, and slate-dim is reserved for icons at the 3:1 bar. */}
            <p className={`label mt-2.5 ${i <= step ? "text-ink" : "text-slate"}`}>
              <span className="tabular">{String(i + 1).padStart(2, "0")}</span>
              <span className="ml-1.5 hidden sm:inline">{label}</span>
            </p>
          </li>
        ))}
      </ol>

      {/* Step 1 */}
      {step === 0 && (
        <div className="space-y-9">
          <fieldset>
            <legend className="font-display-tight text-h3 uppercase text-ink">
              Business or home?
            </legend>
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              <Choice
                selected={propertyType === "business"}
                onClick={() => setPropertyType("business")}
                title="Business"
                hint="Restaurant, store, church, office, rental"
              />
              <Choice
                selected={propertyType === "home"}
                onClick={() => setPropertyType("home")}
                title="Home"
                hint="HVAC, plumbing, electrical, appliances"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display-tight text-h3 uppercase text-ink">
              What needs work?
            </legend>
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {services
                .filter(
                  (s) =>
                    !propertyType ||
                    s.audience.includes(propertyType === "home" ? "residential" : "commercial")
                )
                .map((service) => (
                  <Choice
                    key={service.slug}
                    selected={serviceSlug === service.slug}
                    onClick={() => {
                      setServiceSlug(service.slug);
                      setSymptoms([]);
                    }}
                    title={service.name}
                    hint={service.summary}
                  />
                ))}
            </div>
            <p className="mt-3 text-xs text-slate">
              Not sure? Pick the closest and we&apos;ll sort it out.
            </p>
          </fieldset>
        </div>
      )}

      {/* Step 2 */}
      {step === 1 && (
        <div className="space-y-9">
          <fieldset>
            <legend className="font-display-tight text-h3 uppercase text-ink">
              How soon do you need us?
            </legend>
            <div className="mt-6 space-y-2.5">
              {URGENCY.map((option) => (
                <Choice
                  key={option.value}
                  selected={urgency === option.value}
                  onClick={() => setUrgency(option.value)}
                  title={option.label}
                  hint={option.hint}
                />
              ))}
            </div>
          </fieldset>

          {isEmergency && (
            <div className="border border-ink bg-panel-2">
              <div className="tape-stripes h-2" aria-hidden />
              <div className="p-5">
                <p className="label flex items-center gap-2 text-ink">
                  <BoltIcon className="h-3 w-3" />
                  Don&apos;t wait on this form
                </p>
                <p className="mt-3 text-sm leading-snug text-slate">
                  Calling is faster. Emergencies are triaged by phone, so you find out where you
                  stand straight away.
                </p>
                <a
                  href={emergencyPhone.href}
                  className="mt-4 inline-flex items-center gap-2.5 bg-tape px-5 py-3 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-tape"
                >
                  <PhoneIcon />
                  {emergencyPhone.display}
                </a>
                <p className="mt-3 text-xs text-slate">
                  You can still finish the form. It gives us the details before we arrive.
                </p>
              </div>
            </div>
          )}

          {selectedService && (
            <fieldset>
              <legend className="font-display-tight text-h3 uppercase text-ink">
                What&apos;s it doing?
              </legend>
              <div className="mt-5 flex flex-wrap gap-2">
                {selectedService.symptoms.map((symptom) => {
                  const active = symptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() =>
                        setSymptoms((prev) =>
                          prev.includes(symptom)
                            ? prev.filter((s) => s !== symptom)
                            : [...prev, symptom]
                        )
                      }
                      aria-pressed={active}
                      className={`border px-3.5 py-2 font-mono text-[0.7rem] transition-colors ${
                        active
                          ? "border-ink bg-tape text-ink"
                          : "border-rule text-slate hover:border-rule-strong"
                      }`}
                    >
                      {symptom}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          <Field label="Describe it" hint="What happened, and when">
            <textarea
              name="description"
              rows={4}
              className={inputClass}
              placeholder="Walk-in climbed to 52°F overnight. Compressor running, coil iced over."
            />
          </Field>
        </div>
      )}

      {/* Step 3 */}
      {step === 2 && (
        <div className="space-y-8">
          <div>
            <h2 className="font-display-tight text-h3 uppercase text-ink">Equipment details</h2>
            <p className="mt-2.5 max-w-lg text-sm leading-snug text-slate">
              All optional, but this is what saves you a second visit.
            </p>
          </div>

          {/* The highest-leverage field on the site */}
          <div className="border border-ink bg-panel-2">
            <div className="tape-stripes h-2" aria-hidden />
            <div className="p-5 md:p-7">
              <p className="label flex items-center gap-2 text-ink">
                <CameraIcon className="h-3 w-3" />
                Photo of the data plate
              </p>
              <p className="mt-3 max-w-md text-sm leading-snug text-slate">
                Snap the make, model and serial and we source the part before coming out. Usually a
                metal sticker inside the door, on the back, or behind the kick panel.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={(e) => onPhotosPicked(e.target.files)}
                className="sr-only"
                id="photos"
              />

              <label
                htmlFor="photos"
                className="mt-5 inline-flex cursor-pointer items-center gap-2.5 bg-tape px-5 py-3 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-tape"
              >
                <CameraIcon />
                {photos.length ? "Add another" : "Take or choose a photo"}
              </label>

              {photoNotice && <p className="mt-3 text-xs text-alarm">{photoNotice}</p>}

              {photos.length > 0 && (
                <ul className="mt-5 space-y-2">
                  {photos.map((photo, i) => (
                    <li
                      key={`${photo.name}-${i}`}
                      className="flex items-center justify-between gap-4 border border-rule bg-panel px-3.5 py-2.5"
                    >
                      <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate">
                        {photo.name}{" "}
                        <span className="tabular text-slate">
                          {(photo.size / 1024 / 1024).toFixed(1)}MB
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotos((prev) => prev.filter((_, idx) => idx !== i));
                          setPhotoNotice(null);
                        }}
                        className="label shrink-0 text-slate transition-colors hover:text-alarm"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-4 text-xs text-slate">
                Up to {MAX_PHOTOS}. Large images are shrunk automatically before upload.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Make">
              <input name="equipmentMake" className={inputClass} placeholder="True, Carrier…" />
            </Field>
            <Field label="Model">
              <input name="equipmentModel" className={inputClass} placeholder="T-49-HC" />
            </Field>
            <Field label="Serial">
              <input name="equipmentSerial" className={inputClass} placeholder="If visible" />
            </Field>
          </div>

          <Field label="Access notes" hint="Gate codes, dock access, dogs, where to park, who to ask for">
            <textarea
              name="accessNotes"
              rows={3}
              className={inputClass}
              placeholder="Deliveries use the back alley. Ask for the kitchen manager."
            />
          </Field>
        </div>
      )}

      {/* Step 4 */}
      {step === 3 && (
        <div className="space-y-7">
          <div>
            <h2 className="font-display-tight text-h3 uppercase text-ink">Where and who</h2>
            <p className="mt-2.5 text-sm text-slate">So we know where to go and who to ask for.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name" required>
              <input name="name" required autoComplete="name" className={inputClass} />
            </Field>

            {propertyType === "business" && (
              <Field label="Business name" required>
                <input name="company" required autoComplete="organization" className={inputClass} />
              </Field>
            )}

            <Field label="Phone" required hint="Best number to reach you on site">
              <input
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                inputMode="tel"
                className={inputClass}
                placeholder="(704) 555-0123"
              />
            </Field>

            <Field label="Email">
              <input name="email" type="email" autoComplete="email" className={inputClass} />
            </Field>
          </div>

          <Field label="Service address" required>
            <input
              name="address"
              required
              autoComplete="street-address"
              className={inputClass}
              placeholder="Street address"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="City" required>
              <input
                name="city"
                required
                list="city-options"
                autoComplete="address-level2"
                className={inputClass}
              />
              <datalist id="city-options">
                {cityOptions.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </Field>

            <Field label="Best time to reach you">
              <select name="contactWindow" defaultValue="Any time" className={inputClass}>
                {CONTACT_WINDOWS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Honeypot */}
          <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label>
              Company website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {error && (
            <div className="border border-alarm bg-panel-2 p-4">
              <p className="text-sm text-ink">{error}</p>
              <p className="mt-1.5 text-sm text-slate">
                You can always reach us at{" "}
                <a href={settings.phoneHref} className="font-semibold text-ink underline">
                  {settings.phoneDisplay}
                </a>
                .
              </p>
            </div>
          )}

          <p className="text-xs leading-relaxed text-slate">
            These details are used to schedule and prepare for your service call. Nothing else, and
            we don&apos;t share them.{" "}
            <a href="/privacy" className="text-ink underline">
              How we handle your details
            </a>
            .
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-10 flex flex-wrap items-center gap-2.5 border-t border-rule pt-7">
        {step > 0 && (
          <button
            type="button"
            onClick={() => go(step - 1)}
            className="border border-rule-strong px-5 py-3.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-panel"
          >
            Back
          </button>
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => canAdvance && go(step + 1)}
            disabled={!canAdvance}
            className="group inline-flex items-center gap-2.5 bg-tape px-7 py-3.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-tape disabled:cursor-not-allowed disabled:bg-panel-3 disabled:text-slate"
          >
            Continue
            <ArrowIcon className="transition-transform group-hover:translate-x-1" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "submitting"}
            className="group inline-flex items-center gap-2.5 bg-tape px-7 py-3.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-tape disabled:cursor-not-allowed disabled:bg-panel-3 disabled:text-slate"
          >
            {status === "submitting" ? "Sending" : "Send request"}
            {status !== "submitting" && (
              <ArrowIcon className="transition-transform group-hover:translate-x-1" />
            )}
          </button>
        )}

        <a
          href={settings.phoneHref}
          className="ml-auto inline-flex items-center gap-2 text-sm text-slate transition-colors hover:text-ink"
        >
          <PhoneIcon />
          Or call {settings.phoneDisplay}
        </a>
      </div>
    </form>
  );
}
