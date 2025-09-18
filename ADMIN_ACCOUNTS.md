# Admin Accounts Reference

This document contains all the admin login credentials for the HelpDesk-EDU system.

## 🔐 Admin Login URL
**http://localhost:3000/admin/login**

---

## 👑 Super Admin (Full Access)

### Main Admin
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@helpdesk-edu.com`
- **Role**: `super_admin`
- **Access**: All 29 services across all categories
- **Description**: Full system administrator with access to all services

---

## 🎯 Service-Specific Admins

### 1. Hostel Services Admin
- **Username**: `hostel_admin`
- **Password**: `hostel123`
- **Email**: `hostel.admin@helpdesk-edu.com`
- **Role**: `admin`
- **Access**: 7 hostel services
  - Visveshwariya Hostel
  - Sarabhai Hostel
  - Gurbir Singh Hostel
  - Homi Bhaba Hostel
  - Dorm Hostel
  - SN Bose Hostel
  - Kalpana Chawla Hostel

### 2. Food Services Admin
- **Username**: `food_admin`
- **Password**: `food123`
- **Email**: `food.admin@helpdesk-edu.com`
- **Role**: `admin`
- **Access**: 7 food-related services
  - Food Court
  - Prithivi Mess
  - Thapa Mess
  - Kanika Mess
  - Juice Shop
  - Pizza Shop
  - OAC (Open Air Cafeteria)

### 3. Sports Facilities Admin
- **Username**: `sports_admin`
- **Password**: `sports123`
- **Email**: `sports.admin@helpdesk-edu.com`
- **Role**: `admin`
- **Access**: 7 sports facilities
  - Cricket Ground
  - Football Ground
  - Badminton Court
  - Tennis Court
  - Squash Court
  - Basketball Court
  - Volley Ball Court

### 4. Shops & Retail Admin
- **Username**: `shops_admin`
- **Password**: `shops123`
- **Email**: `shops@helpdesk-edu.com`
- **Role**: `admin`
- **Access**: 8 shop services
  - Food Court
  - OAC
  - Juice Shop
  - Thapa Grocery Shop
  - Ice Cream Parlour
  - Stationary Shop
  - Acad Xerox
  - Pizza Shop

---

## 🛠️ Admin Management Commands

### Check All Admins
```bash
npm run check-admin
```

### Create New Admin
```bash
npm run manage-admin create <username> <email> <password> <category>
```

### Update Admin Services
```bash
npm run manage-admin update <username> <new_category>
```

### Delete Admin
```bash
npm run manage-admin delete <username>
```

### List All Admins
```bash
npm run manage-admin list
```

### View Available Services
```bash
npm run manage-admin services
```

---

## 📋 Available Categories

- **shops**: Food Court, OAC, Juice Shop, Grocery, Ice Cream, Stationary, Xerox, Pizza
- **college_services**: Barber, Boys Gym, Girls Gym, Laundry
- **mess**: Prithivi Mess, Thapa Mess, Kanika Mess
- **hostel**: All 7 hostel facilities
- **sports**: All 7 sports facilities
- **all**: Complete access to all 29 services (super_admin role)

---

## 🔒 Security Notes

1. All passwords are hashed using bcrypt with salt rounds of 12
2. Each admin can only view and manage complaints for their assigned services
3. The main `admin` account has super_admin privileges
4. Service-specific admins have `admin` role with limited access
5. Admin sessions use JWT tokens for authentication

---

## 📞 Support

If you need to create additional admins or modify existing ones, use the provided management scripts or contact the system administrator.

**Last Updated**: September 12, 2025
