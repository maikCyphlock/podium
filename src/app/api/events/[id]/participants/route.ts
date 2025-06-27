import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { participantSchema } from '@/lib/validations/schemas';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const eventId = params.id;
    const body = await request.json();
    const validation = participantSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Datos inválidos', details: validation.error.issues }, { status: 400 });
    }
    const participant = await prisma.participant.create({
      data: {
        ...validation.data,
        eventId,
      },
    });
    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    console.error('Error al crear participante:', error);
    return NextResponse.json({ error: 'Error al crear el participante' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id;
    const participants = await prisma.participant.findMany({ where: { eventId } });
    return NextResponse.json(participants);
  } catch (error) {
    console.error('Error al obtener participantes:', error);
    return NextResponse.json({ error: 'Error al obtener los participantes' }, { status: 500 });
  }
} 