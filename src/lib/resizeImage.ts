/**
 * Downscale a photo in the browser before upload.
 *
 * Phone cameras produce 4–12MB images. A data plate is perfectly legible at
 * 1600px, and the customer is often on a restaurant's saturated wifi or a
 * basement signal — so shrinking client-side is the difference between the
 * request going through and being abandoned.
 *
 * Falls back to the original file if anything goes wrong; a large photo is far
 * better than no photo.
 */
export async function resizeImage(file: File, maxEdge = 1600, quality = 0.82): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  // HEIC and friends can't be decoded by createImageBitmap in every browser.
  if (!/jpeg|jpg|png|webp/i.test(file.type)) return file;
  if (file.size < 400_000) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));

    if (scale === 1) {
      bitmap.close();
      return file;
    }

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );

    if (!blob || blob.size >= file.size) return file;

    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}

export const MAX_PHOTOS = 4;

/** Per-file gate applied BEFORE downscaling, which brings most photos well under. */
export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

/**
 * Total across all photos, AFTER downscaling.
 *
 * Held at 4MB because serverless platforms cap request bodies at roughly 4.5MB
 * (Vercel does), and the platform rejects an oversized body with a 413 before
 * any of our code runs. The previous 18MB was a limit we could never actually
 * honour, and the first casualty would have been an emergency with four photos.
 *
 * In practice this is not tight: at 1600px and quality 0.82 a phone photo lands
 * around 250-500KB, so four come to roughly 1-2MB. If real submissions ever
 * approach the cap, the fix is uploading straight from the browser to Storage
 * rather than raising this number.
 */
export const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
