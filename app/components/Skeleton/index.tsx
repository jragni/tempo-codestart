/**
 * Skeleton Loading Components
 *
 * @description
 * Reusable skeleton loaders for better perceived performance
 */
"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-base-300/50 rounded ${className}`}></div>
  );
}

export function WorkspaceSkeleton() {
  return (
    <div className="flex flex-wrap w-full font-bold bg-base-300 animate-fade-in">
      {/* Problem section skeleton */}
      <div className="w-full sm:w-full md:w-[45%] lg:w-[35%] xl:max-w-[30%] p-4 md:p-6 space-y-4">
        {/* Breadcrumbs skeleton */}
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="h-8 w-3/4 mb-4" />

        {/* Difficulty badge skeleton */}
        <Skeleton className="h-6 w-20 mb-6" />

        {/* Description skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Navigation buttons skeleton */}
        <div className="flex gap-2 mt-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Code section skeleton */}
      <div className="w-full md:flex-1 md:grow space-y-2">
        {/* Theme and font size selects skeleton */}
        <div className="flex gap-2 p-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-32" />
        </div>

        {/* Code editor skeleton */}
        <Skeleton className="h-[40vh] md:h-[45vh] lg:h-[50vh] w-full" />

        {/* Buttons skeleton */}
        <div className="flex gap-2 p-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-16" />
        </div>

        {/* Console skeleton */}
        <Skeleton className="h-[35vh] md:h-[40vh] lg:h-[45vh] w-full" />
      </div>
    </div>
  );
}

export function SidebarMenuSkeleton() {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      {/* Progress card skeleton */}
      <div className="card bg-base-200 border border-base-300">
        <div className="card-body p-4 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-2.5 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Search bar skeleton */}
      <Skeleton className="h-10 w-full" />

      {/* Topics skeleton */}
      {[1, 2, 3, 4].map((i) => (
        <div key={`topic-skeleton-${i}`} className="space-y-2">
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-1.5 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={`stat-skeleton-${i}`} className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="stat-value my-2">
              <Skeleton className="h-10 w-16" />
            </div>
            <div className="stat-desc">
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProblemCardSkeleton() {
  return (
    <div className="card bg-base-100 shadow-xl animate-pulse">
      <div className="card-body">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/4 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="card-actions justify-end mt-4">
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}
