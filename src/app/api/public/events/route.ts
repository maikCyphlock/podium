import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { date: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      location: true,
      image: true,
      slug:true
      // Puedes agregar más campos públicos si lo deseas
    },
  });
  return NextResponse.json(events);
} 