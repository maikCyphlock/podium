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
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

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
        toast.error("Error al guardar", { description: "Datos inválidos: " + parsed.error.issues.map(i => i.message).join(", ") });
        return;
      }
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
      if (!res.ok) throw new Error("Error al guardar cambios");
      router.refresh();
      toast.success("¡Evento actualizado!", { description: "Los datos del evento se guardaron correctamente." });
    } catch (e: any) {
      setError(e.message);
      toast.error("Error al guardar", { description: e.message });
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
          <Label htmlFor="date">Fecha y hora</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={"w-full justify-start text-left font-normal"}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.date
                  ? format(new Date(form.date), "PPP HH:mm", { locale: es })
                  : <span>Selecciona fecha y hora</span>
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex flex-col gap-2 p-2">
                <Calendar
                  mode="single"
                  selected={form.date ? new Date(form.date) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      // Mantén la hora si ya existe, o pon 00:00
                      const prev = form.date ? new Date(form.date) : undefined;
                      const hours = prev ? prev.getHours() : 0;
                      const minutes = prev ? prev.getMinutes() : 0;
                      date.setHours(hours, minutes, 0, 0);
                      setForm((prev) => ({ ...prev, date: date.toISOString() }));
                    }
                  }}
                  captionLayout="dropdown"
                  disabled={(date) => date < new Date('1900-01-01')}
                />
                <Input
                  name="dateTime"
                  type="time"
                  value={form.date ? new Date(form.date).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false }) : ""}
                  onChange={e => {
                    const time = e.target.value;
                    if (form.date) {
                      const d = new Date(form.date);
                      const [h, m] = time.split(":");
                      d.setHours(Number(h), Number(m), 0, 0);
                      setForm(prev => ({ ...prev, date: d.toISOString() }));
                    }
                  }}
                  className="w-32 mx-auto"
                />
              </div>
            </PopoverContent>
          </Popover>
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
