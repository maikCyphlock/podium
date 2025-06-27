import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { resultSchema } from '@/lib/validations/schemas';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const eventId = params.id;
    const body = await request.json();
    const validation = resultSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Datos inválidos', details: validation.error.issues }, { status: 400 });
    }
    // Verificar que la carrera, categoría y participante pertenecen al evento
    const [race, category, participant] = await Promise.all([
      prisma.race.findUnique({ where: { id: validation.data.raceId, eventId } }),
      prisma.category.findUnique({ where: { id: validation.data.categoryId } }),
      prisma.participant.findUnique({ where: { id: validation.data.participantId, eventId } }),
    ]);
    if (!race || !category || !participant) {
      return NextResponse.json({ error: 'Carrera, categoría o participante inválido' }, { status: 400 });
    }
    const result = await prisma.result.create({
      data: {
        ...validation.data,
        eventId,
      },
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error al guardar resultado:', error);
    return NextResponse.json({ error: 'Error al guardar el resultado' }, { status: 500 });
  }
} 