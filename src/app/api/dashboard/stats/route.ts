import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import db from '@/lib/db/prisma';

export async function GET() {
  const session = await getCurrentUser();
  
  if (!session?.id) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const userId = session.id;

  try {
    const activeEvents = await db.event.count({
      where: {
        userId,
        date: { gte: new Date() },
      },
    });

    const totalParticipants = await db.participant.count({
      where: {
        event: {
          userId,
        },
      },
    });

    const nextEvent = await db.event.findFirst({
      where: {
        userId,
        date: { gte: new Date() },
      },
      orderBy: {
        date: 'asc',
      },
      select: {
        date: true,
      },
    });

    // Placeholder for total revenue
    const totalRevenue = 0;

    return NextResponse.json({
      activeEvents,
      totalParticipants,
      nextEvent: nextEvent ? { date: nextEvent.date.toISOString().split('T')[0] } : null,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'An error occurred while fetching stats.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
