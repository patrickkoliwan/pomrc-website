import Image from "next/image";
import { BLUR_DATA_URL, priorityImageIds } from "./facilities-content";

interface FacilityCardMinimalProps {
  title: string;
  description: string;
  imageUrl: string;
  id: string;
}

export default function FacilityCardMinimal({
  title,
  description,
  imageUrl,
  id,
}: FacilityCardMinimalProps) {
  const priority = priorityImageIds.has(id);

  return (
    <article className="overflow-hidden rounded-xl bg-white ring-1 ring-dark-teal/10 transition-colors hover:ring-dark-teal/20">
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
      </div>
      <div className="p-5">
        <h2 className="text-lg font-semibold text-dark-teal">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-dark-teal/80">
          {description}
        </p>
      </div>
    </article>
  );
}
