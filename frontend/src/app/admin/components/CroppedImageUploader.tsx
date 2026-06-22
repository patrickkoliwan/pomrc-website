"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createDisplayReadyImage,
  prepareSourceImage,
  processCroppedImage,
  supportedUploadAccept,
  validateSourceImage,
} from "./image-processing";

type CroppedImageUploaderProps = {
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File | null) => Promise<string>;
  /** Fixed crop ratio. Ignored when freeAspect is true. */
  aspect?: number;
  /** Allow any crop shape; output keeps the selected region's proportions. */
  freeAspect?: boolean;
  targetWidth?: number;
  maxSizeMB?: number;
  previewAlt?: string;
  helpText?: string;
};

function scalePixelCropToNatural(
  pixelCrop: PixelCrop,
  image: HTMLImageElement
): Area {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  return {
    x: Math.round(pixelCrop.x * scaleX),
    y: Math.round(pixelCrop.y * scaleY),
    width: Math.round(pixelCrop.width * scaleX),
    height: Math.round(pixelCrop.height * scaleY),
  };
}

function createInitialFreeCrop(width: number, height: number): Crop {
  return centerCrop(
    {
      unit: "%",
      width: 90,
      height: 90,
    },
    width,
    height
  );
}

export default function CroppedImageUploader({
  value,
  onChange,
  onUpload,
  aspect = 3 / 2,
  freeAspect = false,
  targetWidth = 1200,
  maxSizeMB = 0.49,
  previewAlt = "Processed image preview",
  helpText,
}: CroppedImageUploaderProps) {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(null);
  const [freeCrop, setFreeCrop] = useState<Crop>();
  const [completedFreeCrop, setCompletedFreeCrop] = useState<PixelCrop | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const freeCropImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    return () => {
      if (sourceUrl) {
        URL.revokeObjectURL(sourceUrl);
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, sourceUrl]);

  async function handleFileChange(file: File | null) {
    setMessage(null);

    if (!file) {
      return;
    }

    const validationError = validateSourceImage(file);

    if (validationError) {
      resetCropState();
      setMessage(validationError);
      return;
    }

    setIsPreparing(true);

    try {
      const prepared = await prepareSourceImage(file);

      if (sourceUrl) {
        URL.revokeObjectURL(sourceUrl);
      }

      if (freeAspect) {
        const displayReady = await createDisplayReadyImage(prepared);
        setSourceFile(displayReady.file);
        setSourceUrl(displayReady.url);
        setFreeCrop(undefined);
        setCompletedFreeCrop(null);
      } else {
        setSourceFile(prepared);
        setSourceUrl(URL.createObjectURL(prepared));
      }

      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedPixels(null);
    } catch (error) {
      resetCropState();
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not prepare this photo. Try another image."
      );
    } finally {
      setIsPreparing(false);
    }
  }

  async function createPreview() {
    let cropArea = croppedPixels;

    if (freeAspect) {
      const image = freeCropImageRef.current;

      if (!sourceFile || !freeCrop || !image) {
        setMessage("Choose the crop area before continuing.");
        return;
      }

      const pixelCrop =
        completedFreeCrop ??
        convertToPixelCrop(freeCrop, image.width, image.height);

      if (pixelCrop.width <= 0 || pixelCrop.height <= 0) {
        setMessage("Choose the crop area before continuing.");
        return;
      }

      cropArea = scalePixelCropToNatural(pixelCrop, image);
    }

    if (!sourceFile || !cropArea) {
      setMessage("Choose the crop area before continuing.");
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const processed = await processCroppedImage(sourceFile, {
        crop: cropArea,
        maxSizeMB,
        targetWidth,
        ...(freeAspect ? {} : { aspect }),
      });

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setPreviewUrl(URL.createObjectURL(processed));
      closeCropModal();
      const uploadedUrl = await onUpload(processed);
      onChange(uploadedUrl);
      setMessage("Cropped image applied. Save the record to publish this image.");
    } catch {
      setMessage("Crop/compression failure. Try another image or crop area.");
    } finally {
      setIsProcessing(false);
    }
  }

  function closeCropModal() {
    if (sourceUrl) {
      URL.revokeObjectURL(sourceUrl);
    }

    setSourceFile(null);
    setSourceUrl(null);
    setFreeCrop(undefined);
    setCompletedFreeCrop(null);
  }

  function resetCropState() {
    closeCropModal();

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }

  function handleFreeImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = event.currentTarget;
    const initialCrop = createInitialFreeCrop(width, height);
    setFreeCrop(initialCrop);
    setCompletedFreeCrop(null);
  }

  const frameAspectRatio = freeAspect ? undefined : `${aspect} / 1`;

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="/clubhouse.jpg or uploaded URL"
        className="w-full rounded-md border border-muted-teal px-3 py-2 text-dark-teal focus:outline-none focus:ring-2 focus:ring-dark-teal"
      />

      <input
        type="file"
        accept={supportedUploadAccept.replace(",image/gif", "")}
        disabled={isPreparing}
        onChange={(event) => {
          void handleFileChange(event.target.files?.[0] || null);
          event.target.value = "";
        }}
        className="block w-full text-sm text-dark-teal file:mr-3 file:rounded-md file:border-0 file:bg-light-teal file:px-3 file:py-2 file:text-dark-teal disabled:cursor-not-allowed disabled:opacity-60"
      />

      {helpText && <p className="text-xs leading-5 text-muted-teal">{helpText}</p>}
      {isPreparing && (
        <p className="text-sm text-muted-teal">Preparing image...</p>
      )}
      {message && <p className="text-sm text-deep-red">{message}</p>}

      {previewUrl && (
        <div className="space-y-3 rounded-md border border-muted-teal/30 bg-light-teal/50 p-3">
          <div
            className={`relative w-full overflow-hidden rounded-md bg-white ${
              freeAspect ? "flex max-h-64 min-h-32 items-center justify-center" : ""
            }`}
            style={freeAspect ? undefined : { aspectRatio: frameAspectRatio }}
          >
            <img
              src={previewUrl}
              alt={previewAlt}
              className={
                freeAspect
                  ? "max-h-64 w-full object-contain"
                  : "h-full w-full object-cover"
              }
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-dark-teal">
              Processed image preview
            </p>
          </div>
        </div>
      )}

      {value && (
        <div
          className={`relative w-full overflow-hidden rounded-md border border-muted-teal/20 bg-light-teal/20 ${
            freeAspect ? "flex max-h-64 min-h-32 items-center justify-center" : ""
          }`}
          style={freeAspect ? undefined : { aspectRatio: frameAspectRatio }}
        >
          <img
            src={value}
            alt={previewAlt}
            className={
              freeAspect
                ? "max-h-64 w-full object-contain"
                : "h-full w-full object-cover"
            }
          />
        </div>
      )}

      <Dialog
        open={Boolean(sourceUrl)}
        onOpenChange={(open) => {
          if (!open) {
            closeCropModal();
          }
        }}
      >
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-dark-teal">Crop image</DialogTitle>
            <DialogDescription className="text-muted-teal">
              {freeAspect
                ? "Drag the crop corners to match your poster shape, then move the crop area as needed."
                : "Drag to choose the focal area and zoom as needed."}
            </DialogDescription>
          </DialogHeader>

          {freeAspect ? (
            <div className="max-h-[min(70vh,560px)] overflow-auto rounded-md bg-dark-teal p-2">
              {sourceUrl && (
                <ReactCrop
                  crop={freeCrop}
                  onChange={setFreeCrop}
                  onComplete={(pixelCrop) => setCompletedFreeCrop(pixelCrop)}
                  className="max-h-[min(68vh,540px)]"
                >
                  <img
                    ref={freeCropImageRef}
                    src={sourceUrl}
                    alt="Crop source"
                    onLoad={handleFreeImageLoad}
                    className="max-h-[min(68vh,540px)] w-full object-contain"
                  />
                </ReactCrop>
              )}
            </div>
          ) : (
            <>
              <div
                className="relative w-full overflow-hidden rounded-md bg-dark-teal"
                style={{ aspectRatio: frameAspectRatio }}
              >
                {sourceUrl && (
                  <Cropper
                    image={sourceUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, croppedAreaPixels) =>
                      setCroppedPixels(croppedAreaPixels)
                    }
                  />
                )}
              </div>

              <label className="block text-sm font-medium text-dark-teal">
                Zoom
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(event) => setZoom(Number(event.target.value))}
                  className="mt-2 block w-full accent-dark-teal"
                />
              </label>
            </>
          )}

          <DialogFooter>
            <button
              type="button"
              onClick={closeCropModal}
              className="rounded-md border border-muted-teal px-4 py-2 text-sm font-semibold text-dark-teal hover:bg-light-teal"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={createPreview}
              disabled={isProcessing}
              className="rounded-md bg-dark-teal px-4 py-2 text-sm font-semibold text-light-cream hover:bg-muted-teal disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProcessing ? "Processing..." : "Apply crop"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
