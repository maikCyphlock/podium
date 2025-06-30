"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import React from 'react';
import { slugify } from '@/lib/utils/slugify';

export default function CreateEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSlug(slugify(title));
  }, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) {
      toast.error('El título y la fecha son obligatorios');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          date: date.toISOString(),
          location,
          image,
          slug,
        }),
      });
      if (res.ok) {
        toast.success('Evento creado exitosamente');
        router.push('/dashboard/events');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error al crear el evento');
      }
    } catch (error) {
      toast.error('Error de red al crear el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Crear nuevo evento</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={slug} readOnly className="bg-gray-100" />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="date">Fecha *</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={es}
              className="border rounded-md"
            />
            {date && <div className="text-sm text-gray-500 mt-1">{format(date, 'PPP', { locale: es })}</div>}
          </div>
          <div>
            <Label htmlFor="location">Ubicación</Label>
            <Input id="location" value={location} onChange={e => setLocation(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="image">Imagen (URL)</Label>
            <Input id="image" value={image} onChange={e => setImage(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creando...' : 'Crear evento'}
          </Button>
        </form>
      </Card>
    </div>
  );
} 