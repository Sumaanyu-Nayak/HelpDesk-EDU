'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Mail,
  MapPin,
  Book,
  Edit,
  Save,
  X,
} from 'lucide-react';

interface Student {
  _id: string;
  name: string;
  registrationNo: string;
  email: string;
  department: string;
  year: number;
  hostel: string;
}

interface Complaint {
  _id: string;
  title: string;
  description: string;
  service: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  student: Student;
  adminResponse: string;
  createdAt: string;
  updatedAt: string;
}

export default function ComplaintDetailsPage() {
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminResponse, setAdminResponse] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('admin');
    const token = localStorage.getItem('adminToken');
    
    if (!adminData || !token) {
      router.push('/admin/login');
      return;
    }

    if (params.id) {
      fetchComplaintDetails();
    }
  }, [router, params.id]);

  const fetchComplaintDetails = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`/api/admin/complaints/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setComplaint(data.complaint);
        setNewStatus(data.complaint.status);
        setAdminResponse(data.complaint.adminResponse || '');
      } else {
        toast.error('Failed to fetch complaint details');
        router.push('/admin/complaints');
      }
    } catch (error) {
      console.error('Error fetching complaint details:', error);
      toast.error('Failed to load complaint details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateComplaint = async () => {
    if (!complaint || !newStatus) return;

    try {
      setIsUpdating(true);
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`/api/admin/complaints/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          adminResponse: adminResponse.trim() || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComplaint(data.complaint);
        setIsEditing(false);
        toast.success('Complaint updated successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update complaint');
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('Failed to update complaint');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'resolved':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'in-progress':
        return <AlertCircle className="h-5 w-5" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Complaint not found</h2>
          <p className="text-gray-600 mb-4">The complaint you're looking for doesn't exist.</p>
          <Link
            href="/admin/complaints"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to complaints
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link
                href="/admin/complaints"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Complaint Details</h1>
                <p className="text-sm text-gray-600">
                  ID: {complaint._id}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Status
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateComplaint}
                    disabled={isUpdating}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isUpdating ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setNewStatus(complaint.status);
                      setAdminResponse(complaint.adminResponse || '');
                    }}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Complaint Information</h2>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority} priority
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                    {getStatusIcon(complaint.status)}
                    <span className="ml-2">{complaint.status}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <p className="text-gray-900">{complaint.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <p className="text-gray-900 capitalize">{complaint.service}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <div className="bg-gray-50 rounded-md p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">{complaint.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Created:</span> {new Date(complaint.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span> {new Date(complaint.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Response */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Response</h2>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Response Message
                    </label>
                    <textarea
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add a response to the student..."
                    />
                  </div>
                </div>
              ) : (
                <div>
                  {complaint.adminResponse ? (
                    <div className="bg-blue-50 rounded-md p-4">
                      <p className="text-gray-900 whitespace-pre-wrap">{complaint.adminResponse}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No admin response yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Student Information Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Student Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{complaint.student.name}</p>
                    <p className="text-sm text-gray-600">{complaint.student.registrationNo}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-900">{complaint.student.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Book className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-900">{complaint.student.department}</p>
                    <p className="text-sm text-gray-600">Year {complaint.student.year}</p>
                  </div>
                </div>

                {complaint.student.hostel && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-gray-900 capitalize">{complaint.student.hostel}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Link
                    href={`mailto:${complaint.student.email}`}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
