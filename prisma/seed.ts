import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Crear roles si no existen
  console.log('🔧 Creating default roles...');
  
  // Crear usuario administrador
  console.log('👤 Creating admin user...');
  const adminEmail = 'admin@podium.com';
  const adminPassword = await hash('admin123', 12);
  
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  // Crear categorías de ejemplo
  console.log('🏷️ Creating example categories...');
  const categories = [
    { id: uuidv4(), name: '5K', description: 'Carrera de 5 kilómetros' },
    { id: uuidv4(), name: '10K', description: 'Carrera de 10 kilómetros' },
    { id: uuidv4(), name: '21K', description: 'Media maratón (21.1K)' },
    { id: uuidv4(), name: '42K', description: 'Maratón (42.2K)' },
    { id: uuidv4(), name: 'Infantil', description: 'Categoría para niños' },
    { id: uuidv4(), name: 'Juvenil', description: 'Categoría para jóvenes' },
    { id: uuidv4(), name: 'Elite', description: 'Categoría de élite' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
