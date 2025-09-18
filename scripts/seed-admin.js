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
        'food_court', 'oac', 'juice_shop', 'thapa_grocery_shop', 'ice_cream_parlour',
        'stationary_shop', 'acad_xerox', 'pizza_shop', 'barber', 'boys_gym', 'girls_gym',
        'laundry', 'prithivi_mess', 'thapa_mess', 'kanika_mess', 'visveshwariya_hostel',
        'sarabhai_hostel', 'gurbir_singh_hostel', 'homi_bhaba_hostel', 'dorm_hostel',
        'sn_bose_hostel', 'kalpana_chawla_hostel', 'cricket_ground', 'football_ground',
        'badminton_court', 'tennis_court', 'squash_court', 'basketball_court', 'volley_ball_court'
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
