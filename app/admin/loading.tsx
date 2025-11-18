/**
 * Loading state for admin page
 */
import { AdminStatsSkeleton } from '@components';

export default function Loading() {
  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-pulse">
          <div className="h-10 w-64 bg-base-300 rounded mb-2"></div>
          <div className="h-5 w-48 bg-base-300 rounded"></div>
        </div>

        {/* Statistics Cards Skeleton */}
        <AdminStatsSkeleton />

        {/* Form Section Skeleton */}
        <div className="card bg-base-100 shadow-xl animate-pulse">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <div className="h-8 w-48 bg-base-300 rounded"></div>
              <div className="h-10 w-64 bg-base-300 rounded"></div>
            </div>
            <div className="divider"></div>
            <div className="space-y-4">
              <div className="h-10 w-full bg-base-300 rounded"></div>
              <div className="h-10 w-full bg-base-300 rounded"></div>
              <div className="h-32 w-full bg-base-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
