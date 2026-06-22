export const CMS_IMAGE_PRESETS = {
  landscapePromo: { aspect: 3 / 2, targetWidth: 1200, maxSizeMB: 0.49 },
  /** Events: free-aspect crop; longest side scaled to targetWidth. */
  eventPoster: { targetWidth: 1200, maxSizeMB: 0.49 },
  squarePortrait: { aspect: 1, targetWidth: 800, maxSizeMB: 0.49 },
  /** Media Library and raw image fields (no crop). */
  directUpload: { targetWidth: 1600, maxSizeMB: 0.49 },
} as const;

export const supportedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

export const supportedUploadAccept =
  "image/jpeg,image/png,image/webp,image/heic,image/heif,image/gif";

export const maxSourceImageBytes = 25 * 1024 * 1024;
export const preCropMaxDimension = 2400;
export const preCropMaxSizeMB = 8;
