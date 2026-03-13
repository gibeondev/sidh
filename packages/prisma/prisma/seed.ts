import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123!';

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`Admin user with email ${adminEmail} already exists`);
  } else {
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
      },
    });
    console.log(`Created admin user: ${admin.email} (ID: ${admin.id})`);
  }

  // System user for pre-registration visa uploads (no login)
  const systemEmail = 'pre-register-upload@system.local';
  const existingSystem = await prisma.user.findUnique({
    where: { email: systemEmail },
  });
  if (!existingSystem) {
    const systemUser = await prisma.user.create({
      data: {
        email: systemEmail,
        passwordHash,
        role: 'PARENT',
      },
    });
    console.log(`Created system user for pre-register uploads: ${systemUser.email} (ID: ${systemUser.id})`);
  } else {
    console.log(`System user ${systemEmail} already exists`);
  }

  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
