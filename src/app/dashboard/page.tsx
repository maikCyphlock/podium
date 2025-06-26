'use client';

import { useEffect, useState } from 'react';
import { EventsTable } from "@/components/dashboard/EventsTable";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { StatCard } from "@/components/dashboard/StatCard";
import { CalendarIcon, Users, TrendingUp, DollarSign } from 'lucide-react';

// TODO: Define these types globally
interface DashboardStats {
  activeEvents: number;
  totalParticipants: number;
  nextEvent: { name: string; date: string } | null;
  totalRevenue: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
        // TODO: Handle error with a toast notification
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Cargando dashboard...</div>; // TODO: Replace with a proper skeleton loader
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <QuickActions />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          title="Eventos Activos"
          value={stats?.activeEvents ?? 0}
          icon={<CalendarIcon className="h-4 w-4 text-muted-foreground" />}
          description="Eventos futuros programados"
        />
        <StatCard 
          title="Participantes Totales"
          value={stats?.totalParticipants ?? 0}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="En todos los eventos"
        />
        <StatCard 
          title="Próximo Evento"
          value={stats?.nextEvent?.name ?? 'N/A'}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description={`Fecha: ${stats?.nextEvent?.date ?? '-'}`}
        />
        <StatCard 
          title="Ingresos Totales"
          value={`${stats?.totalRevenue ?? 0}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="(Próximamente)"
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Eventos Recientes</h2>
        {/* TODO: Pass real events data to EventsTable */}
        <EventsTable />
      </div>
    </div>
  );
}
