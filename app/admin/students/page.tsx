'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Mail,
  MapPin,
  Calendar,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface Student {
  _id: string;
  name: string;
  registrationNo: string;
  email: string;
  hostel: string;
  createdAt: string;
  complaintCount: number;
  pendingComplaints: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalStudents: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const HOSTELS = [
  'abdul kalam hostel',
  'vishveshwaria hostel',
  'gurbir hostel',
  'kalpana chawla hostel',
  'mess side hostel',
  'nand hostel',
];

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [hostelFilter, setHostelFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('admin');
    const token = localStorage.getItem('adminToken');
    
    if (!adminData || !token) {
      router.push('/admin/login');
      return;
    }

    fetchStudents();
  }, [router, searchTerm, hostelFilter]);

  const fetchStudents = async (page = 1) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15',
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (hostelFilter !== 'all') params.append('hostel', hostelFilter);

      const response = await fetch(`/api/admin/students?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students);
        setPagination(data.pagination);
      } else {
        toast.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  const getComplaintStatusColor = (pendingCount: number) => {
    if (pendingCount > 0) {
      return 'text-red-600 bg-red-100';
    }
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link
                href="/admin/dashboard"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manage Students</h1>
                <p className="text-sm text-gray-600">
                  {pagination ? `${pagination.totalStudents} total students` : 'Loading...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Students
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, registration number, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Hostel
              </label>
              <select
                value={hostelFilter}
                onChange={(e) => setHostelFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Hostels</option>
                {HOSTELS.map((hostel) => (
                  <option key={hostel} value={hostel}>
                    {hostel}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div key={student._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.registrationNo}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`mailto:${student.email}`}
                        className="p-2 text-gray-400 hover:text-blue-600"
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {student.email}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="capitalize">{student.hostel}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Joined {new Date(student.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <FileText className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="text-gray-600">
                          {student.complaintCount} complaint{student.complaintCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {student.pendingComplaints > 0 && (
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getComplaintStatusColor(student.pendingComplaints)}`}>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {student.pendingComplaints} pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Link
                      href={`/admin/students/${student._id}/complaints`}
                      className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md text-center"
                    >
                      View Complaints
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Search className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 bg-white px-4 py-3 border border-gray-200 rounded-lg sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => fetchStudents(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchStudents(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                    <span className="font-medium">{pagination.totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => fetchStudents(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => fetchStudents(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
