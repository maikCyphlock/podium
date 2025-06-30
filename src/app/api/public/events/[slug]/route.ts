import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  params = await params
  const slug = params.slug;

  console.log({slug})
  if (!slug) {
    return NextResponse.json({ error: 'Slug requerido' }, { status: 400 });
  }
  const event = await prisma.event.findFirst({
    where: { slug, isPublished: true, deletedAt: null },
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      location: true,
      image: true,
      slug:true
      // Agrega aquí más campos públicos si lo deseas
    },
  });
  if (!event) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
  }
  return NextResponse.json(event);
} 