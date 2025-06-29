import { EventRegistrationForm } from '@/components/public/EventRegistrationForm';
import { UserEventStatus } from '@/components/public/UserEventStatus';

export default async function EventDetailPage({ params }: { params: { slug: string } }) {

async function getEvent(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/public/events/${slug}`, { cache: 'no-store' });

  if (!res.ok) return null;
  return await res.json();
}
  const { slug }  = await params
  
  const event = await getEvent(slug);

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Evento no encontrado</h1>
        <p>El evento que buscas no existe o no está publicado.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Imagen destacada */}
      {event.image && (
        <div className="w-full h-56 sm:h-72 md:h-80 lg:h-96 mb-6 overflow-hidden rounded-lg shadow">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}
      {/* Título */}
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-gray-900 text-center">{event.title}</h1>
      {/* Detalles clave */}
      <div className="flex flex-col sm:flex-row sm:justify-center gap-4 mb-6 text-gray-700 text-base">
        <div className="flex items-center gap-2 justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span>{new Date(event.date).toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z" /></svg>
          <span>{event.location}</span>
        </div>
      </div>
      {/* Descripción */}
      <div className="mb-8 text-gray-800 text-justify leading-relaxed bg-gray-50 rounded p-4 shadow-sm">
        {event.description}
      </div>
      {/* Límite de participantes */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded text-blue-900 text-sm">
        Puedes inscribir hasta <span className="font-semibold">5 participantes</span> por cuenta en este evento. Si necesitas registrar más, por favor utiliza otra cuenta o contacta a los organizadores.
      </div>
      <UserEventStatus slug={slug} />
      <EventRegistrationForm slug={slug} />
    </div>
  );
} 