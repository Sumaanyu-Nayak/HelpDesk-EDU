import { config } from 'dotenv';
import { join } from 'path';
import connectDB from '../lib/mongodb';
import Admin from '../models/Admin';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

async function updateAdmin() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    // Find the existing admin
    const existingAdmin = await (Admin as any).findOne({ username: 'admin' });
    
    if (!existingAdmin) {
      console.log('❌ No admin user found. Run npm run seed-admin first.');
      process.exit(1);
    }

    console.log('Updating admin user with latest service IDs...');
    
    // Update admin with new service IDs
    const updatedAdmin = await (Admin as any).findByIdAndUpdate(
      existingAdmin._id,
      {
        $set: {
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
          role: 'super_admin',
        },
      },
      { new: true }
    );

    console.log('✅ Admin user updated successfully!');
    console.log('==========================================');
    console.log('Updated Admin Details:');
    console.log('Username:', updatedAdmin.username);
    console.log('Email:', updatedAdmin.email);
    console.log('Role:', updatedAdmin.role);
    console.log('Total Services:', updatedAdmin.serviceIds.length);
    console.log('Services:', updatedAdmin.serviceIds.join(', '));
    console.log('==========================================');
    console.log('You can now login at: http://localhost:3000/admin/login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin user:', error);
    process.exit(1);
  }
}

// Run the update function
updateAdmin();
