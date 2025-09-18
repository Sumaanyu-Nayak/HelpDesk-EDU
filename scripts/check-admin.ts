import { config } from 'dotenv';
import { join } from 'path';
import connectDB from '../lib/mongodb';
import Admin from '../models/Admin';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

async function checkAdmin() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    // Find all admin users
    const admins = await (Admin as any).find({});
    
    if (admins.length === 0) {
      console.log('❌ No admin users found in the database.');
      console.log('💡 Run "npm run seed-admin" to create an admin user.');
      process.exit(1);
    }

    console.log('✅ Admin users found in database:');
    console.log('==========================================');
    
    admins.forEach((admin: any, index: number) => {
      console.log(`Admin ${index + 1}:`);
      console.log('  Username:', admin.username);
      console.log('  Email:', admin.email);
      console.log('  Role:', admin.role);
      console.log('  Total Services:', admin.serviceIds.length);
      console.log('  Created:', admin.createdAt.toLocaleDateString());
      console.log('  Last Updated:', admin.updatedAt.toLocaleDateString());
      console.log('  Services Access:', admin.serviceIds.join(', '));
      console.log('------------------------------------------');
    });
    
    console.log('🔗 Admin Login URL: http://localhost:3000/admin/login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking admin users:', error);
    process.exit(1);
  }
}

// Run the check function
checkAdmin();
