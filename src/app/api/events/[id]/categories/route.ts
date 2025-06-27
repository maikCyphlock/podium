import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { categorySchema } from '@/lib/validations/schemas';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const eventId = params.id;
    const body = await request.json();
    const validation = categorySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Datos inválidos', details: validation.error.issues }, { status: 400 });
    }
    const category = await prisma.category.create({
      data: {
        ...validation.data,
        events: { connect: { id: eventId } },
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    return NextResponse.json({ error: 'Error al crear la categoría' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id;
    const categories = await prisma.category.findMany({
      where: {
        events: {
          some: { id: eventId },
        },
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return NextResponse.json({ error: 'Error al obtener las categorías' }, { status: 500 });
  }
} 