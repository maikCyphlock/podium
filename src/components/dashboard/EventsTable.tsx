'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

// Este tipo debe coincidir con lo que devuelve la API de eventos
interface Event {
  id: string;
  title: string;
  date: string;
  isPublished: boolean;
  _count?: {
    participants: number;
  };
  // La API devuelve `_count` pero podemos simplificarlo para el componente
  participantCount: number;
}

export function EventsTable() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events?limit=5'); // Obtenemos los 5 más recientes
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        // Mapeamos los datos para que coincidan con la estructura esperada
        const formattedEvents = data.data.map((event: any) => ({
          ...event,
          participantCount: event._count?.participants ?? 0,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error(error);
        // TODO: Manejar el error con una notificación (toast)
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const getStatus = (isPublished: boolean, date: string) => {
    if (new Date(date) < new Date() && isPublished) return "Finalizado";
    if (isPublished) return "Publicado";
    return "Borrador";
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Publicado":
        return "default";
      case "Borrador":
        return "secondary";
      case "Finalizado":
        return "outline";
      default:
        return "default";
    }
  };

  if (loading) {
    return <div>Cargando eventos...</div>; // TODO: Reemplazar con un Skeleton Loader
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre del Evento</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Estatus</TableHead>
          <TableHead className="text-right">Inscritos</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.length > 0 ? (
          events.map((event) => {
            const status = getStatus(event.isPublished, event.date);
            return (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(status)}>{status}</Badge>
                </TableCell>
                <TableCell className="text-right">{event.participantCount}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/events/${event.id}`}>Gestionar</Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Aún no has creado ningún evento.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
