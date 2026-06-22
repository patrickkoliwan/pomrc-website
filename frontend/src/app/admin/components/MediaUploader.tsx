"use client";

import { useState } from "react";
import {
  CMS_IMAGE_PRESETS,
  compressImageForWeb,
  supportedUploadAccept,
  validateSourceImage,
} from "./image-processing";

export default function MediaUploader() {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function upload(file: File | null) {
    if (!file) {
      return;
    }

    setError(null);
    setUrl(null);

    if (file.type !== "image/gif") {
      const validationError = validateSourceImage(file);

      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setIsPreparing(true);

    try {
      const processed =
        file.type === "image/gif"
          ? file
          : await compressImageForWeb(file, CMS_IMAGE_PRESETS.directUpload);

      setIsPreparing(false);
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", processed);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setIsUploading(false);

      if (!response.ok) {
        setError(result.error || "Upload failed");
        return;
      }

      setUrl(result.url);
    } catch (uploadError) {
      setIsPreparing(false);
      setIsUploading(false);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Could not prepare this photo for upload."
      );
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-dark-teal">Upload Image</h2>
      <p className="mt-2 text-sm leading-6 text-dark-teal/75">
        Phone photos welcome, including HEIC. Large files are compressed
        automatically to WebP around 1600px. GIF files upload unchanged.
      </p>
      <input
        type="file"
        accept={supportedUploadAccept}
        disabled={isPreparing || isUploading}
        onChange={(event) => {
          void upload(event.target.files?.[0] || null);
          event.target.value = "";
        }}
        className="mt-6 block w-full text-sm text-dark-teal file:mr-3 file:rounded-md file:border-0 file:bg-light-teal file:px-3 file:py-2 file:text-dark-teal disabled:cursor-not-allowed disabled:opacity-60"
      />
      {isPreparing && (
        <p className="mt-4 text-sm text-muted-teal">Preparing image...</p>
      )}
      {isUploading && (
        <p className="mt-4 text-sm text-muted-teal">Uploading...</p>
      )}
      {error && <p className="mt-4 text-sm text-deep-red">{error}</p>}
      {url && (
        <div className="mt-4 rounded-md border border-muted-teal/30 bg-light-teal p-4">
          <p className="text-sm font-medium text-dark-teal">Uploaded URL</p>
          <code className="mt-2 block break-all text-sm text-dark-teal">{url}</code>
        </div>
      )}
    </div>
  );
}
