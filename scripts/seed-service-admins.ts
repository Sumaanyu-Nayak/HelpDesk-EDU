import { config } from 'dotenv';
import { join } from 'path';
import connectDB from '../lib/mongodb';
import Admin from '../models/Admin';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

async function seedServiceAdmins() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    const serviceAdmins = [
      {
        username: 'hostel_admin',
        email: 'hostel.admin@helpdesk-edu.com',
        password: 'hostel123',
        role: 'admin',
        serviceIds: [
          // Hostel services only
          'visveshwariya_hostel',
          'sarabhai_hostel',
          'gurbir_singh_hostel',
          'homi_bhaba_hostel',
          'dorm_hostel',
          'sn_bose_hostel',
          'kalpana_chawla_hostel',
        ],
        description: 'Hostel Services Administrator'
      },
      {
        username: 'food_admin',
        email: 'food.admin@helpdesk-edu.com',
        password: 'food123',
        role: 'admin',
        serviceIds: [
          // Food and mess services
          'food_court',
          'prithivi_mess',
          'thapa_mess',
          'kanika_mess',
          'juice_shop',
          'pizza_shop',
          'oac', // Open Air Cafeteria
        ],
        description: 'Food Services Administrator'
      },
      {
        username: 'sports_admin',
        email: 'sports.admin@helpdesk-edu.com',
        password: 'sports123',
        role: 'admin',
        serviceIds: [
          // Sports facilities only
          'cricket_ground',
          'football_ground',
          'badminton_court',
          'tennis_court',
          'squash_court',
          'basketball_court',
          'volley_ball_court',
        ],
        description: 'Sports Facilities Administrator'
      }
    ];

    console.log('Creating service-specific admin users...');
    
    for (const adminData of serviceAdmins) {
      // Check if admin already exists
      const existingAdmin = await (Admin as any).findOne({ username: adminData.username });
      
      if (existingAdmin) {
        console.log(`⚠️  Admin '${adminData.username}' already exists. Updating...`);
        
        // Update existing admin
        await (Admin as any).findByIdAndUpdate(
          existingAdmin._id,
          {
            $set: {
              email: adminData.email,
              role: adminData.role,
              serviceIds: adminData.serviceIds,
            },
          }
        );
        
        console.log(`✅ Updated ${adminData.description}`);
      } else {
        // Create new admin
        await (Admin as any).create({
          username: adminData.username,
          email: adminData.email,
          password: adminData.password,
          role: adminData.role,
          serviceIds: adminData.serviceIds,
        });
        
        console.log(`✅ Created ${adminData.description}`);
      }
    }

    console.log('\n🎉 Service-specific admin users setup complete!');
    console.log('==========================================');
    console.log('📋 Admin Login Credentials:');
    console.log('');
    
    serviceAdmins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.description}:`);
      console.log(`   Username: ${admin.username}`);
      console.log(`   Password: ${admin.password}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Services: ${admin.serviceIds.length} services`);
      console.log(`   Categories: ${admin.serviceIds.join(', ')}`);
      console.log('');
    });
    
    console.log('==========================================');
    console.log('🔗 Admin Login URL: http://localhost:3000/admin/login');
    console.log('');
    console.log('💡 Note: Each admin can only manage complaints for their assigned services.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating service admin users:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedServiceAdmins();
