/**
 * WCAG contrast audit. Paste into the browser console on any page, or inject it
 * with a browser-automation tool, then call `contrastAudit()`.
 *
 *   contrastAudit()  ->  { page, checked, fails, detail }
 *
 * WHY THIS RESOLVES COLOURS THROUGH A CANVAS
 *
 * The obvious implementation parses `getComputedStyle().backgroundColor` with a
 * regex and treats the first three numbers as RGB. That is wrong on this
 * codebase and produced confident false failures.
 *
 * Tailwind v4 emits `oklab()` for opacity modifiers, so `bg-panel/95` computes
 * to `oklab(0.950881 -0.0016287 -0.00188988 / 0.95)`. A naive parser reads
 * 0.95, -0.0016, -0.0019 as RGB and concludes that a near-white header is
 * near-black, reporting 1.13:1 for text that is actually at 16:1.
 *
 * Painting the colour onto a 1x1 canvas and reading the pixel makes the browser
 * do the conversion, so oklab, oklch, color-mix, named colours and rgba all
 * work. It also composites translucent layers correctly: each background up the
 * tree is painted in order until one is fully opaque, which is what the eye
 * actually sees.
 *
 * Known limits: it does not handle text over background images or gradients,
 * and it skips anything currently invisible (including un-revealed scroll
 * animations), so scroll through a page before trusting a clean result.
 */
function contrastAudit({ verbose = false } = {}) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 1;
  const ctx = cv.getContext("2d", { willReadFrequently: true });

  const paint = (stack) => {
    ctx.clearRect(0, 0, 1, 1);
    for (const c of stack) {
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, 1, 1);
    }
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  };

  const alphaOf = (color) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data[3];
  };

  const lin = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const lum = ([r, g, b]) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
  const ratio = (a, b) => {
    const x = lum(a);
    const y = lum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };

  /** Background layers, bottom-most opaque first, for correct compositing. */
  function bgStack(el) {
    const layers = [];
    let node = el;
    while (node) {
      const bg = getComputedStyle(node).backgroundColor;
      if (bg && bg !== "transparent") {
        const a = alphaOf(bg);
        if (a > 0) {
          layers.unshift(bg);
          if (a === 255) return layers;
        }
      }
      node = node.parentElement;
    }
    layers.unshift("rgb(255,255,255)");
    return layers;
  }

  let checked = 0;
  const fails = [];
  const results = [];

  function consider(el, text) {
    const s = getComputedStyle(el);
    if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) === 0) return;
    const box = el.getBoundingClientRect();
    if (!box.width && !box.height) return;

    const size = parseFloat(s.fontSize);
    const weight = Number(s.fontWeight) || 400;
    // WCAG "large text": 24px, or 18.66px when bold.
    const need = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;

    const stack = bgStack(el);
    const cr = ratio(paint([...stack, s.color]), paint(stack));
    checked++;

    const row = {
      t: text.slice(0, 36),
      cls: String(el.className).slice(0, 40),
      ratio: Number(cr.toFixed(2)),
      need,
    };
    if (verbose) results.push(row);
    // Disabled controls are exempt under WCAG 1.4.3.
    if (cr < need - 0.005 && !el.matches(":disabled")) fails.push(row);
  }

  document.querySelectorAll("body *").forEach((el) => {
    const text = [...el.childNodes]
      .filter((n) => n.nodeType === 3 && n.textContent.trim())
      .map((n) => n.textContent.trim())
      .join(" ");
    if (text) consider(el, text);
  });

  // Form controls paint their own value text and are easy to forget.
  document.querySelectorAll("input,textarea,select").forEach((el) => consider(el, "[field value]"));

  return { page: location.pathname, checked, fails: fails.length, detail: fails, ...(verbose ? { results } : {}) };
}

if (typeof window !== "undefined") window.contrastAudit = contrastAudit;
