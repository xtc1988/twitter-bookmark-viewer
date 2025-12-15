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

const { createClient } = require('@supabase/supabase-js')

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function applyMigration() {
  try {
    const sqlFile = path.join(__dirname, '../database/apply_migration.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')
    
    console.log('📄 Reading SQL file:', sqlFile)
    console.log('🚀 Applying migration...\n')
    
    // Use Supabase Management API to execute SQL
    // Management API endpoint: https://api.supabase.com/v1/projects/{project_ref}/database/query
    const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '')
    const managementApiUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`
    
    console.log('📡 Connecting to Supabase Management API...')
    
    // Note: Management API requires a different access token
    // For now, we'll show the SQL and instructions
    console.log('\n⚠️  Direct SQL execution requires Supabase Management API access token.')
    console.log('Please run the SQL manually in Supabase Dashboard.\n')
    console.log('SQL to execute:')
    console.log('='.repeat(80))
    console.log(sql)
    console.log('='.repeat(80))
    console.log('\n📋 Steps:')
    console.log('1. Go to: https://supabase.com/dashboard/project/azlcuxgourruwoxptwbr')
    console.log('2. Click "SQL Editor" in the left menu')
    console.log('3. Click "New query"')
    console.log('4. Copy and paste the SQL above')
    console.log('5. Click "Run" (or press Ctrl+Enter)\n')
    console.log('✅ After running the SQL, the migration will be complete!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.log('\n⚠️  Please run the SQL manually in Supabase Dashboard.')
    console.log('SQL file location: database/apply_migration.sql\n')
    process.exit(1)
  }
}

applyMigration()

