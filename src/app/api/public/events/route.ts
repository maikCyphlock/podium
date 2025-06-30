import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { isPublished: true , deletedAt: null},
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
    console.info({ count: events.length }, 'Consulta de eventos públicos exitosa');
    return NextResponse.json(events);
  } catch (error) {
    console.error({ err: error }, 'Error al consultar eventos públicos');
    return NextResponse.json({ error: 'Error al obtener eventos' }, { status: 500 });
  }
} 