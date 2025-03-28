import Image from "next/image";

interface FacilityCardProps {
  title: string;
  description: string;
  imageUrl: string;
  priority?: boolean;
}

export default function FacilityCard({
  title,
  description,
  imageUrl,
  priority = false,
}: FacilityCardProps) {
  return (
    <div className="group bg-gray-100 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative w-full h-56">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-teal/20 to-transparent z-10" />
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority={priority}
          quality={85}
          className="object-cover transform group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyUC08LSw1NDBAQFZJOjU6PUFXYWNkY2lrbW1pf3x/e4iKc4KDgP/2wBDARUXFx4aHh4gICD4lJSU+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
      </div>
      <div className="p-6 border-t border-gray-100 bg-gray-100">
        <h3 className="text-xl font-semibold text-dark-teal mb-3 group-hover:text-deep-red transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-teal leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
