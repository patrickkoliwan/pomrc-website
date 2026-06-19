"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  processCroppedImage,
  validateSourceImage,
} from "./image-processing";

type CroppedImageUploaderProps = {
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File | null) => Promise<string>;
  aspect?: number;
  targetWidth?: number;
};

export default function CroppedImageUploader({
  value,
  onChange,
  onUpload,
  aspect = 3 / 2,
  targetWidth = 1200,
}: CroppedImageUploaderProps) {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  function handleFileChange(file: File | null) {
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

    if (sourceUrl) {
      URL.revokeObjectURL(sourceUrl);
    }

    setSourceFile(file);
    setSourceUrl(URL.createObjectURL(file));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedPixels(null);
  }

  async function createPreview() {
    if (!sourceFile || !croppedPixels) {
      setMessage("Choose the crop area before continuing.");
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const processed = await processCroppedImage(sourceFile, {
        aspect,
        crop: croppedPixels,
        maxSizeMB: 0.49,
        targetWidth,
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
  }

  function resetCropState() {
    closeCropModal();

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }

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
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => {
          handleFileChange(event.target.files?.[0] || null);
          event.target.value = "";
        }}
        className="block w-full text-sm text-dark-teal file:mr-3 file:rounded-md file:border-0 file:bg-light-teal file:px-3 file:py-2 file:text-dark-teal"
      />

      {message && <p className="text-sm text-deep-red">{message}</p>}

      {previewUrl && (
        <div className="space-y-3 rounded-md border border-muted-teal/30 bg-light-teal/50 p-3">
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md bg-white">
            <img
              src={previewUrl}
              alt="Processed junior program preview"
              className="h-full w-full object-cover"
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
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md border border-muted-teal/20 bg-light-teal/20">
          <img
            src={value}
            alt="Current junior program"
            className="h-full w-full object-cover"
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
              Drag to choose the focal area and zoom as needed.
            </DialogDescription>
          </DialogHeader>

          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md bg-dark-teal">
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
