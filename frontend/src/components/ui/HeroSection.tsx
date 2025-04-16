import Image from "next/image";

interface HeroSectionProps {
  title: string;
  tagline?: string;
  backgroundImage: string;
  altText: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  tagline,
  backgroundImage,
  altText,
}) => {
  return (
    <div className="relative h-[50vh] min-h-[300px] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt={altText}
        fill
        className="object-cover z-0"
        priority // Prioritize loading for LCP
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-dark-teal/50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-light-cream p-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          {title}
        </h1>
        {tagline && (
          <p className="text-lg sm:text-xl md:text-2xl font-light">{tagline}</p>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
