"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/Loading";
import * as XLSX from "xlsx";

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: string;
  country: string;
  city?: string;
  phone?: string;
  createdAt: string;
}

export default function EventParticipantsTable({ eventId }: { eventId: string }) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/events/${eventId}/participants`)
      .then(res => res.json())
      .then(data => setParticipants(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [eventId]);

  const filtered = participants.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(filter.toLowerCase()) ||
    p.email.toLowerCase().includes(filter.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function exportToExcel() {
    const dataToExport = filtered.map(p => ({
      Nombre: `${p.firstName} ${p.lastName}`,
      Email: p.email,
      "Fecha de nacimiento": p.birthDate ? new Date(p.birthDate).toLocaleDateString('es-VE') : "-",
      Género: p.gender === 'MALE' ? 'Masculino' : p.gender === 'FEMALE' ? 'Femenino' : 'Otro',
      País: p.country,
      Ciudad: p.city || '-',
      Teléfono: p.phone || '-',
      "Fecha de registro": p.createdAt ? new Date(p.createdAt).toLocaleString('es-VE') : "-",
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participantes");
    XLSX.writeFile(wb, `participantes_evento_${eventId}.xlsx`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-lg font-bold">Participantes registrados</h2>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Buscar por nombre o email..."
            value={filter}
            onChange={e => { setFilter(e.target.value); setPage(1); }}
            className="max-w-xs"
          />
          <Button variant="outline" onClick={exportToExcel} disabled={filtered.length === 0}>
            Exportar a Excel
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-8"><Loading /></div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Fecha de nacimiento</TableHead>
              <TableHead>Género</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Fecha de registro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">No hay participantes.</TableCell>
              </TableRow>
            ) : paginated.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.firstName} {p.lastName}</TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>{p.birthDate ? new Date(p.birthDate).toLocaleDateString('es-VE') : "-"}</TableCell>
                <TableCell>{p.gender === 'MALE' ? 'Masculino' : p.gender === 'FEMALE' ? 'Femenino' : 'Otro'}</TableCell>
                <TableCell>{p.country}</TableCell>
                <TableCell>{p.city || '-'}</TableCell>
                <TableCell>{p.phone || '-'}</TableCell>
                <TableCell>{p.createdAt ? new Date(p.createdAt).toLocaleString('es-VE') : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >Anterior</Button>
        <span>Página {page} de {totalPages || 1}</span>
        <Button
          variant="outline"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
        >Siguiente</Button>
      </div>
    </div>
  );
} 