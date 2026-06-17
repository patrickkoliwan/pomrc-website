import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/firebase/admin";
import { getStorageBucketName, getSupabaseAdminClient } from "@/lib/supabase/server";

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const maxBytes = 5 * 1024 * 1024;

function safeFileName(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() || "bin";
  const base = name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${base || "upload"}-${Date.now()}.${extension}`;
}

export async function POST(request: Request) {
  await requireAdmin();

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
      { status: 400 }
    );
  }

  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: "Images must be 5MB or smaller" },
      { status: 400 }
    );
  }

  const bucket = getStorageBucketName();
  const path = `uploads/${safeFileName(file.name)}`;
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl, path });
}
