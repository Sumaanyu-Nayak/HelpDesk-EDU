// Run this script to create an initial admin user
// Usage: node scripts/seed-admin.js

const connectDB = require('../lib/mongodb.ts');
const Admin = require('../models/Admin.ts');

async function seedAdmin() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@helpdesk-edu.com',
      password: 'admin123', // This will be hashed automatically
      role: 'super_admin',
      serviceIds: [
        'laundry', 'thapa_mess', 'abc_mess', 'girls_mess', 'gym', 'girls_gym',
        'barber', 'food_court', 'open_air_cafeteria', 'stationary', 'juice_shop',
        'general_store', 'pizza_shop', 'abdul_kalam_hostel', 'vishveshwaria_hostel',
        'gurbir_hostel', 'kalpana_chawla_hostel', 'mess_side_hostel', 'nand_hostel',
        'library'
      ],
    });

    console.log('Admin user created successfully:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
