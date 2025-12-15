const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL must be set in .env.local')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY must be set in .env.local')
  console.error('You can find the service role key in Supabase Dashboard > Settings > API')
  console.error('Add it to .env.local as: SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
  process.exit(1)
}

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runSQL() {
  try {
    const sqlFile = path.join(__dirname, '../database/apply_migration.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')
    
    console.log('Reading SQL file...')
    console.log('File:', sqlFile)
    
    // Use Supabase's REST API to execute SQL via pg_net extension
    // Or use the management API
    
    // Alternative: Use direct PostgreSQL connection
    // For now, we'll use the Supabase client's query builder where possible
    // But for DDL operations, we need to use the SQL editor or management API
    
    console.log('\n⚠️  Direct SQL execution via Supabase client is limited.')
    console.log('Please run the SQL manually in Supabase Dashboard:')
    console.log('1. Go to: https://supabase.com/dashboard/project/azlcuxgourruwoxptwbr')
    console.log('2. Click "SQL Editor"')
    console.log('3. Copy and paste the contents of: database/apply_migration.sql')
    console.log('4. Click "Run"\n')
    
    console.log('SQL to execute:')
    console.log('='.repeat(80))
    console.log(sql)
    console.log('='.repeat(80))
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

runSQL()

