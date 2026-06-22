"use client";

import type { Area } from "react-easy-crop";
import {
  CMS_IMAGE_PRESETS,
  maxSourceImageBytes,
  preCropMaxDimension,
  preCropMaxSizeMB,
} from "./image-presets";

export {
  CMS_IMAGE_PRESETS,
  maxSourceImageBytes,
  preCropMaxDimension,
  preCropMaxSizeMB,
  supportedImageTypes,
  supportedUploadAccept,
} from "./image-presets";

const heicTypes = new Set(["image/heic", "image/heif"]);
const rasterTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const webpQuality = 0.84;

type ProcessCropOptions = {
  crop: Area;
  /** When omitted, output keeps the crop region's aspect ratio. */
  aspect?: number;
  targetWidth: number;
  maxSizeMB: number;
};

type WebCompressPreset = {
  targetWidth: number;
  maxSizeMB: number;
};

function getOutputDimensions(
  crop: Area,
  targetWidth: number,
  aspect?: number
): { width: number; height: number } {
  if (aspect != null) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspect),
    };
  }

  const longestSide = Math.max(crop.width, crop.height);
  const scale = targetWidth / longestSide;

  return {
    width: Math.max(1, Math.round(crop.width * scale)),
    height: Math.max(1, Math.round(crop.height * scale)),
  };
}

function isHeicFile(file: File) {
  if (heicTypes.has(file.type)) {
    return true;
  }

  return /\.heic$|\.heif$/i.test(file.name);
}

function isRasterImage(file: File) {
  if (rasterTypes.has(file.type)) {
    return true;
  }

  return isHeicFile(file);
}

export function validateSourceImage(file: File) {
  if (file.type === "image/gif") {
    return "GIF images are not supported here. Upload a JPG, PNG, WebP, or HEIC photo.";
  }

  if (!isRasterImage(file)) {
    return "Unsupported file type. Upload a JPG, PNG, WebP, or HEIC image.";
  }

  if (file.size > maxSourceImageBytes) {
    return "File too large. Choose a photo under 25MB.";
  }

  return null;
}

async function getImageCompression() {
  const compressionModule = await import("browser-image-compression");
  return compressionModule.default;
}

async function convertHeicToJpeg(file: File): Promise<File> {
  try {
    const { default: heic2any } = await import("heic2any");
    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.92,
    });

    const blob = Array.isArray(converted) ? converted[0] : converted;

    return new File(
      [blob],
      replaceExtension(file.name, "jpg"),
      { type: "image/jpeg" }
    );
  } catch {
    throw new Error("Could not read this HEIC photo. Try saving it as JPEG first.");
  }
}

async function readImageDimensions(file: File): Promise<{
  width: number;
  height: number;
}> {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });

  try {
    return { width: bitmap.width, height: bitmap.height };
  } finally {
    bitmap.close();
  }
}

function needsPreCropNormalization(file: File, width: number, height: number) {
  const longestSide = Math.max(width, height);
  return file.size > 5 * 1024 * 1024 || longestSide > preCropMaxDimension;
}

export async function prepareSourceImage(file: File): Promise<File> {
  const validationError = validateSourceImage(file);

  if (validationError) {
    throw new Error(validationError);
  }

  let workingFile = file;

  if (isHeicFile(workingFile)) {
    workingFile = await convertHeicToJpeg(workingFile);
  }

  if (workingFile.size > maxSourceImageBytes) {
    throw new Error("File too large. Choose a photo under 25MB.");
  }

  const { width, height } = await readImageDimensions(workingFile);

  if (!needsPreCropNormalization(workingFile, width, height)) {
    return workingFile;
  }

  const imageCompression = await getImageCompression();
  const compressedBlob = await imageCompression(workingFile, {
    fileType: workingFile.type === "image/png" ? "image/png" : "image/jpeg",
    initialQuality: 0.9,
    maxSizeMB: preCropMaxSizeMB,
    maxWidthOrHeight: preCropMaxDimension,
    useWebWorker: true,
  });

  const extension =
    compressedBlob.type === "image/png"
      ? "png"
      : compressedBlob.type === "image/webp"
        ? "webp"
        : "jpg";

  return new File(
    [compressedBlob],
    replaceExtension(workingFile.name, extension),
    { type: compressedBlob.type }
  );
}

export async function compressImageForWeb(
  file: File,
  preset: WebCompressPreset = CMS_IMAGE_PRESETS.directUpload
): Promise<File> {
  if (file.type === "image/gif") {
    return file;
  }

  const prepared = await prepareSourceImage(file);
  const { width, height } = await readImageDimensions(prepared);
  const longestSide = Math.max(width, height);
  const scale = preset.targetWidth / longestSide;
  const outputWidth = Math.max(1, Math.round(width * scale));
  const outputHeight = Math.max(1, Math.round(height * scale));

  const bitmap = await createImageBitmap(prepared, {
    imageOrientation: "from-image",
  });

  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not prepare the image for compression.");
    }

    canvas.width = outputWidth;
    canvas.height = outputHeight;
    context.drawImage(bitmap, 0, 0, outputWidth, outputHeight);

    const webpBlob = await canvasToBlob(canvas, "image/webp", webpQuality);
    const maxDimension = Math.max(outputWidth, outputHeight);
    const imageCompression = await getImageCompression();
    const compressedBlob = await imageCompression(
      new File([webpBlob], replaceExtension(prepared.name, "webp"), {
        type: "image/webp",
      }),
      {
        fileType: "image/webp",
        initialQuality: webpQuality,
        maxSizeMB: preset.maxSizeMB,
        maxWidthOrHeight: maxDimension,
        useWebWorker: true,
      }
    );

    return new File([compressedBlob], replaceExtension(prepared.name, "webp"), {
      type: "image/webp",
    });
  } finally {
    bitmap.close();
  }
}

export async function processCroppedImage(
  file: File,
  options: ProcessCropOptions
) {
  const imageUrl = URL.createObjectURL(file);

  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });

    try {
      const { width: outputWidth, height: outputHeight } = getOutputDimensions(
        options.crop,
        options.targetWidth,
        options.aspect
      );
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Could not prepare the image crop.");
      }

      canvas.width = outputWidth;
      canvas.height = outputHeight;
      context.drawImage(
        bitmap,
        options.crop.x,
        options.crop.y,
        options.crop.width,
        options.crop.height,
        0,
        0,
        outputWidth,
        outputHeight
      );

      const webpBlob = await canvasToBlob(canvas, "image/webp", webpQuality);
      const maxDimension = Math.max(outputWidth, outputHeight);
      const imageCompression = await getImageCompression();
      const compressedBlob = await imageCompression(
        new File([webpBlob], replaceExtension(file.name, "webp"), {
          type: "image/webp",
        }),
        {
          fileType: "image/webp",
          initialQuality: webpQuality,
          maxSizeMB: options.maxSizeMB,
          maxWidthOrHeight: maxDimension,
          useWebWorker: true,
        }
      );

      return new File([compressedBlob], replaceExtension(file.name, "webp"), {
        type: "image/webp",
      });
    } finally {
      bitmap.close();
    }
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("Could not export the cropped image."));
      },
      type,
      quality
    );
  });
}

function replaceExtension(fileName: string, extension: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "") || "upload";
  return `${baseName}.${extension}`;
}

/** Bake EXIF orientation so crop UI pixels match export coordinates. */
export async function createDisplayReadyImage(file: File): Promise<{
  file: File;
  url: string;
}> {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });

  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not prepare the image for cropping.");
    }

    context.drawImage(bitmap, 0, 0);
    const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
    const displayFile = new File(
      [blob],
      replaceExtension(file.name, "jpg"),
      { type: "image/jpeg" }
    );

    return {
      file: displayFile,
      url: URL.createObjectURL(displayFile),
    };
  } finally {
    bitmap.close();
  }
}
