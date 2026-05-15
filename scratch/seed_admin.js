const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load .env
dotenv.config({ path: path.join(__dirname, '../.env') });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function seed() {
  console.log('Seeding admin user...');
  const email = 'admin@icwhatsapp.com';
  const password = '@#isamadmin2003';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Correct way for Neon serverless tagged template
    await sql`
      INSERT INTO "User" (name, email, password, role, "isActive", "createdAt", "updatedAt")
      VALUES ('Admin', ${email}, ${hashedPassword}, 'admin', true, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `;

    console.log('Admin user created successfully in Neon!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed admin:', err);
    process.exit(1);
  }
}

seed();
