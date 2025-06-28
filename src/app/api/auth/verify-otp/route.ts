import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email y código son requeridos' }, { status: 400 });
    }

    // Buscar el token válido
    const verification = await prisma.verificationToken.findFirst({
      where: {
        identifier: email.toLowerCase(),
        token: otp,
        expires: { gte: new Date() },
      },
    });

    if (!verification) {
      return NextResponse.json({ error: 'Código inválido o expirado' }, { status: 400 });
    }

    // Marcar el email como verificado
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { emailVerified: new Date() },
    });

    // Eliminar el token usado
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email.toLowerCase(),
          token: otp,
        },
      },
    });

    return NextResponse.json({ success: true, message: 'Correo verificado correctamente' });
  } catch (error) {
    console.error('Error al verificar OTP:', error);
    return NextResponse.json({ error: 'Error al verificar el código' }, { status: 500 });
  }
} 