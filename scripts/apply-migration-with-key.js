const fs = require('fs')
const path = require('path')

// Read environment variables from .env.local
const envPath = path.join(__dirname, '../.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim()
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL must be set in .env.local')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.error('\n⚠️  SUPABASE_SERVICE_ROLE_KEY is not set in .env.local')
  console.error('\nTo get the service role key:')
  console.error('1. Go to: https://supabase.com/dashboard/project/azlcuxgourruwoxptwbr')
  console.error('2. Click "Settings" > "API"')
  console.error('3. Copy the "service_role" key (NOT the anon key)')
  console.error('4. Add it to .env.local as: SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
  console.error('\nAlternatively, you can run the SQL manually in Supabase Dashboard SQL Editor.')
  process.exit(1)
}

async function applyMigration() {
  try {
    const sqlFile = path.join(__dirname, '../database/apply_migration.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')
    
    console.log('📄 Reading SQL file:', sqlFile)
    console.log('🚀 Applying migration using Supabase Management API...\n')
    
    // Extract project ref from URL
    const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '')
    
    // Use Supabase Management API
    // Note: This requires a Management API access token, not service role key
    // For DDL operations, we need to use the SQL Editor or Management API
    
    console.log('⚠️  Supabase JS client does not support direct DDL execution.')
    console.log('Using alternative method...\n')
    
    // Try using pg_net extension if available
    // Or use the REST API with a custom function
    
    console.log('📋 SQL to execute:')
    console.log('='.repeat(80))
    console.log(sql)
    console.log('='.repeat(80))
    console.log('\n💡 To execute this SQL automatically, you need:')
    console.log('   1. Supabase Management API access token, OR')
    console.log('   2. Run it manually in Supabase Dashboard SQL Editor\n')
    console.log('📝 Manual execution steps:')
    console.log('   1. Go to: https://supabase.com/dashboard/project/azlcuxgourruwoxptwbr')
    console.log('   2. Click "SQL Editor" in the left menu')
    console.log('   3. Click "New query"')
    console.log('   4. Copy and paste the SQL above')
    console.log('   5. Click "Run" (or press Ctrl+Enter)\n')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

applyMigration()

