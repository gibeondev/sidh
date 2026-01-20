# Prisma Package

This package contains the Prisma schema and database migrations for the SIDH application.

## Setup

1. Ensure your database is running and `DATABASE_URL` is configured in your `.env` file.

2. Run migrations:
   ```bash
   pnpm prisma:migrate
   ```

3. Generate Prisma Client:
   ```bash
   pnpm prisma:generate
   ```

## Seeding Admin User

To create an admin user for local testing, you can use the seed script:

```bash
# Using default credentials (admin@example.com / admin123456)
pnpm prisma:seed

# Or with custom credentials
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=yourpassword pnpm prisma:seed
```

Alternatively, you can manually create an admin user using Prisma Studio:

```bash
pnpm prisma:studio
```

Then create a user with:
- email: your admin email
- passwordHash: use bcrypt to hash your password (e.g., using an online bcrypt generator or Node.js)
- role: ADMIN

## Creating Password Hash Manually

If you need to create a password hash manually, you can use Node.js:

```javascript
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('yourpassword', 10);
console.log(hash);
```
