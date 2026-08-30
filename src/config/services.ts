/**
 * Service content.
 *
 * House style, enforced here because copy is design material on this site:
 *   - No em-dashes. Use a period or restructure the sentence.
 *   - `summary` is a fragment, not a sentence. Six words is plenty.
 *   - `intro` is two sentences. If it needs three, it needs a spec block.
 *   - Answers are direct. No throat-clearing, no "we pride ourselves on".
 *   - Prefer a number over an adjective everywhere one exists.
 */

export type ServiceSlug =
  | "commercial-refrigeration"
  | "commercial-kitchen-equipment"
  | "hvac"
  | "plumbing"
  | "electrical"
  | "appliance-repair";

export interface Service {
  slug: ServiceSlug;
  name: string;
  /** Short label for nav, chips, and the intake picker. */
  shortName: string;
  /** Fragment listing the headline equipment. Reads as a spec line. */
  summary: string;
  /** Two sentences. */
  intro: string;
  equipment: string[];
  /** Phrased the way a customer says it on the phone. */
  symptoms: string[];
  faqs: { q: string; a: string }[];
  audience: ("commercial" | "residential")[];
  emergencyPriority: boolean;
  metaTitle: string;
  metaDescription: string;
}

export const services: Service[] = [
  {
    slug: "commercial-refrigeration",
    name: "Commercial Refrigeration",
    shortName: "Refrigeration",
    summary: "Walk-ins. Ice machines. Display cases.",
    intro:
      "A walk-in drifting above 41°F puts every case inside it on a clock. We find the fault instead of topping off refrigerant and leaving.",
    equipment: [
      "Walk-in coolers and freezers",
      "Reach-in and undercounter units",
      "Ice machines and bins",
      "Refrigerated prep tables",
      "Display and merchandiser cases",
      "Remote condensing units",
      "Rack systems",
      "Blast chillers",
      "Beverage systems",
      "Defrost controls and timers",
    ],
    symptoms: [
      "Not holding temperature",
      "Coil iced over",
      "Compressor short-cycling",
      "Ice machine producing little or no ice",
      "Water pooling under the unit",
      "Running constantly, never satisfying",
      "Suspected refrigerant leak",
      "Fan motor noisy or seized",
    ],
    faqs: [
      {
        q: "How fast can you get to a walk-in that's down?",
        a: "Refrigeration failures are triaged ahead of scheduled work, because the cost of waiting is the inventory, not the repair. Call rather than using the form for anything already above temperature.",
      },
      {
        q: "Do you repair equipment you didn't install?",
        a: "Yes. Most of our refrigeration work is on equipment somebody else installed, across all the major commercial brands.",
      },
      {
        q: "Can you find a leak instead of just recharging?",
        a: "Yes, and that is the right way to do it. Recharging a leaking system buys a few weeks and vents refrigerant. We locate the leak, repair it, then charge to spec.",
      },
      {
        q: "Do you offer scheduled refrigeration maintenance?",
        a: "Yes. Coil cleaning, gasket and door checks, temperature verification, and drain service on a set interval. It is the most effective way to avoid emergency calls and failed inspections.",
      },
    ],
    audience: ["commercial"],
    emergencyPriority: true,
    metaTitle: "Commercial Refrigeration Repair | Landis, Kannapolis & Salisbury NC",
    metaDescription:
      "Emergency commercial refrigeration repair in Landis, NC. Walk-in coolers, freezers, ice machines, prep tables and display cases. 20+ years across Rowan, Cabarrus and Iredell counties.",
  },
  {
    slug: "commercial-kitchen-equipment",
    name: "Commercial Kitchen Equipment",
    shortName: "Kitchen Equipment",
    summary: "Fryers. Ovens. Steamers. Dish machines.",
    intro:
      "A kitchen is one system: gas, water, power and exhaust. A fault in one shows up as a symptom in another, and we hold all four trades in-house.",
    equipment: [
      "Fryers, gas and electric",
      "Ranges, griddles, charbroilers",
      "Convection, combi and deck ovens",
      "Steamers and steam kettles",
      "Dish machines and boosters",
      "Holding cabinets and proofers",
      "Exhaust hoods and makeup air",
      "Gas lines and equipment hookups",
      "Conveyor and pizza ovens",
      "Steam tables and warmers",
    ],
    symptoms: [
      "Fryer won't light",
      "Pilot keeps going out",
      "Oven heating unevenly",
      "Dish machine not reaching temperature",
      "Smoke in the kitchen, hood not pulling",
      "Steamer scaled up",
      "Gas smell near the line",
      "Equipment tripping its breaker",
    ],
    faqs: [
      {
        q: "Can you work around our service hours?",
        a: "Yes. Most kitchen work happens early morning, between services, or after close. Tell us the window when you call and we build around it.",
      },
      {
        q: "Do you handle gas connections for new equipment?",
        a: "Yes, including the electrical side of the hookup. Confirm licensing with us for your specific scope when you call.",
      },
      {
        q: "Can you help us pass a health inspection?",
        a: "We get called before and after inspections regularly. Dish machine temperatures, hot holding, refrigeration temps and hood service are the usual findings. Getting ahead of it costs far less than a re-inspection.",
      },
      {
        q: "Do you stock common parts?",
        a: "Wear parts ride on the truck. For anything model-specific, send a photo of the data plate with your request and we source the exact part before arriving. That is usually the difference between one trip and two.",
      },
    ],
    audience: ["commercial"],
    emergencyPriority: true,
    metaTitle: "Commercial Kitchen Equipment Repair | Restaurant Service, Landis NC",
    metaDescription:
      "Commercial kitchen equipment repair in Landis, NC. Fryers, ovens, ranges, steamers, dish machines and hoods. Scheduled around your service hours.",
  },
  {
    slug: "hvac",
    name: "Heating & Air Conditioning",
    shortName: "HVAC",
    summary: "Rooftop units. Heat pumps. Furnaces.",
    intro:
      "Commercial rooftop units and residential systems, repaired and maintained. We diagnose the cause rather than swapping parts until the symptom stops.",
    equipment: [
      "Rooftop and packaged units",
      "Split system air conditioners",
      "Heat pumps",
      "Gas and electric furnaces",
      "Ductless mini-splits",
      "Air handlers and blowers",
      "Thermostats and controls",
      "Condenser and evaporator coils",
      "Ductwork repair",
      "Ventilation and makeup air",
    ],
    symptoms: [
      "Blowing warm air",
      "No heat",
      "Runs constantly, never reaches setpoint",
      "Breaker trips on startup",
      "Grinding or squealing",
      "Water around the air handler",
      "One room never gets comfortable",
      "Ice on the outdoor unit",
    ],
    faqs: [
      {
        q: "Should I repair or replace?",
        a: "It comes down to the age of the equipment, the specific repair, and the refrigerant it uses. You get the honest number both ways. Nobody here works on commission.",
      },
      {
        q: "Do you service commercial rooftop units?",
        a: "Yes. RTUs and light commercial packaged systems are core work, including planned maintenance for property managers running several buildings.",
      },
      {
        q: "How often should HVAC be serviced?",
        a: "Twice a year for most systems: cooling in spring, heating in fall. Rooftop units in dusty or grease-laden air need coil attention more often.",
      },
      {
        q: "Do you offer emergency HVAC service?",
        a: "Yes. Loss of heat in a freeze and loss of cooling in a commercial building are both treated as urgent. Call rather than submitting a form.",
      },
    ],
    audience: ["commercial", "residential"],
    emergencyPriority: true,
    metaTitle: "HVAC Repair & Service | Heating and Air Conditioning, Landis NC",
    metaDescription:
      "HVAC repair and maintenance in Landis, NC. Commercial rooftop units, heat pumps, furnaces and mini-splits across Rowan, Cabarrus and Iredell counties.",
  },
  {
    slug: "plumbing",
    name: "Plumbing",
    shortName: "Plumbing",
    summary: "Grease traps. Water heaters. Drains. Gas.",
    intro:
      "Commercial and residential plumbing with a bias toward food service. Grease traps, floor drains, and the water heaters that keep a kitchen legal.",
    equipment: [
      "Commercial and residential water heaters",
      "Grease trap service",
      "Drain cleaning and clearing",
      "Floor drains and floor sinks",
      "Gas line installation and repair",
      "Three-compartment and prep sinks",
      "Backflow prevention",
      "Fixtures and faucets",
      "Water and drain line repair",
      "Equipment water connections",
    ],
    symptoms: [
      "Drain backing up",
      "No hot water",
      "Water heater leaking",
      "Grease trap overflowing",
      "Running toilet or dripping fixture",
      "Low water pressure",
      "Gas smell near an appliance",
      "Visible leak under a sink",
    ],
    faqs: [
      {
        q: "Can you service grease traps on a schedule?",
        a: "Yes, and scheduling it is the point. A trap on an interval does not back up during a Friday rush. We set the interval to your volume.",
      },
      {
        q: "Commercial only, or residential too?",
        a: "Both. Commercial kitchen plumbing is the specialty. Residential water heaters, drains and fixtures are regular work.",
      },
      {
        q: "How long does a water heater replacement take?",
        a: "A straightforward residential swap runs a few hours. Commercial units, and anything needing venting or gas changes, take longer. You get the timeline before we start.",
      },
      {
        q: "What licensing do you hold?",
        a: "North Carolina licenses plumbing and heating contractors through the state board. Ask for our current number when you call and we give it to you directly.",
      },
    ],
    audience: ["commercial", "residential"],
    emergencyPriority: false,
    metaTitle: "Plumbing Services | Commercial & Residential, Landis NC",
    metaDescription:
      "Plumbing repair in Landis, NC. Grease traps, water heaters, drain cleaning and gas lines. Commercial kitchen plumbing specialists serving Rowan County.",
  },
  {
    slug: "electrical",
    name: "Electrical",
    shortName: "Electrical",
    summary: "Panels. Circuits. Equipment hookups.",
    intro:
      "Panel work, dedicated circuits for kitchen and refrigeration equipment, and the intermittent faults that take patience to find. Because we service the equipment too, we can tell whether the problem is the power or the machine.",
    equipment: [
      "Panel upgrades and replacements",
      "Dedicated equipment circuits",
      "Commercial equipment hookups",
      "Interior and exterior lighting",
      "Outlets, switches, GFCI",
      "Breakers and disconnects",
      "Intermittent fault tracing",
      "Hood and exhaust fan wiring",
      "Sign and lot lighting",
      "Code correction work",
    ],
    symptoms: [
      "Breaker keeps tripping",
      "Lights flicker under load",
      "Outlet dead",
      "Burning smell near a panel",
      "New equipment needs a circuit",
      "Panel is full",
      "Half the building has no lighting",
      "Equipment losing power intermittently",
    ],
    faqs: [
      {
        q: "Can you add a circuit for new equipment?",
        a: "Yes, one of the most common calls we get. We confirm the panel has capacity, run the dedicated circuit, and make the equipment connection in the same visit where possible.",
      },
      {
        q: "Why does my breaker keep tripping?",
        a: "Usually an overloaded circuit, a failing component drawing more current than it should, or a fault in the wiring. Being able to test the equipment as well as the circuit is what shortens the diagnosis.",
      },
      {
        q: "Do you handle code correction work?",
        a: "Yes, including items flagged by an inspector or an insurance carrier. Send us the write-up and we quote against it.",
      },
      {
        q: "What licensing do you hold?",
        a: "North Carolina licenses electrical contractors through a separate state board. Ask for our number when you call and we provide it before anything is scheduled.",
      },
    ],
    audience: ["commercial", "residential"],
    emergencyPriority: false,
    metaTitle: "Electrical Services | Commercial & Residential Electrician, Landis NC",
    metaDescription:
      "Electrical work in Landis, NC. Panel upgrades, dedicated equipment circuits, lighting and fault tracing. Commercial and residential, 20+ years.",
  },
  {
    slug: "appliance-repair",
    name: "Appliance Repair",
    shortName: "Appliances",
    summary: "Refrigerators. Washers. Dryers. Ranges.",
    intro:
      "Home and light commercial appliance repair. The refrigeration background that goes into a walk-in applies to a kitchen refrigerator, which is why we can often fix what another company writes off.",
    equipment: [
      "Refrigerators and freezers",
      "Washers and dryers",
      "Ranges, cooktops, wall ovens",
      "Dishwashers",
      "Microwaves and vent hoods",
      "Ice makers",
      "Garbage disposals",
      "Light commercial laundry",
    ],
    symptoms: [
      "Refrigerator not cooling",
      "Dryer not heating",
      "Washer won't drain or spin",
      "Dishes coming out dirty",
      "Oven temperature is off",
      "Ice maker stopped",
      "Appliance leaking",
      "Burning smell",
    ],
    faqs: [
      {
        q: "Is it worth repairing, or should I replace it?",
        a: "We tell you honestly. If the repair approaches the value of the appliance, or the unit has a known terminal fault, we say so rather than take the job.",
      },
      {
        q: "Do you charge a diagnostic fee?",
        a: "There is a service call fee to come out and diagnose. Ask when you call, and we tell you how it applies if you approve the repair.",
      },
      {
        q: "What brands do you work on?",
        a: "Most major residential brands. Send the model number and a photo of the data plate and we confirm parts availability before the visit.",
      },
      {
        q: "How soon can you come out?",
        a: "Appliance calls are usually scheduled within a few business days. Anything involving a leak or a burning smell should be a phone call, not a form.",
      },
    ],
    audience: ["residential", "commercial"],
    emergencyPriority: false,
    metaTitle: "Appliance Repair | Refrigerators, Washers & Dryers, Landis NC",
    metaDescription:
      "Appliance repair in Landis, NC. Refrigerators, washers, dryers, ranges and dishwashers. Honest repair-or-replace advice from a 20+ year technician.",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

export const commercialServices = services.filter((s) => s.audience.includes("commercial"));
export const residentialServices = services.filter((s) => s.audience.includes("residential"));
