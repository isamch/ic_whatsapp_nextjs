const { drizzle } = require('drizzle-orm/libsql')
const { createClient } = require('@libsql/client')
const path = require('path')

const client = createClient({
  url: `file:${path.join(process.cwd(), "prisma", "dev.db")}`
})
const db = drizzle(client)

async function main() {
  console.log('Starting DB cleanup with Drizzle (preserving Users)...')

  try {
    // Delete in order
    await client.execute('DELETE FROM CampaignLog')
    console.log('✓ Cleared CampaignLog')

    await client.execute('DELETE FROM Campaign')
    console.log('✓ Cleared Campaign')

    await client.execute('DELETE FROM Contact')
    console.log('✓ Cleared Contact')

    await client.execute('DELETE FROM ContactList')
    console.log('✓ Cleared ContactList')

    await client.execute('DELETE FROM Category')
    console.log('✓ Cleared Category')

    await client.execute('DELETE FROM WhatsAppContact')
    console.log('✓ Cleared WhatsAppContact')

    await client.execute('DELETE FROM Template')
    console.log('✓ Cleared Template')

    await client.execute('DELETE FROM WhatsappSession')
    console.log('✓ Cleared WhatsappSession')

    await client.execute('DELETE FROM Notification')
    console.log('✓ Cleared Notification')

    await client.execute('DELETE FROM RefreshToken')
    console.log('✓ Cleared RefreshToken')

    console.log('\n✨ Database is now fresh! (Users preserved)')
  } catch (err) {
    console.error('Cleanup failed:', err.message)
  } finally {
    client.close()
  }
}

main()
