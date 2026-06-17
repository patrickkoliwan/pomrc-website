import { HERO_TAGLINE, HERO_TITLE } from "./facilities-content";

export default function FacilitiesHero() {
  return (
    <header className="bg-light-teal px-4 py-10 text-center sm:px-6 md:py-14 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-dark-teal md:text-4xl lg:text-5xl">
          {HERO_TITLE}
        </h1>
        <p className="mt-3 text-base text-dark-teal/80 md:mt-4 md:text-lg">
          {HERO_TAGLINE}
        </p>
      </div>
    </header>
  );
}
