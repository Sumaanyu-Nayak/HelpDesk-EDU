export interface Service {
  id: string;
  name: string;
  category: 'shops' | 'college_services' | 'mess' | 'hostel' | 'sports';
}

export const SERVICES: Service[] = [
  // Shops
  { id: 'food_court', name: 'Food Court', category: 'shops' },
  { id: 'oac', name: 'OAC', category: 'shops' },
  { id: 'juice_shop', name: 'Juice Shop', category: 'shops' },
  { id: 'thapa_grocery_shop', name: 'Thapa Grocery Shop', category: 'shops' },
  { id: 'ice_cream_parlour', name: 'Ice Cream Parlour', category: 'shops' },
  { id: 'stationary_shop', name: 'Stationary Shop', category: 'shops' },
  { id: 'acad_xerox', name: 'Acad Xerox', category: 'shops' },
  { id: 'pizza_shop', name: 'Pizza Shop', category: 'shops' },
  
  // College Services
  { id: 'barber', name: 'Barber', category: 'college_services' },
  { id: 'boys_gym', name: 'Boys Gym', category: 'college_services' },
  { id: 'girls_gym', name: 'Girls Gym', category: 'college_services' },
  { id: 'laundry', name: 'Laundry', category: 'college_services' },
  
  // Mess
  { id: 'prithivi_mess', name: 'Prithivi Mess', category: 'mess' },
  { id: 'thapa_mess', name: 'Thapa Mess', category: 'mess' },
  { id: 'kanika_mess', name: 'Kanika Mess', category: 'mess' },
  
  // Hostel
  { id: 'visveshwariya_hostel', name: 'Visveshwariya Hostel', category: 'hostel' },
  { id: 'sarabhai_hostel', name: 'Sarabhai Hostel', category: 'hostel' },
  { id: 'gurbir_singh_hostel', name: 'Gurbir Singh Hostel', category: 'hostel' },
  { id: 'homi_bhaba_hostel', name: 'Homi Bhaba Hostel', category: 'hostel' },
  { id: 'dorm_hostel', name: 'Dorm Hostel', category: 'hostel' },
  { id: 'sn_bose_hostel', name: 'SN Bose Hostel', category: 'hostel' },
  { id: 'kalpana_chawla_hostel', name: 'Kalpana Chawla Hostel', category: 'hostel' },
  
  // Sports
  { id: 'cricket_ground', name: 'Cricket Ground', category: 'sports' },
  { id: 'football_ground', name: 'Football Ground', category: 'sports' },
  { id: 'badminton_court', name: 'Badminton Court', category: 'sports' },
  { id: 'tennis_court', name: 'Tennis Court', category: 'sports' },
  { id: 'squash_court', name: 'Squash Court', category: 'sports' },
  { id: 'basketball_court', name: 'Basketball Court', category: 'sports' },
  { id: 'volley_ball_court', name: 'Volley Ball Court', category: 'sports' },
];

export interface Student {
  _id?: string;
  registrationNo: string;
  name: string;
  email: string;
  department: string;
  year: number;
  createdAt?: Date;
}

export interface Complaint {
  _id?: string;
  studentId: string;
  registrationNo: string;
  serviceId: string;
  serviceName: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt?: Date;
  updatedAt?: Date;
  resolvedAt?: Date;
  adminNotes?: string;
}

export interface Admin {
  _id?: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
  serviceIds: string[];
  createdAt?: Date;
}
