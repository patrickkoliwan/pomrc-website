export default function FacilitiesLoading() {
  return (
    <main className="min-h-screen bg-light-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-12 w-64 bg-gray-200 rounded-lg animate-pulse mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative w-full h-56 bg-gray-200 animate-pulse" />
              <div className="p-6">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
