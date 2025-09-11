export interface Service {
  id: string;
  name: string;
  category: 'food' | 'accommodation' | 'facilities' | 'academic';
}

export const SERVICES: Service[] = [
  // Food Services
  { id: 'laundry', name: 'Laundry Service', category: 'facilities' },
  { id: 'thapa_mess', name: 'Thapa Mess', category: 'food' },
  { id: 'abc_mess', name: 'ABC Mess', category: 'food' },
  { id: 'girls_mess', name: 'Girls Mess', category: 'food' },
  { id: 'food_court', name: 'Food Court', category: 'food' },
  { id: 'open_air_cafeteria', name: 'Open Air Cafeteria', category: 'food' },
  { id: 'juice_shop', name: 'Juice Shop', category: 'food' },
  { id: 'pizza_shop', name: 'Pizza Shop', category: 'food' },
  
  // Facilities
  { id: 'gym', name: 'Gym Service', category: 'facilities' },
  { id: 'girls_gym', name: 'Girls Gym', category: 'facilities' },
  { id: 'barber', name: 'Barber', category: 'facilities' },
  { id: 'stationary', name: 'Stationary', category: 'facilities' },
  { id: 'general_store', name: 'General Store', category: 'facilities' },
  
  // Accommodation
  { id: 'abdul_kalam_hostel', name: 'Abdul Kalam Hostel', category: 'accommodation' },
  { id: 'vishveshwaria_hostel', name: 'Vishveshwaria Hostel', category: 'accommodation' },
  { id: 'gurbir_hostel', name: 'Gurbir Hostel', category: 'accommodation' },
  { id: 'kalpana_chawla_hostel', name: 'Kalpana Chawla Hostel', category: 'accommodation' },
  { id: 'mess_side_hostel', name: 'Mess Side Hostel', category: 'accommodation' },
  { id: 'nand_hostel', name: 'Nand Hostel', category: 'accommodation' },
  
  // Academic
  { id: 'library', name: 'Library', category: 'academic' },
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
