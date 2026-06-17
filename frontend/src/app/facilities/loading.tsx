export default function FacilitiesLoading() {
  return (
    <main className="min-h-screen bg-light-cream">
      <div className="bg-light-teal px-4 py-10 text-center sm:px-6 md:py-14 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-3">
          <div className="mx-auto h-10 w-64 animate-pulse rounded bg-light-teal/50" />
          <div className="mx-auto h-5 w-96 max-w-full animate-pulse rounded bg-light-teal/50" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl bg-white ring-1 ring-dark-teal/10"
            >
              <div className="aspect-[16/10] animate-pulse bg-light-teal/50" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-2/3 animate-pulse rounded bg-light-teal/50" />
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-light-teal/50" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-light-teal/50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
