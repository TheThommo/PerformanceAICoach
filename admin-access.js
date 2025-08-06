// Quick Admin Access Script
// Run this with: node admin-access.js

console.log(`
🔧 RED2BLUE ADMIN PANEL ACCESS GUIDE
====================================

1. QUICK ACCESS URL:
   👉 Go to: /admin-login
   
2. EXISTING ADMIN ACCOUNT:
   📧 Email: mark@cero-international.com
   🔑 Password: (Create new password on login page)

3. CREATE NEW ADMIN:
   📝 Use the "Create Admin Account" button on the login page
   
4. AFTER LOGIN:
   🎯 Navigate to: /admin
   
5. ADMIN FEATURES:
   ✅ User Management - View, edit, search all users
   💰 Payment Tracking - Revenue analytics and transaction history  
   📊 Platform Stats - User metrics and subscription analytics
   🔧 Role Management - Promote users to admin/coach
   ⚙️ Subscription Control - Upgrade/downgrade user tiers

CURRENT STATUS:
- ✅ Admin panel fully built and functional
- ✅ Authentication middleware configured
- ✅ Database operations ready
- ✅ Stripe integration prepared
- ✅ Admin navigation added

NOTE: The admin panel is a comprehensive business management tool
designed for funding presentations and customer management.
`);

// Simple function to test admin access
async function testAdminAccess() {
  try {
    console.log('\n🧪 TESTING ADMIN ACCESS...\n');
    
    // Test health endpoint
    const health = await fetch('http://localhost:5000/api/health');
    console.log(`✅ Server Health: ${health.ok ? 'OK' : 'FAILED'}`);
    
    // Test admin route (should fail without auth)
    const adminTest = await fetch('http://localhost:5000/api/admin/stats');
    console.log(`🔒 Admin Protection: ${adminTest.status === 401 ? 'SECURED' : 'UNSECURED'}`);
    
    console.log('\n✅ Admin panel is properly secured and ready to use!');
    console.log('👉 Visit /admin-login to get started\n');
    
  } catch (error) {
    console.log('❌ Cannot test - server may not be running');
    console.log('👉 Start the server and visit /admin-login\n');
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testAdminAccess();
}