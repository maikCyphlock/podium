import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { eventSchema } from '@/lib/validations/schemas';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    // Si el usuario está autenticado, filtramos por sus eventos.
    // De lo contrario, mostramos los eventos públicos.
    const whereClause: Prisma.EventWhereInput = session?.user?.id
      ? {
          userId: session.user.id,
          OR: [
            { title: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
            { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          ],
        }
      : {
          isPublished: true,
          OR: [
            { title: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
            { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          ],
        };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          categories: true,
          _count: { // Incluimos el conteo de participantes
            select: { participants: true },
          },
        },
        orderBy: {
          date: 'desc', // Mostramos los más recientes primero para el dashboard
        },
        skip,
        take: limit,
      }),
      prisma.event.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      data: events,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    },{
      headers:{
         "Content-Type": "application/json",
        "Cache-Control": "public, max-age=10, stale-while-revalidate=10"
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Error al obtener los eventos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = eventSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
          details: validation.error.issues 
        },
        { status: 400 }
      );
    }

    const { categoryIds, ...eventData } = validation.data;

    const event = await prisma.event.create({
      data: {
        ...eventData,
        date: new Date(eventData.date),
        userId: session.user.id,
        categories: categoryIds && categoryIds.length > 0 ? {
          connect: categoryIds.map(id => ({ id }))
        } : undefined,
      },
      include: {
        categories: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Error al crear el evento' },
      { status: 500 }
    );
  }
}
