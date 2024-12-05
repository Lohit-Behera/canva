import { Skeleton } from "../ui/skeleton";

function FormPageLoader() {
  return (
    <div className="grid gap-4 p-4 border rounded-md w-[98%] md:w-[90%]">
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-10 w-10 my-auto" />
      </div>
      <Skeleton className="h-3 w-52" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default FormPageLoader;
