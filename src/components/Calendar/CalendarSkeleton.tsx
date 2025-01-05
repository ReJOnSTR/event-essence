import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-8 w-[200px]" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-12 gap-2">
          <Skeleton className="h-12 col-span-1" />
          <Skeleton className="h-12 col-span-11" />
        </div>
      ))}
    </div>
  );
}