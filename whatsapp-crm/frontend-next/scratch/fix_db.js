const { createClient } = require('@libsql/client');

async function fix() {
  const client = createClient({
    url: 'file:./prisma/dev.db',
  });

  const hash = '$2b$10$OVuQPViuRZGZYLw8Ghv.feFA81tDPCQY/iKAXi69xuZl0b41sbole';
  
  await client.execute({
    sql: 'UPDATE User SET password = ? WHERE id = 1',
    args: [hash]
  });

  await client.execute({
    sql: 'UPDATE User SET password = ? WHERE id = 2',
    args: [hash]
  });

  console.log('Database updated successfully with correct hashes');
}

fix().catch(console.error);
