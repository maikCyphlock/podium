import Link from 'next/link';
import EventsListClient from '../../components/public/EventsListClient';

export default async function EventsPage() {
  async function getEvents() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/public/events`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  }
  const events = await getEvents();

  return (
    <EventsListClient events={events} />
  );
} 