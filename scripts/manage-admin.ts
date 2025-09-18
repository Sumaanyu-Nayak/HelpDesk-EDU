import { config } from 'dotenv';
import { join } from 'path';
import connectDB from '../lib/mongodb';
import Admin from '../models/Admin';
import { SERVICES } from '../types';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

// Helper function to get service IDs by category
function getServicesByCategory(category: string): string[] {
  return SERVICES.filter(service => service.category === category).map(service => service.id);
}

// Helper function to display available services
function displayAvailableServices() {
  console.log('\n📋 Available Services by Category:');
  console.log('==========================================');
  
  const categories = ['shops', 'college_services', 'mess', 'hostel', 'sports'];
  categories.forEach(category => {
    const services = getServicesByCategory(category);
    console.log(`\n${category.toUpperCase().replace('_', ' ')} (${services.length} services):`);
    services.forEach(service => {
      const serviceObj = SERVICES.find(s => s.id === service);
      console.log(`  - ${service} (${serviceObj?.name})`);
    });
  });
}

async function manageAdmin() {
  try {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      console.log('🛠️  Admin Management Tool');
      console.log('==========================================');
      console.log('Usage:');
      console.log('  npm run manage-admin create <username> <email> <password> <category>');
      console.log('  npm run manage-admin delete <username>');
      console.log('  npm run manage-admin update <username> <new_category>');
      console.log('  npm run manage-admin list');
      console.log('  npm run manage-admin services');
      console.log('');
      console.log('Categories: shops, college_services, mess, hostel, sports, all');
      console.log('');
      console.log('Examples:');
      console.log('  npm run manage-admin create gym_admin gym@college.edu gym123 college_services');
      console.log('  npm run manage-admin create mess_admin mess@college.edu mess123 mess');
      console.log('  npm run manage-admin delete gym_admin');
      console.log('  npm run manage-admin update food_admin shops');
      displayAvailableServices();
      process.exit(0);
    }

    await connectDB();
    
    const command = args[0];

    switch (command) {
      case 'create':
        await createAdmin(args[1], args[2], args[3], args[4]);
        break;
      case 'delete':
        await deleteAdmin(args[1]);
        break;
      case 'update':
        await updateAdmin(args[1], args[2]);
        break;
      case 'list':
        await listAdmins();
        break;
      case 'services':
        displayAvailableServices();
        break;
      default:
        console.log('❌ Unknown command. Use: create, delete, update, list, or services');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

async function createAdmin(username: string, email: string, password: string, category: string) {
  if (!username || !email || !password || !category) {
    console.log('❌ Missing required parameters for create command');
    console.log('Usage: npm run manage-admin create <username> <email> <password> <category>');
    return;
  }

  // Check if admin already exists
  const existingAdmin = await (Admin as any).findOne({ username });
  if (existingAdmin) {
    console.log(`❌ Admin '${username}' already exists!`);
    return;
  }

  let serviceIds: string[];
  
  if (category === 'all') {
    serviceIds = SERVICES.map(service => service.id);
  } else {
    serviceIds = getServicesByCategory(category);
    if (serviceIds.length === 0) {
      console.log(`❌ Invalid category '${category}'. Available: shops, college_services, mess, hostel, sports, all`);
      return;
    }
  }

  const admin = await (Admin as any).create({
    username,
    email,
    password,
    role: category === 'all' ? 'super_admin' : 'admin',
    serviceIds,
  });

  console.log(`✅ Admin '${username}' created successfully!`);
  console.log(`   Email: ${email}`);
  console.log(`   Category: ${category}`);
  console.log(`   Services: ${serviceIds.length} services`);
  console.log(`   Access: ${serviceIds.join(', ')}`);
}

async function deleteAdmin(username: string) {
  if (!username) {
    console.log('❌ Missing username for delete command');
    console.log('Usage: npm run manage-admin delete <username>');
    return;
  }

  const admin = await (Admin as any).findOne({ username });
  if (!admin) {
    console.log(`❌ Admin '${username}' not found!`);
    return;
  }

  if (username === 'admin') {
    console.log('❌ Cannot delete the main admin user!');
    return;
  }

  await (Admin as any).findByIdAndDelete(admin._id);
  console.log(`✅ Admin '${username}' deleted successfully!`);
}

async function updateAdmin(username: string, newCategory: string) {
  if (!username || !newCategory) {
    console.log('❌ Missing parameters for update command');
    console.log('Usage: npm run manage-admin update <username> <new_category>');
    return;
  }

  const admin = await (Admin as any).findOne({ username });
  if (!admin) {
    console.log(`❌ Admin '${username}' not found!`);
    return;
  }

  let serviceIds: string[];
  
  if (newCategory === 'all') {
    serviceIds = SERVICES.map(service => service.id);
  } else {
    serviceIds = getServicesByCategory(newCategory);
    if (serviceIds.length === 0) {
      console.log(`❌ Invalid category '${newCategory}'. Available: shops, college_services, mess, hostel, sports, all`);
      return;
    }
  }

  await (Admin as any).findByIdAndUpdate(admin._id, {
    $set: {
      serviceIds,
      role: newCategory === 'all' ? 'super_admin' : 'admin',
    },
  });

  console.log(`✅ Admin '${username}' updated successfully!`);
  console.log(`   New Category: ${newCategory}`);
  console.log(`   New Services: ${serviceIds.length} services`);
  console.log(`   New Access: ${serviceIds.join(', ')}`);
}

async function listAdmins() {
  const admins = await (Admin as any).find({});
  
  console.log(`✅ Found ${admins.length} admin users:`);
  console.log('==========================================');
  
  admins.forEach((admin: any, index: number) => {
    console.log(`${index + 1}. ${admin.username} (${admin.role})`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Services: ${admin.serviceIds.length}`);
    console.log(`   Created: ${admin.createdAt.toLocaleDateString()}`);
    console.log('   ---');
  });
}

// Run the management function
manageAdmin();
