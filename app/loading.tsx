/**
 * Loading state for homepage
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-base-200 animate-pulse">
      {/* Hero skeleton */}
      <div className="relative h-[50vh] bg-base-300">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 z-10 p-4">
            <div className="h-16 w-96 max-w-full bg-base-100/50 rounded mx-auto"></div>
            <div className="h-8 w-64 max-w-full bg-base-100/50 rounded mx-auto"></div>
            <div className="h-12 w-40 bg-base-100/50 rounded mx-auto mt-8"></div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container mx-auto p-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={`card-skeleton-${i}`} className="card bg-base-100 shadow-xl">
              <div className="card-body space-y-4">
                <div className="h-6 w-3/4 bg-base-300 rounded"></div>
                <div className="h-4 w-1/4 bg-base-300 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-base-300 rounded"></div>
                  <div className="h-4 w-5/6 bg-base-300 rounded"></div>
                  <div className="h-4 w-4/5 bg-base-300 rounded"></div>
                </div>
                <div className="h-8 w-24 bg-base-300 rounded ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
