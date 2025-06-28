import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { participantSchema } from '@/lib/validations/schemas';
import { getToken } from 'next-auth/jwt';

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const token = await getToken({ req: request });
    const userId = token?.id;
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json({ error: 'Slug requerido' }, { status: 400 });
    }
    const event = await prisma.event.findFirst({ where: { slug, isPublished: true } });
    if (!event) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }
    const body = await request.json();
    const data = participantSchema.parse(body);
    // Verificar si ya existe un participante con ese email en el evento
    const exists = await prisma.participant.findFirst({
      where: { email: data.email, eventId: event.id },
    });
    if (exists) {
      return NextResponse.json({ error: 'Ya estás inscrito en este evento.' }, { status: 400 });
    }
    // Limitar a 5 inscripciones por usuario autenticado
    if (userId) {
      const count = await prisma.participant.count({ where: { createdBy: userId } });
      if (count >= 5) {
        return NextResponse.json({ error: 'Has alcanzado el límite de 5 inscripciones por cuenta.' }, { status: 400 });
      }
    }
    const participant = await prisma.participant.create({
      data: {
        ...data,
        eventId: event.id,
        createdBy: userId || null,
      },
    });
    return NextResponse.json({ success: true, participant });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al inscribirse' }, { status: 400 });
  }
} 