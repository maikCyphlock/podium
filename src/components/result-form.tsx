import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { resultSchema, type ResultInput } from '@/lib/validations/schemas';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select } from './ui/select';

interface ResultFormProps {
  eventId: string;
}

export const ResultForm: React.FC<ResultFormProps> = ({ eventId }) => {
  const [races, setRaces] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [form, setForm] = useState<Partial<ResultInput>>({ status: 'FINISHED' });
  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Cargar carreras, categorías y participantes
  useEffect(() => {
    async function fetchData() {
      try {
        const [racesRes, categoriesRes, participantsRes] = await Promise.all([
          fetch(`/api/events/${eventId}/races`),
          fetch(`/api/events/${eventId}/categories`),
          fetch(`/api/events/${eventId}/participants`),
        ]);
        setRaces(await racesRes.json());
        setCategories(await categoriesRes.json());
        setParticipants(await participantsRes.json());
      } catch (e) {
        setErrors('Error al cargar datos relacionados');
      }
    }
    if (eventId) fetchData();
  }, [eventId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors(null);
    setSuccess(false);
    setLoading(true);
    try {
      const parsed = resultSchema.safeParse(form);
      if (!parsed.success) {
        setErrors(parsed.error.issues.map(i => i.message).join(', '));
        setLoading(false);
        return;
      }
      // Aquí deberías hacer el POST a la API de resultados
      // await fetch(`/api/events/${eventId}/results`, { ... })
      setSuccess(true);
      setForm({ status: 'FINISHED' });
    } catch (e: any) {
      setErrors('Error al guardar el resultado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="raceId">Carrera</Label>
        <select name="raceId" value={form.raceId || ''} onChange={handleChange} required className="w-full border rounded p-2">
          <option value="">Selecciona una carrera</option>
          {races.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>
      <div>
        <Label htmlFor="categoryId">Categoría</Label>
        <select name="categoryId" value={form.categoryId || ''} onChange={handleChange} required className="w-full border rounded p-2">
          <option value="">Selecciona una categoría</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <Label htmlFor="participantId">Participante</Label>
        <select name="participantId" value={form.participantId || ''} onChange={handleChange} required className="w-full border rounded p-2">
          <option value="">Selecciona un participante</option>
          {participants.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
        </select>
      </div>
      <div>
        <Label htmlFor="time">Tiempo</Label>
        <Input name="time" value={form.time || ''} onChange={handleChange} required placeholder="hh:mm:ss" />
      </div>
      <div>
        <Label htmlFor="position">Posición</Label>
        <Input name="position" type="number" value={form.position || ''} onChange={handleChange} required min={1} />
      </div>
      <div>
        <Label htmlFor="bibNumber">Dorsal</Label>
        <Input name="bibNumber" value={form.bibNumber || ''} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="status">Estado</Label>
        <select name="status" value={form.status || 'FINISHED'} onChange={handleChange} className="w-full border rounded p-2">
          <option value="FINISHED">Finalizó</option>
          <option value="DNF">No terminó (DNF)</option>
          <option value="DNS">No largó (DNS)</option>
          <option value="DSQ">Descalificado (DSQ)</option>
        </select>
      </div>
      <div>
        <Label htmlFor="notes">Notas</Label>
        <Input name="notes" value={form.notes || ''} onChange={handleChange} />
      </div>
      {errors && <div className="text-red-500">{errors}</div>}
      {success && <div className="text-green-600">Resultado guardado correctamente</div>}
      <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar Resultado'}</Button>
    </form>
  );
}; 