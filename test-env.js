// Test environment variables
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET')
console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET')
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET')

if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('Service Role Key starts with:', process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10))
}