import { config } from 'dotenv';
import connectDB from '../lib/mongodb';
import Admin from '../models/Admin';

// Load environment variables
config({ path: '.env.local' });

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
        'laundry service',
        'thapa mess',
        'abc mess',
        'gym service',
        'barber',
        'girls mess',
        'girls gym',
        'food court',
        'open air cafeteria',
        'stationary',
        'juice shop',
        'general store',
        'pizza shop',
        'abdul kalam hostel',
        'vishveshwaria hostel',
        'gurbir hostel',
        'kalpana chawla hostel',
        'mess side hostel',
        'library',
        'nand hostel',
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
