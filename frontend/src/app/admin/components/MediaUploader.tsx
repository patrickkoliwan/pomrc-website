"use client";

import { useState } from "react";

export default function MediaUploader() {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function upload(file: File | null) {
    if (!file) {
      return;
    }

    setError(null);
    setUrl(null);
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

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
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-dark-teal">Upload Image</h2>
      <p className="mt-2 text-sm leading-6 text-dark-teal/75">
        Upload JPEG, PNG, WebP, or GIF files up to 5MB. The returned URL can be
        pasted into any image field.
      </p>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(event) => upload(event.target.files?.[0] || null)}
        className="mt-6 block w-full text-sm text-dark-teal file:mr-3 file:rounded-md file:border-0 file:bg-light-teal file:px-3 file:py-2 file:text-dark-teal"
      />
      {isUploading && <p className="mt-4 text-sm text-muted-teal">Uploading...</p>}
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
