import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getEventStatusVariant(status: string) {
  switch (status) {
    case "ACTIVO":
      return "default";
    case "FINALIZADO":
      return "secondary";
    case "CANCELADO":
      return "destructive";
    case "POSTERGADO":
      return "outline";
    default:
      return "default";
  }
}
