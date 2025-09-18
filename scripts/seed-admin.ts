import { config } from 'dotenv';
import { join } from 'path';
import connectDB from '../lib/mongodb';
import Admin from '../models/Admin';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

async function seedAdmin() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await (Admin as any).findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('Username: admin');
      console.log('Password: admin123');
      console.log('Email:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    console.log('Creating admin user...');
    const admin = await (Admin as any).create({
      username: 'admin',
      email: 'admin@helpdesk-edu.com',
      password: 'admin123', // This will be hashed automatically
      role: 'super_admin',
      serviceIds: [
        // Shops
        'food_court',
        'oac',
        'juice_shop',
        'thapa_grocery_shop',
        'ice_cream_parlour',
        'stationary_shop',
        'acad_xerox',
        'pizza_shop',
        // College Services
        'barber',
        'boys_gym',
        'girls_gym',
        'laundry',
        // Mess
        'prithivi_mess',
        'thapa_mess',
        'kanika_mess',
        // Hostel
        'visveshwariya_hostel',
        'sarabhai_hostel',
        'gurbir_singh_hostel',
        'homi_bhaba_hostel',
        'dorm_hostel',
        'sn_bose_hostel',
        'kalpana_chawla_hostel',
        // Sports
        'cricket_ground',
        'football_ground',
        'badminton_court',
        'tennis_court',
        'squash_court',
        'basketball_court',
        'volley_ball_court',
      ],
    });

    console.log('✅ Admin user created successfully!');
    console.log('==========================================');
    console.log('Admin Login Credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('==========================================');
    console.log('You can now login at: http://localhost:3000/admin/login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedAdmin();
