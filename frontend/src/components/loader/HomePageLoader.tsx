import { Skeleton } from "../ui/skeleton";

function HomePageLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-[98%] md:[95%]">
      {Array.from({ length: 12 }).map((_, index) => (
        <div className="p-4 border rounded-md grid gap-4" key={index}>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-20 w-44" />
        </div>
      ))}
    </div>
  );
}

export default HomePageLoader;
