import { Icons } from "@/components/icons";

export function Loading({ message = "Cargando..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
      <Icons.Sailboat className="h-8 w-8 animate-spin mb-2" />
      <span>{message}</span>
    </div>
  );
} 