import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authOptions } from '@/lib/auth/options';
import { profileSchema } from '@/lib/validations/schemas';
import { update } from '@/lib/auth/utils';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const profileData = profileSchema.parse(body);
    
    // Extract only the fields that belong to the Profile model
    const profileFields = profileData;
    
    // Actualizar el perfil del usuario
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: `${profileData.firstName} ${profileData.lastName}`.trim(),
        profile: {
          upsert: {
            create: profileFields,
            update: profileFields,
          },
        },
        onboardingCompleted: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        onboardingCompleted: true,
        profile: true,
      },
    });

    // Update the session with the new data
    const currentSession = await getServerSession(authOptions);
    if (currentSession) {
      try {
        await update({
          user: {
            ...currentSession.user,
            ...updatedUser,
            name: updatedUser.name || '',
            email: updatedUser.email || '',
            image: null,
            profile: updatedUser.profile || null,
            onboardingCompleted: true
          }
        });
      } catch (error) {
        console.error('Error updating session:', error);
        // Continue even if session update fails, as the profile was updated
      }
    }

    return NextResponse.json({
      user: updatedUser,
      message: 'Perfil actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Datos de perfil inválidos', details: JSON.parse(error.message) },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Error al actualizar el perfil' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener el perfil del usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email,deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        onboardingCompleted: true,
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    return NextResponse.json(
      { error: 'Error al obtener el perfil' },
      { status: 500 }
    );
  }
}
