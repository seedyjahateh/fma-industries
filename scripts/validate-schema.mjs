/**
 * Offline structured-data validation.
 *
 * Google's Rich Results Test needs a public URL, which this project does not
 * have yet. This checks everything that can be checked without one: that each
 * block parses, that required fields per type are present, and that two
 * specific mistakes have not crept back in.
 *
 *   node scripts/validate-schema.mjs [baseUrl]
 *
 * Once the site is deployed, still run the Rich Results Test. This catches
 * malformed output; only Google can confirm eligibility for rich results.
 */

const BASE = process.argv[2] ?? "http://localhost:3210";

const ROUTES = [
  "/",
  "/services/commercial-refrigeration",
  "/services/hvac",
  "/service-areas/landis",
  "/service-areas/kannapolis",
  "/commercial",
  "/residential",
  "/maintenance-plans",
  "/emergency",
  "/about",
  "/contact",
  "/privacy",
];

/** Required properties per @type. */
const REQUIRED = {
  LocalBusiness: ["name", "description", "url", "telephone", "address", "geo", "areaServed"],
  HVACBusiness: [],
  Service: ["name", "provider"],
  FAQPage: ["mainEntity"],
  BreadcrumbList: ["itemListElement"],
};

const problems = [];
const counts = {};
let blocks = 0;

const typesOf = (node) => (Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]);

function checkNode(node, route) {
  blocks++;
  for (const t of typesOf(node)) {
    counts[t] = (counts[t] ?? 0) + 1;
    for (const field of REQUIRED[t] ?? []) {
      if (node[field] === undefined || node[field] === null || node[field] === "") {
        problems.push(`${route}  ${t} is missing "${field}"`);
      }
    }
  }

  // Inventing ratings is a structured-data policy violation. It must stay out
  // until the business actually has reviews.
  for (const banned of ["aggregateRating", "review", "ratingValue"]) {
    if (banned in node) {
      problems.push(`${route}  ${typesOf(node).join("/")} contains "${banned}" with no real reviews`);
    }
  }

  // FAQPage answers must be non-empty or the block is useless.
  if (typesOf(node).includes("FAQPage")) {
    const qs = node.mainEntity ?? [];
    if (!Array.isArray(qs) || qs.length === 0) {
      problems.push(`${route}  FAQPage has no questions`);
    }
    qs.forEach((q, i) => {
      if (!q.name) problems.push(`${route}  FAQPage question ${i} has no name`);
      if (!q.acceptedAnswer?.text) problems.push(`${route}  FAQPage question ${i} has no answer text`);
    });
  }

  if (typesOf(node).includes("BreadcrumbList")) {
    (node.itemListElement ?? []).forEach((item, i) => {
      if (item.position !== i + 1) problems.push(`${route}  breadcrumb position ${item.position} out of order`);
      if (!/^https?:\/\//.test(item.item ?? "")) problems.push(`${route}  breadcrumb "${item.name}" item is not absolute`);
    });
  }
}

const html = new Map();

for (const route of ROUTES) {
  const res = await fetch(BASE + route);
  if (!res.ok) {
    problems.push(`${route}  HTTP ${res.status}`);
    continue;
  }
  const body = await res.text();
  html.set(route, body);

  const found = [...body.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (found.length === 0) {
    problems.push(`${route}  no JSON-LD found`);
    continue;
  }

  for (const [, raw] of found) {
    let parsed;
    try {
      // The renderer escapes "<" as < to stop a stray tag closing the
      // script early. JSON.parse turns it back, so this also proves the
      // escaping did not corrupt the payload.
      parsed = JSON.parse(raw);
    } catch (err) {
      problems.push(`${route}  JSON-LD does not parse: ${err.message}`);
      continue;
    }
    for (const node of Array.isArray(parsed) ? parsed : [parsed]) checkNode(node, route);
  }
}

// Placeholder business facts must never reach structured data or page copy.
for (const [route, body] of html) {
  for (const leak of ["PENDING CONFIRMATION", "TODO:"]) {
    if (body.includes(leak)) problems.push(`${route}  placeholder "${leak}" is visible in the HTML`);
  }
}

console.log(`Checked ${ROUTES.length} routes, ${blocks} JSON-LD blocks`);
console.log("Types found:", Object.entries(counts).map(([k, v]) => `${k} x${v}`).join(", ") || "none");

if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log("  " + p);
  process.exitCode = 1;
} else {
  console.log("\nNo problems found.");
}
