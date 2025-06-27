import { Icons } from "@/components/icons";

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-red-500">
      <Icons.X className="h-8 w-8 mb-2" />
      <span>{message}</span>
    </div>
  );
} 