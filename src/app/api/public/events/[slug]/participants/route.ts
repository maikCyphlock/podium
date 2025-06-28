import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const email = searchParams.get('email');
  if (!id && !email) {
    return NextResponse.json({ error: 'Email o id requerido' }, { status: 400 });
  }
  const event = await prisma.event.findFirst({ where: { slug: params.slug, isPublished: true } });
  if (!event) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
  }
  let participant = null;
  if (id) {
    participant = await prisma.participant.findMany({
      where: { createdBy: id, eventId: event.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        birthDate: true,
        gender: true,
        country: true,
        city: true,
        phone: true,
        emergencyContact: true,
        bloodType: true,
        createdAt: true,
      },
    });
  } else if (email) {
    participant = await prisma.participant.findFirst({
      where: { email, eventId: event.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        birthDate: true,
        gender: true,
        country: true,
        city: true,
        phone: true,
        emergencyContact: true,
        bloodType: true,
        createdAt: true,
      },
    });
  }
  if (!participant) {
    return NextResponse.json({ success: false });
  }
  return NextResponse.json({ success: true, participant },{
    headers:{
       "Content-Type": "application/json",
        "Cache-Control": "public, max-age=10, stale-while-revalidate=10"
    }
  });
} 