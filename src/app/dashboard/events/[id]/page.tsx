"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EventParticipantsTable from "@/components/dashboard/EventParticipantsTable";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

import { eventSchema, type EventInput } from "@/lib/validations/schemas";
import { Loading } from "@/components/ui/Loading";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { slugify } from "@/lib/utils/slugify";

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;
  const [event, setEvent] = useState<EventInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<EventInput & { slug?: string; status?: string }>>({});
  const [titleError, setTitleError] = useState<string | null>(null);

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
          categoryIds: data.categories?.map((c: { id: string }) => c.id) || [],
          slug: data.slug,
          status: data.status,
        });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }
    if (eventId) fetchEvent();
  }, [eventId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target;
    const { name, value, type } = target;
    const updated = {
      ...form,
      [name]: type === "checkbox" && target instanceof HTMLInputElement ? target.checked : value,
    };
    if (name === "title") {
      updated.slug = slugify(value);
    }
    setForm(updated);
    if (name === "title") {
      if (value.length < 3) {
        setTitleError("El título debe tener al menos 3 caracteres");
      } else {
        setTitleError(null);
      }
    }
  }

  function normalizeForm(form: Partial<EventInput & { slug?: string; status?: string }>): EventInput {
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
      slug: form.slug ?? "",
      status: form.status ?? "ACTIVO",
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
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error desconocido';
      setError(msg);
      toast.error("Error al guardar", { description: msg });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!event) return <ErrorMessage message="Evento no encontrado" />;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="edit">Editar evento</TabsTrigger>
          <TabsTrigger value="participants">Registrados</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <h1 className="text-2xl font-bold mb-4">Detalle y Edición del Evento</h1>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                name="title"
                value={form.title || ""}
                onChange={handleChange}
                required
                minLength={3}
                placeholder="Ejemplo: Carrera 10K Caracas"
                className={titleError ? "border-red-500" : ""}
              />
              <span className="text-xs text-gray-500">El nombre del evento debe ser claro y conciso.</span>
              {titleError && <span className="text-xs text-red-500 block mt-1">{titleError}</span>}
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                placeholder="Describe brevemente el evento (opcional)"
              />
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
                      placeholder="Hora de inicio"
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <span className="text-xs text-gray-500">Selecciona la fecha y hora exacta del evento.</span>
            </div>
            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input
                name="location"
                value={form.location || ""}
                onChange={handleChange}
                placeholder="Ejemplo: Parque del Este, Caracas"
              />
              <span className="text-xs text-gray-500">Indica el lugar donde se realizará el evento.</span>
            </div>
            <div>
              <Label htmlFor="image">Imagen (URL)</Label>
              <Input
                name="image"
                value={form.image || ""}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <span className="text-xs text-gray-500">Agrega una imagen representativa (opcional).</span>
            </div>
            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                name="slug"
                value={form.slug || ""}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
              <span className="text-xs text-gray-500">El identificador único para la URL del evento se genera automáticamente.</span>
            </div>
            <div>
              <Label htmlFor="status">Estado del evento</Label>
              <Select
                value={form.status || "ACTIVO"}
                onValueChange={value => setForm(prev => ({ ...prev, status: value as "ACTIVO" | "FINALIZADO" | "CANCELADO" | "POSTERGADO" }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVO">Activo</SelectItem>
                  <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                  <SelectItem value="POSTERGADO">Postergado</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-gray-500">Selecciona el estado actual del evento.</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="isPublished" checked={!!form.isPublished} onChange={handleChange} id="isPublished" />
              <Label htmlFor="isPublished">Publicado</Label>
            </div>
            <Button type="submit" disabled={saving || !!titleError} className="w-full">
              {saving ? (
                <span className="flex items-center gap-2"> Guardando...</span>
              ) : "Guardar Cambios"}
            </Button>
            {error && <ErrorMessage message={error} />}
          </form>
          <div className="mt-10 border-t pt-8">
            {/*
            <h2 className="text-xl font-semibold mb-2">Subir Resultado Manual</h2>
            <ResultForm eventId={eventId} />
            */}
          </div>
        </TabsContent>
        <TabsContent value="participants">
          <EventParticipantsTable eventId={eventId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
