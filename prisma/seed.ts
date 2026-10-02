import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@marketplace.com';
  const passwordHash = await bcrypt.hash('Admin@123', 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        name: 'Platform Super Admin',
        email: adminEmail,
        phone: '+919876543210',
        passwordHash,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
      },
    });
    console.log('Seeded Super Admin user:', admin.email);
  } else {
    await prisma.user.update({
      where: { email: adminEmail },
      data: { passwordHash, status: 'ACTIVE', role: 'SUPER_ADMIN' },
    });
    console.log('Updated existing Super Admin credentials:', adminEmail);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
