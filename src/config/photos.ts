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
export const workPhotos: Photo[] = [];

/**
 * Per-service hero photography, keyed by the slug in config/services.ts.
 * Any service without an entry simply keeps the drawing-sheet backdrop.
 */
export const servicePhotos: Partial<Record<string, Photo>> = {};

/** The owner, on the about page. People hire people. */
export const portrait: Photo | null = null;

export const hasWorkPhotos = workPhotos.length > 0;
