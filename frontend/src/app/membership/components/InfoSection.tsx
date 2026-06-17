interface InfoSectionProps {
  title: string;
  intro?: string;
  children: React.ReactNode;
}

export default function InfoSection({ title, intro, children }: InfoSectionProps) {
  return (
    <section className="rounded-lg bg-white p-4 shadow-md sm:p-6">
      <h2 className="text-2xl font-semibold text-dark-teal sm:text-3xl">
        {title}
      </h2>
      {intro && (
        <p className="mb-6 mt-2 text-sm text-dark-teal/80 sm:text-base">
          {intro}
        </p>
      )}
      {!intro && <div className="mb-6" />}
      {children}
    </section>
  );
}
