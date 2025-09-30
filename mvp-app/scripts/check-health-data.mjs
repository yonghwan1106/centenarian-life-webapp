// Check health_data table structure and data
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gqxpabnsdpnrztzpdudi.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxeHBhYm5zZHBucnp0enBkdWRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkwODM0MCwiZXhwIjoyMDY2NDg0MzQwfQ.qcAUmET41RdLkzt9xS1-fxJm3l1GEfpTTgCPgHFFycQ'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkHealthData() {
  console.log('🔍 Checking health_data table...\n')

  try {
    // Test 1: Check if table exists and is accessible
    console.log('1️⃣ Testing table access...')
    const { data: tableTest, error: tableError } = await supabase
      .from('health_data')
      .select('id')
      .limit(1)

    if (tableError) {
      console.error('❌ Error accessing health_data table:', tableError.message)
      return
    }
    console.log('✅ health_data table exists and is accessible\n')

    // Test 2: Count all records
    console.log('2️⃣ Counting all health records...')
    const { count, error: countError } = await supabase
      .from('health_data')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('❌ Error counting records:', countError.message)
    } else {
      console.log(`📊 Total health records: ${count}\n`)
    }

    // Test 3: Get latest 5 records
    console.log('3️⃣ Fetching latest 5 health records...')
    const { data: latestRecords, error: latestError } = await supabase
      .from('health_data')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(5)

    if (latestError) {
      console.error('❌ Error fetching records:', latestError.message)
    } else if (latestRecords && latestRecords.length > 0) {
      console.log(`✅ Found ${latestRecords.length} records:`)
      latestRecords.forEach((record, index) => {
        console.log(`\n  Record ${index + 1}:`)
        console.log(`    User ID: ${record.user_id}`)
        console.log(`    Heart Rate: ${record.heart_rate || 'N/A'}`)
        console.log(`    Weight: ${record.weight || 'N/A'}`)
        console.log(`    Recorded: ${record.recorded_at}`)
      })
    } else {
      console.log('⚠️  No health records found in database\n')
    }

    // Test 4: Check for specific user
    console.log('\n4️⃣ Checking for user b7e8428d-23bc-4960-8c44-2a887a2e35db...')
    const { data: userRecords, error: userError } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', 'b7e8428d-23bc-4960-8c44-2a887a2e35db')
      .order('recorded_at', { ascending: false })

    if (userError) {
      console.error('❌ Error:', userError.message)
    } else {
      console.log(`✅ Found ${userRecords?.length || 0} records for this user`)
      if (userRecords && userRecords.length > 0) {
        console.log('\n  Latest record:')
        const latest = userRecords[0]
        console.log(`    Heart Rate: ${latest.heart_rate || 'N/A'}`)
        console.log(`    Weight: ${latest.weight || 'N/A'}`)
        console.log(`    Blood Pressure: ${latest.blood_pressure_systolic || 'N/A'}/${latest.blood_pressure_diastolic || 'N/A'}`)
        console.log(`    Steps: ${latest.steps || 'N/A'}`)
        console.log(`    Sleep: ${latest.sleep_hours || 'N/A'}`)
        console.log(`    Mood: ${latest.mood_rating || 'N/A'}`)
        console.log(`    Recorded: ${latest.recorded_at}`)
      }
    }

    console.log('\n✅ Check complete!\n')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkHealthData()