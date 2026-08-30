/**
 * Service-area content. Same house style as services.ts: no em-dashes, short
 * sentences, a number wherever one exists.
 *
 * Eight cities get real, hand-written pages. Everything else is listed on the
 * hub without its own route. Templated city pages read as spam to search
 * engines and to the people who land on them.
 */

export interface Area {
  slug: string;
  city: string;
  county: string;
  /** Rough drive time from the Landis base. Sets honest expectations. */
  driveTime: string;
  /** One or two sentences. Must be specific to this town. */
  intro: string;
  /** Who calls from here and why. */
  localContext: string;
  /** Corridors and landmarks locals actually recognise. */
  landmarks: string[];
  /** Slugs from services.ts to feature first. */
  emphasis: string[];
  metaTitle: string;
  metaDescription: string;
}

export const areas: Area[] = [
  {
    slug: "landis",
    city: "Landis",
    county: "Rowan County",
    driveTime: "Home base",
    intro:
      "Landis is where the truck starts every morning. Most calls here come from somebody who already knows us, or was sent by somebody who does.",
    localContext:
      "Being based in town means the shortest response we can offer. Often same day, and frequently within a couple of hours for something urgent. The mix runs from Main Street businesses and churches to houses we have serviced for years.",
    landmarks: ["Downtown Landis", "Central Avenue", "South Main Street", "Linn Street corridor"],
    emphasis: ["hvac", "commercial-refrigeration", "appliance-repair"],
    metaTitle: "HVAC, Refrigeration & Plumbing in Landis, NC",
    metaDescription:
      "Local HVAC, commercial refrigeration, plumbing, electrical and appliance repair in Landis, NC. Based in town, fastest response available. 20+ years.",
  },
  {
    slug: "china-grove",
    city: "China Grove",
    county: "Rowan County",
    driveTime: "About 5 minutes",
    intro:
      "China Grove and Landis run together and the town line is a formality. China Grove gets the same response time as our own street.",
    localContext:
      "Main Street businesses and the restaurants and convenience stores along the US-29 corridor make up most of the commercial work here. Residential HVAC and appliance calls fill the rest of the week.",
    landmarks: ["Downtown China Grove", "US-29 corridor", "North Main Street", "Patterson Farm area"],
    emphasis: ["commercial-refrigeration", "hvac", "plumbing"],
    metaTitle: "HVAC & Refrigeration Repair in China Grove, NC",
    metaDescription:
      "Commercial refrigeration, HVAC, plumbing and electrical service in China Grove, NC. Minutes away in neighbouring Landis.",
  },
  {
    slug: "kannapolis",
    city: "Kannapolis",
    county: "Cabarrus County",
    driveTime: "About 10 minutes",
    intro:
      "Kannapolis has added a lot of kitchens in the last few years. New kitchens mean new refrigeration that eventually needs somebody who knows it.",
    localContext:
      "Downtown and the ballpark district hold a dense run of restaurants and bars where a failed walk-in is an immediate revenue problem. We also cover the retail and convenience-store corridors along Cannon and Dale Earnhardt Boulevards.",
    landmarks: [
      "Downtown Kannapolis",
      "West Avenue",
      "Atrium Health Ballpark district",
      "NC Research Campus",
      "Cannon Boulevard",
    ],
    emphasis: ["commercial-refrigeration", "commercial-kitchen-equipment", "hvac"],
    metaTitle: "Commercial Refrigeration & HVAC in Kannapolis, NC",
    metaDescription:
      "Restaurant refrigeration, kitchen equipment, HVAC and electrical service in Kannapolis, NC. Emergency response for downtown and ballpark district kitchens.",
  },
  {
    slug: "concord",
    city: "Concord",
    county: "Cabarrus County",
    driveTime: "About 20 minutes",
    intro:
      "Concord holds the densest concentration of commercial kitchens in our service area. The hospitality corridor around the speedway does not tolerate downtime.",
    localContext:
      "Hotels, chain restaurants and independent kitchens along Bruton Smith Boulevard and Concord Parkway are the bulk of the work. Race weeks push equipment hardest, which is when preventive maintenance pays for itself.",
    landmarks: [
      "Concord Mills area",
      "Charlotte Motor Speedway corridor",
      "Bruton Smith Boulevard",
      "Historic downtown, Union Street",
      "Concord Parkway",
    ],
    emphasis: ["commercial-kitchen-equipment", "commercial-refrigeration", "hvac"],
    metaTitle: "Commercial Kitchen & Refrigeration Service in Concord, NC",
    metaDescription:
      "Commercial kitchen equipment, refrigeration and HVAC service in Concord, NC. Serving the Concord Mills and speedway hospitality corridor.",
  },
  {
    slug: "salisbury",
    city: "Salisbury",
    county: "Rowan County",
    driveTime: "About 15 minutes",
    intro:
      "Salisbury is the county seat and has the older building stock to match. That means systems needing somebody willing to work on what is actually there.",
    localContext:
      "Downtown independents, the college campuses and the medical district all run equipment we service. Historic buildings need HVAC and electrical work done carefully, and we are comfortable with that.",
    landmarks: [
      "Historic downtown Salisbury",
      "Innes Street corridor",
      "Catawba College area",
      "Livingstone College area",
      "Rowan Medical Center district",
    ],
    emphasis: ["hvac", "commercial-refrigeration", "electrical"],
    metaTitle: "HVAC, Refrigeration & Electrical in Salisbury, NC",
    metaDescription:
      "HVAC, commercial refrigeration, plumbing and electrical service in Salisbury, NC. Experienced with historic downtown buildings. 20+ years in Rowan County.",
  },
  {
    slug: "mooresville",
    city: "Mooresville",
    county: "Iredell County",
    driveTime: "About 25 minutes",
    intro:
      "Growth around Lake Norman brought a lot of restaurants and retail with it. All of it runs refrigeration that eventually needs servicing.",
    localContext:
      "The Exit 36 retail corridor and the downtown restaurant scene account for most commercial calls. The motorsports shops around town run compressed air, ventilation and dedicated circuits that overlap with what we do.",
    landmarks: [
      "Downtown Mooresville",
      "Exit 36 retail corridor",
      "Lake Norman waterfront",
      "Motorsports district",
      "Brawley School Road",
    ],
    emphasis: ["commercial-refrigeration", "hvac", "commercial-kitchen-equipment"],
    metaTitle: "Commercial Refrigeration & HVAC in Mooresville, NC",
    metaDescription:
      "Commercial refrigeration, kitchen equipment and HVAC service in Mooresville and the Lake Norman area. Restaurant and retail specialists.",
  },
  {
    slug: "statesville",
    city: "Statesville",
    county: "Iredell County",
    driveTime: "About 35 minutes",
    intro:
      "Statesville sits where I-40 crosses I-77, which makes it a distribution town. Those buildings have mechanical needs well beyond comfort cooling.",
    localContext:
      "Warehouses, light manufacturing and the travel-plaza food service along the interstates make up the work here. Statesville is at the outer edge of our radius, so scheduled work is usually batched. Emergency refrigeration still gets answered.",
    landmarks: [
      "Downtown Statesville",
      "I-40 and I-77 interchange",
      "Signal Hill area",
      "Airport industrial area",
    ],
    emphasis: ["commercial-refrigeration", "hvac", "electrical"],
    metaTitle: "Commercial HVAC & Refrigeration in Statesville, NC",
    metaDescription:
      "Commercial refrigeration, HVAC and electrical service in Statesville, NC. Serving warehouses, light industrial and interstate corridor food service.",
  },
  {
    slug: "harrisburg",
    city: "Harrisburg",
    county: "Cabarrus County",
    driveTime: "About 30 minutes",
    intro:
      "Harrisburg grew fast and the retail that followed the rooftops is still relatively new equipment. Mostly that means maintenance rather than rescue work.",
    localContext:
      "Newer shopping centres and restaurants along the NC-49 corridor, plus a large base of newer homes running heat pumps. Good territory for maintenance agreements, since most of the equipment is young enough to keep in shape cheaply.",
    landmarks: ["NC-49 corridor", "Downtown Harrisburg", "Rocky River Road", "Harrisburg Town Center"],
    emphasis: ["hvac", "appliance-repair", "commercial-refrigeration"],
    metaTitle: "HVAC & Appliance Repair in Harrisburg, NC",
    metaDescription:
      "HVAC, refrigeration, plumbing, electrical and appliance service in Harrisburg, NC. Maintenance plans for newer homes and commercial equipment.",
  },
];

/** Covered on request, listed on the hub page. No dedicated route each. */
export const additionalTowns = [
  "Rockwell",
  "Granite Quarry",
  "Faith",
  "Spencer",
  "East Spencer",
  "Enochville",
  "Mount Pleasant",
  "Mount Ulla",
  "Cleveland",
  "Woodleaf",
  "Troutman",
  "Davidson",
  "Cornelius",
  "Huntersville",
  "Midland",
  "Albemarle",
];

export const counties = ["Rowan", "Cabarrus", "Iredell", "North Mecklenburg"];

export const getArea = (slug: string) => areas.find((a) => a.slug === slug);
