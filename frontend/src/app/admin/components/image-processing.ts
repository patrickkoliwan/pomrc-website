import imageCompression from "browser-image-compression";
import type { Area } from "react-easy-crop";

export const supportedImageTypes = ["image/jpeg", "image/png", "image/webp"];
export const maxSourceImageBytes = 5 * 1024 * 1024;

type ProcessCropOptions = {
  crop: Area;
  aspect: number;
  targetWidth: number;
  maxSizeMB: number;
};

export function validateSourceImage(file: File) {
  if (!supportedImageTypes.includes(file.type)) {
    return "Unsupported file type. Upload a JPG, PNG, or WebP image.";
  }

  if (file.size > maxSourceImageBytes) {
    return "File too large. Upload an image smaller than 5MB.";
  }

  return null;
}

export async function processCroppedImage(
  file: File,
  options: ProcessCropOptions
) {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(imageUrl);
    const targetHeight = Math.round(options.targetWidth / options.aspect);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not prepare the image crop.");
    }

    canvas.width = options.targetWidth;
    canvas.height = targetHeight;
    context.drawImage(
      image,
      options.crop.x,
      options.crop.y,
      options.crop.width,
      options.crop.height,
      0,
      0,
      options.targetWidth,
      targetHeight
    );

    const webpBlob = await canvasToBlob(canvas, "image/webp", 0.84);
    const compressedBlob = await imageCompression(
      new File([webpBlob], replaceExtension(file.name, "webp"), {
        type: "image/webp",
      }),
      {
        fileType: "image/webp",
        initialQuality: 0.84,
        maxSizeMB: options.maxSizeMB,
        maxWidthOrHeight: options.targetWidth,
        useWebWorker: true,
      }
    );

    return new File([compressedBlob], replaceExtension(file.name, "webp"), {
      type: "image/webp",
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read the selected image."));
    image.src = src;
  });
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
  const baseName = fileName.replace(/\.[^.]+$/, "") || "junior-program";
  return `${baseName}.${extension}`;
}
