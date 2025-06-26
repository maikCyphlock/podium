import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { eventSchema } from '@/lib/validations/schemas';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        categories: true,
        _count: { select: { participants: true } },
      },
    });
    if (!event) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener el evento' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const body = await request.json();
    const validation = eventSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Datos inválidos', details: validation.error.issues }, { status: 400 });
    }
    const { categoryIds, ...eventData } = validation.data;
    const updatedEvent = await prisma.event.update({
      where: { id: params.id, userId: session.user.id },
      data: {
        ...eventData,
        date: new Date(eventData.date),
        categories: categoryIds && categoryIds.length > 0 ? {
          set: categoryIds.map((id: string) => ({ id }))
        } : undefined,
      },
      include: {
        categories: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar el evento' }, { status: 500 });
  }
} 