"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

interface UserEventStatusProps {
  slug: string;
}

export function UserEventStatus({ slug }: UserEventStatusProps) {
  const { data: session } = useSession();
  const userID = session?.user?.id;
  const [email, setEmail] = useState("");
  const [participants, setParticipants] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  // Consulta automática si hay usuario autenticado
  useEffect(() => {
    if (!userID) return;
    setIsLoading(true);
    fetch(`/api/public/events/${slug}/participants?id=${encodeURIComponent(userID)}`)
      .then(res => res.json())
      .then(data => {
        setParticipants(Array.isArray(data.participants) ? data.participants : data.participant ? [data.participant] : []);
        setChecked(true);
      })
      .catch(() => {
        setParticipants([]);
        setChecked(true);
      })
      .finally(() => setIsLoading(false));
  }, [userID, slug]);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setChecked(false);
    setParticipants(null);
    try {
      const res = await fetch(`/api/public/events/${slug}/participants?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setParticipants(Array.isArray(data.participants) ? data.participants : data.participant ? [data.participant] : []);
      setChecked(true);
    } catch {
      setParticipants([]);
      setChecked(true);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCard = (p: any, idx: number) => (
    <div key={p.id || idx} className="p-6 rounded-2xl bg-white mb-6 shadow-md border border-gray-200 flex flex-col gap-3 hover:shadow-lg transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <h2 className="text-lg font-bold text-gray-900 line-clamp-1">{p.firstName} {p.lastName}</h2>
      
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-2">
      <span>fecha en la registro de la inscripción</span><br />
        <div className="flex items-center gap-1">
           
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {p.createdAt ? new Date(p.createdAt).toLocaleString('es-VE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Sin fecha'}
        </div>
        {p.country && (
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z" /></svg>
            {p.country}
          </div>
        )}
        {p.city && (
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 0c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4z" /></svg>
            {p.city}
          </div>
        )}
      </div>
      <ul className="text-sm grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
        <li><b>Email:</b> {p.email}</li>
        <li><b>Fecha de nacimiento:</b> {p.birthDate ? new Date(p.birthDate).toLocaleDateString('es-VE') : "No especificada"}</li>
        <li><b>Género:</b> {p.gender =='MALE' ? 'masculino':p.gender =='FEMALE'? 'femenino' : 'desconocido'} </li>
        <li><b>País:</b> {p.country}</li>
        {p.phone && <li><b>Teléfono:</b> {p.phone}</li>}
        {p.emergencyContact && <li><b>Contacto de emergencia:</b> {p.emergencyContact}</li>}
        {p.bloodType && <li><b>Tipo de sangre:</b> {p.bloodType}</li>}
      </ul>
    </div>
  );

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2">¿Ya te inscribiste?</h3>
      {!userID && (
        <form className="flex flex-col md:flex-row gap-2 items-center mb-4" onSubmit={handleCheck}>
          <Input
            type="email"
            placeholder="Ingresa tu correo para consultar"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="max-w-xs"
          />
          <Button type="submit" disabled={isLoading || !email}>
            {isLoading ? "Consultando..." : "Consultar inscripción"}
          </Button>
        </form>
      )}
      {checked && participants && participants.length > 0 && (
        <>
          <p className="mb-4 text-green-900 font-medium">
            Tienes <b>{participants[0].length}</b> inscripción(es) para este evento:
          </p>
          {participants[0].map(renderCard)}
          
        </>
      )}
      {checked && participants && participants.length === 0 && (
        <div className="p-4 rounded bg-yellow-50 text-yellow-800">
          No encontramos una inscripción con esos datos para este evento.
        </div>
      )}
    </div>
  );
} 