import React from 'react';
import { cn } from '@/src/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl bg-[#f0f0f0]', className)}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="p-6 floating-card space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="w-14 h-14 rounded-full" />
      </div>
      <div className="space-y-3 pt-2">
        <Skeleton className="h-12 w-24 rounded-xl" />
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full rounded-lg" />
        </td>
      ))}
    </tr>
  );
}

export function KanbanCardSkeleton() {
  return (
    <div className="p-6 floating-card space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-3 w-16 rounded-full" />
        <Skeleton className="w-10 h-10 rounded-2xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4 rounded-lg" />
        <Skeleton className="h-3 w-1/2 rounded-lg" />
      </div>
      <div className="flex gap-2 pt-4 border-t border-[#f1f1f1]">
        <Skeleton className="h-6 w-20 rounded-lg" />
        <Skeleton className="h-6 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-64 rounded-xl" />
      <Skeleton className="h-5 w-96 rounded-lg" />
    </div>
  );
}

export function ListPageSkeleton() {
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <PageHeaderSkeleton />
        <Skeleton className="h-12 w-36 rounded-full" />
      </div>
      <div className="floating-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f1f1f1]">
              {Array.from({ length: 5 }).map((_, i) => (
                <th key={i} className="px-6 py-4 text-left" aria-hidden="true">
                  <Skeleton className="h-3 w-20 rounded-full" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <React.Fragment key={i}>
                <TableRowSkeleton cols={5} />
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function KanbanPageSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <PageHeaderSkeleton />
        <Skeleton className="h-12 w-36 rounded-full" />
      </div>
      <div className="flex gap-6">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="flex-1 min-w-[280px] space-y-4">
            <div className="flex items-center gap-3 px-2">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-full" />
            </div>
            {Array.from({ length: i % 2 === 0 ? 3 : 2 }).map((_, j) => (
              <KanbanCardSkeleton key={j} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
