const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestUser() {
  const email = 'testuser999@gmail.com';
  const password = 'test999pass';

  console.log('Creating test user...');

  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: {
      full_name: '테스트유저999'
    }
  });

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } else {
    console.log('✅ User created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('🆔 User ID:', data.user.id);
    console.log('\n💡 You can now login with these credentials!');
  }
}

createTestUser();
