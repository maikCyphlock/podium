import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { raceSchema } from '@/lib/validations/schemas';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const eventId = params.id;
    const body = await request.json();
    const validation = raceSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Datos inválidos', details: validation.error.issues }, { status: 400 });
    }
    const race = await prisma.race.create({
      data: {
        ...validation.data,
        eventId,
      },
    });
    return NextResponse.json(race, { status: 201 });
  } catch (error) {
    console.error('Error al crear carrera:', error);
    return NextResponse.json({ error: 'Error al crear la carrera' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id;
    const races = await prisma.race.findMany({ where: { eventId } });
    return NextResponse.json(races);
  } catch (error) {
    console.error('Error al obtener carreras:', error);
    return NextResponse.json({ error: 'Error al obtener las carreras' }, { status: 500 });
  }
} 