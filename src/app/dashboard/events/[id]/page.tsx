"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select } from "@/components/ui/select";
import { eventSchema, type EventInput } from "@/lib/validations/schemas";
import { ResultForm } from "@/components/result-form";
import { Loading } from "@/components/ui/Loading";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;
  const [event, setEvent] = useState<EventInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<EventInput>>({});

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) throw new Error("No se pudo cargar el evento");
        const data = await res.json();
        setEvent(data);
        setForm({
          title: data.title,
          description: data.description,
          date: data.date,
          location: data.location,
          image: data.image,
          isPublished: data.isPublished,
          categoryIds: data.categories?.map((c: any) => c.id) || [],
        });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (eventId) fetchEvent();
  }, [eventId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target;
    const { name, value, type } = target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" && target instanceof HTMLInputElement ? target.checked : value,
    }));
  }

  function normalizeForm(form: Partial<EventInput>): EventInput {
    let dateValue = form.date ?? "";
    if (dateValue && !dateValue.endsWith("Z") && dateValue.length === 16) {
      const local = new Date(dateValue);
      dateValue = local.toISOString();
    }
    return {
      title: form.title ?? "",
      description: form.description ?? "",
      date: dateValue,
      location: form.location ?? "",
      image: form.image ?? "",
      isPublished: form.isPublished ?? false,
      categoryIds: form.categoryIds ?? [],
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const normalized = normalizeForm(form);
      const parsed = eventSchema.safeParse(normalized);
      if (!parsed.success) {
        setError("Datos inválidos: " + parsed.error.issues.map(i => i.message).join(", "));
        setSaving(false);
        return;
      }
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
      if (!res.ok) throw new Error("Error al guardar cambios");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!event) return <ErrorMessage message="Evento no encontrado" />;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detalle y Edición del Evento</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input name="title" value={form.title || ""} onChange={handleChange} required minLength={3} />
        </div>
        <div>
          <Label htmlFor="description">Descripción</Label>
          <Input name="description" value={form.description || ""} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="date">Fecha</Label>
          <Input name="date" type="datetime-local" value={form.date ? new Date(form.date).toISOString().slice(0, 16) : ""} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="location">Ubicación</Label>
          <Input name="location" value={form.location || ""} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="image">Imagen (URL)</Label>
          <Input name="image" value={form.image || ""} onChange={handleChange} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="isPublished" checked={!!form.isPublished} onChange={handleChange} id="isPublished" />
          <Label htmlFor="isPublished">Publicado</Label>
        </div>
        {/* TODO: Select de categorías si es necesario */}
        <Button type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar Cambios"}</Button>
      </form>
      {/* Formulario de subida de resultados */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Subir Resultado Manual</h2>
        <ResultForm eventId={eventId} />
      </div>
    </div>
  );
}
