/**
 * Real job photography.
 *
 * ============================================================================
 * HOW TO ADD PHOTOS WHEN THEY ARRIVE
 * ============================================================================
 * 1. Drop the files into `public/photos/`.
 * 2. Add an entry below. `width` and `height` are the file's real pixel
 *    dimensions, and they are required: without them the image has no
 *    reserved space and the page shifts as it loads.
 * 3. Write a real `alt`. It describes what a person would see, not the
 *    filename. If a photo is purely decorative, say so with `alt: ""`.
 * 4. That is the whole job. Every slot on the site renders itself from this
 *    file, and renders NOTHING while a list is empty, so the site looks
 *    finished either way rather than showing broken frames.
 *
 * Getting dimensions quickly on Windows:
 *   Add-Type -AssemblyName System.Drawing
 *   [System.Drawing.Image]::FromFile("C:\path\photo.jpg") | % { "$($_.Width)x$($_.Height)" }
 * ============================================================================
 */

export interface Photo {
  /** Path under /public, e.g. "/photos/walk-in-coil.jpg" */
  src: string;
  /** What a person would see. Not the filename. */
  alt: string;
  width: number;
  height: number;
  /** Optional caption shown under the photo in strips. */
  caption?: string;
}

/** Recent work strip on the homepage. Three or more reads best. */
export const workPhotos: Photo[] = [
  {
    src: "/photos/rooftop-unit-service.jpg",
    alt: "Commercial rooftop unit with its service panel open, showing two compressors and control boards, with a manifold gauge set connected to the refrigerant lines.",
    width: 1350,
    height: 2400,
    caption: "Rooftop unit service",
  },
  {
    src: "/photos/refrigeration-compressor.jpg",
    alt: "Cubigel refrigeration compressor mounted in the base of a commercial refrigeration unit.",
    width: 1350,
    height: 2400,
    caption: "Refrigeration compressor",
  },
  {
    src: "/photos/zoning-control-panel.jpg",
    alt: "Wired HVAC zoning control panel, model HZ322, with status lights on for zones 1 and 2.",
    width: 1800,
    height: 2400,
    caption: "Zoning control panel",
  },
  {
    src: "/photos/mini-split-install-outdoor.jpg",
    alt: "Ductless mini-split outdoor unit on a brick wall, with a vacuum pump hooked to the line set and tools laid out on the walkway.",
    width: 1800,
    height: 2400,
    caption: "Mini-split installation",
  },
  {
    src: "/photos/mini-split-condenser.jpg",
    alt: "Daikin ductless mini-split condenser mounted on a brick wall above the shrubs, with its line set running through a white cover.",
    width: 1800,
    height: 2400,
    caption: "Wall-mounted condenser",
  },
  {
    src: "/photos/mini-split-garage-head.jpg",
    alt: "Ductless mini-split indoor unit mounted high on a garage wall, with a stepladder set up beneath it.",
    width: 1800,
    height: 2400,
    caption: "Mini-split head, garage",
  },
];

/**
 * Per-service hero photography, keyed by the slug in config/services.ts.
 * Any service without an entry simply keeps the drawing-sheet backdrop.
 */
export const servicePhotos: Partial<Record<string, Photo>> = {};

/** The owner, on the about page. People hire people. */
export const portrait: Photo | null = {
  src: "/photos/owner-rooftop-unit.jpg",
  alt: "The owner of FMA Industries in a company polo, standing in front of an open commercial rooftop unit.",
  width: 900,
  height: 1600,
};

export const hasWorkPhotos = workPhotos.length > 0;
