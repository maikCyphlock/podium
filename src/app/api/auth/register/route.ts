import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { hash } from 'bcryptjs';
import { registerSchema } from '@/lib/validations/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = registerSchema.parse(body);

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El correo electrónico ya está en uso' },
        { status: 400 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await hash(password, 12);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    // No devolver la contraseña en la respuesta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        user: userWithoutPassword,
        message: 'Usuario registrado exitosamente' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en el registro:', error);
    return NextResponse.json(
      { error: 'Error al procesar el registro' },
      { status: 500 }
    );
  }
}
