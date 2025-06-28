"use client";
import Link from 'next/link';
import { useState } from 'react';

interface Event {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  image?: string;
  description?: string;
  status?: string;
  price?: number;
}

export default function EventsListClient({ events }: { events: Event[] }) {
  // Agrupación lógica: próximos y pasados
  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) >= now);
  const pastEvents = events.filter((e) => new Date(e.date) < now);

  // Simulación de paginación/carga limitada
  const PAGE_SIZE = 6;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const showMore = () => setVisibleCount((c) => c + PAGE_SIZE);

  // Filtros y búsqueda (simples, para demo visual)
  // Puedes expandir esto con lógica real y estado

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900">Eventos públicos</h1>
      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
        <input
          type="text"
          placeholder="Buscar eventos..."
          className="w-full sm:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-2">
          <select className="px-3 py-2 border rounded-lg text-sm">
            <option>Todos</option>
            <option>Próximos</option>
            <option>Pasados</option>
          </select>
          <select className="px-3 py-2 border rounded-lg text-sm">
            <option>Ordenar por fecha</option>
            <option>Ordenar por relevancia</option>
          </select>
        </div>
      </div>
      {/* Agrupación lógica */}
      {upcomingEvents.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-primary">Próximos Eventos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.slice(0, visibleCount).map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group border border-gray-200 rounded-2xl p-0 shadow-md flex flex-col bg-white hover:shadow-xl transition overflow-hidden cursor-pointer focus:ring-2 focus:ring-primary"
              >
                {/* Imagen */}
                {event.image && (
                  <div className="w-full h-44 bg-gray-100 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                {/* Contenido */}
                <div className="flex-1 flex flex-col p-5 gap-2">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {new Date(event.date).toLocaleDateString('es-VE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    {/* Estado y costo (simulado) */}
                    {event.status === 'cancelled' && (
                      <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">Cancelado</span>
                    )}
                    {event.status === 'full' && (
                      <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">Lleno</span>
                    )}
                    {event.price === 0 && (
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Gratuito</span>
                    )}
                    {event.price && event.price > 0 && (
                      <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">Bs. {event.price}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{event.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z" /></svg>
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <p className="text-gray-600 line-clamp-2 text-sm mb-2">{event.description}</p>
                  <button
                    className="mt-auto inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary/90 transition text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    Ver detalles e inscribirse
                  </button>
                </div>
              </Link>
            ))}
          </div>
          {upcomingEvents.length > visibleCount && (
            <div className="flex justify-center mt-8">
              <button
                onClick={showMore}
                className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Cargar más eventos
              </button>
            </div>
          )}
        </section>
      )}
      {/* Eventos pasados */}
      {pastEvents.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-6 text-gray-500">Eventos Pasados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.slice(0, 3).map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group border border-gray-100 rounded-2xl p-0 shadow-sm flex flex-col bg-gray-50 hover:shadow-md transition overflow-hidden cursor-pointer"
              >
                {event.image && (
                  <div className="w-full h-44 bg-gray-100 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col p-5 gap-2">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {new Date(event.date).toLocaleDateString('es-VE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 line-clamp-1">{event.title}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z" /></svg>
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <p className="text-gray-500 line-clamp-2 text-sm mb-2">{event.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      {/* Si no hay eventos */}
      {events.length === 0 && (
        <p className="text-center text-muted-foreground">No hay eventos disponibles en este momento.</p>
      )}
    </div>
  );
} 