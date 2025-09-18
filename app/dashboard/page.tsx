'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { SERVICES } from '../../types';
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  LogOut,
  User,
  Search,
  Filter,
  MessageSquare,
  Calendar
} from 'lucide-react';

interface Student {
  _id: string;
  registrationNo: string;
  name: string;
  email: string;
  department: string;
  year: number;
}

interface Complaint {
  _id: string;
  service: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  // Category definitions
  const CATEGORIES = [
    { id: 'shops', name: 'Shops' },
    { id: 'college_services', name: 'College Services' },
    { id: 'mess', name: 'Mess' },
    { id: 'hostel', name: 'Hostel' },
    { id: 'sports', name: 'Sports' },
  ];

  // Helper function to get services by category
  const getServicesByCategory = (category: string) => {
    return SERVICES.filter(service => service.category === category);
  };

  // Helper function to get category display name
  const getCategoryDisplayName = (categoryId: string) => {
    return CATEGORIES.find(cat => cat.id === categoryId)?.name || '';
  };

  const [student, setStudent] = useState<Student | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const router = useRouter();

  const [newComplaint, setNewComplaint] = useState({
    category: '',
    service: '',
    title: '',
    description: '',
    priority: 'medium' as const,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const studentData = localStorage.getItem('student');

    if (!token || !studentData) {
      router.push('/auth/login');
      return;
    }

    setStudent(JSON.parse(studentData));
    fetchComplaints();
  }, [router]);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/complaints', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setComplaints(data.complaints);
      } else {
        toast.error('Failed to fetch complaints');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setNewComplaint(prev => ({
      ...prev,
      category,
      service: '', // Reset service when category changes
    }));
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComplaint.service || !newComplaint.title || !newComplaint.description) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newComplaint),
      });

      if (response.ok) {
        toast.success('Complaint submitted successfully!');
        setNewComplaint({
          category: '',
          service: '',
          title: '',
          description: '',
          priority: 'medium',
        });
        setShowNewComplaint(false);
        fetchComplaints();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to submit complaint');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    if (statusFilter !== 'all' && complaint.status !== statusFilter) return false;
    if (serviceFilter !== 'all' && complaint.service !== serviceFilter) return false;
    return true;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">HelpDesk EDU</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-700">{student?.name}</span>
                <span className="text-xs text-gray-500">({student?.registrationNo})</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <button
            onClick={() => setShowNewComplaint(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>New Complaint</span>
          </button>

          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Services</option>
              {['shops', 'college_services', 'mess', 'hostel', 'sports'].map(category => (
                <optgroup key={category} label={getCategoryDisplayName(category)}>
                  {getServicesByCategory(category).map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No complaints found</p>
              <p className="text-sm text-gray-500 mt-2">
                {complaints.length === 0 
                  ? "You haven't submitted any complaints yet." 
                  : "Try adjusting your filters."}
              </p>
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <div key={complaint._id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {complaint.title}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">{complaint.service}</p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                      {complaint.status.replace('-', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{complaint.description}</p>
                
                {/* Admin Response Section */}
                {complaint.adminResponse && (
                  <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800">Admin Response</span>
                      <div className="flex items-center ml-auto text-xs text-blue-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(complaint.updatedAt).toLocaleString()}
                      </div>
                    </div>
                    <p className="text-blue-800 text-sm whitespace-pre-wrap">{complaint.adminResponse}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                  <span>Created: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(complaint.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Complaint Modal */}
      {showNewComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Submit New Complaint</h2>
                <button
                  onClick={() => setShowNewComplaint(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitComplaint} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newComplaint.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service *
                  </label>
                  <select
                    value={newComplaint.service}
                    onChange={(e) => setNewComplaint(prev => ({ ...prev, service: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!newComplaint.category}
                  >
                    <option value="">
                      {newComplaint.category ? 'Select a service' : 'Please select a category first'}
                    </option>
                    {newComplaint.category && getServicesByCategory(newComplaint.category).map((service) => (
                      <option key={service.id} value={service.name.toLowerCase()}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newComplaint.title}
                    onChange={(e) => setNewComplaint(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of the issue"
                    required
                    maxLength={200}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Detailed description of the complaint"
                    required
                    maxLength={1000}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newComplaint.priority}
                    onChange={(e) => setNewComplaint(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Submit Complaint
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewComplaint(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
