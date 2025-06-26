import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authOptions } from '@/lib/auth/options';
import { profileSchema } from '@/lib/validations/schemas';

// Helper function to create a JSON response with CORS headers
const jsonResponse = (data: any, status: number = 200) => {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

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
      return jsonResponse(
        { error: 'No autorizado' },
        401
      );
    }

    const body = await request.json();
    const profileData = profileSchema.parse(body);
    
    // Extract only the fields that belong to the Profile model
    const { acceptTerms, ...profileFields } = profileData;
    
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

    return jsonResponse({
      user: updatedUser,
      message: 'Perfil actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        return jsonResponse(
          { error: 'Datos de perfil inválidos', details: JSON.parse(error.message) },
          400
        );
      }
    }
    
    return jsonResponse(
      { error: 'Error al actualizar el perfil' },
      500
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return jsonResponse(
        { error: 'No autorizado' },
        401
      );
    }

    // Obtener el perfil del usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
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
      return jsonResponse(
        { error: 'Usuario no encontrado' },
        404
      );
    }

    return jsonResponse({ user });
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    return jsonResponse(
      { error: 'Error al obtener el perfil' },
      500
    );
  }
}
