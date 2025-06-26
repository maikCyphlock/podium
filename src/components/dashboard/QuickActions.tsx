import { Button } from "@/components/ui/button";
import Link from "next/link";

export function QuickActions() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild>
        <Link href="/dashboard/events/new">+ Crear Nuevo Evento</Link>
      </Button>
    </div>
  );
}
