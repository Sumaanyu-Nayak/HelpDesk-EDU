'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
} from 'lucide-react';

interface ReportStats {
  totalStudents: number;
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  serviceStats: { service: string; count: number }[];
  hostelStats: { hostel: string; count: number }[];
  monthlyStats: { month: string; complaints: number }[];
  priorityStats: { priority: string; count: number }[];
}

export default function AdminReportsPage() {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('admin');
    const token = localStorage.getItem('adminToken');
    
    if (!adminData || !token) {
      router.push('/admin/login');
      return;
    }

    fetchReports();
  }, [router]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/admin/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        toast.error('Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const getResolutionRate = () => {
    if (!stats) return 0;
    const total = stats.totalComplaints;
    if (total === 0) return 0;
    return Math.round((stats.resolvedComplaints / total) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-sm text-gray-600">System overview and statistics</p>
              </div>
            </div>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalStudents || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalComplaints || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.pendingComplaints || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                <p className="text-2xl font-bold text-gray-900">{getResolutionRate()}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Service Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Complaints by Service</h3>
            <div className="space-y-3">
              {stats?.serviceStats?.slice(0, 8).map((service, index) => (
                <div key={service.service} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{service.service}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.max((service.count / (stats?.totalComplaints || 1)) * 100, 5)}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">
                      {service.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hostel Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Complaints by Hostel</h3>
            <div className="space-y-3">
              {stats?.hostelStats?.slice(0, 6).map((hostel, index) => (
                <div key={hostel.hostel} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{hostel.hostel}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${Math.max((hostel.count / (stats?.totalComplaints || 1)) * 100, 5)}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">
                      {hostel.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Complaint Status Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="text-sm font-medium text-orange-800">Pending</span>
                </div>
                <span className="text-lg font-bold text-orange-900">
                  {stats?.pendingComplaints || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">In Progress</span>
                </div>
                <span className="text-lg font-bold text-blue-900">
                  {stats?.inProgressComplaints || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Resolved</span>
                </div>
                <span className="text-lg font-bold text-green-900">
                  {stats?.resolvedComplaints || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Priority Distribution</h3>
            <div className="space-y-4">
              {stats?.priorityStats?.map((priority) => (
                <div key={priority.priority} className="flex items-center justify-between p-3 rounded-lg"
                     style={{
                       backgroundColor: priority.priority === 'high' ? '#fef2f2' : 
                                      priority.priority === 'medium' ? '#fffbeb' : '#f0fdf4'
                     }}>
                  <div className="flex items-center">
                    <AlertTriangle 
                      className={`h-5 w-5 mr-2 ${
                        priority.priority === 'high' ? 'text-red-600' :
                        priority.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`} 
                    />
                    <span className={`text-sm font-medium capitalize ${
                      priority.priority === 'high' ? 'text-red-800' :
                      priority.priority === 'medium' ? 'text-yellow-800' : 'text-green-800'
                    }`}>
                      {priority.priority} Priority
                    </span>
                  </div>
                  <span className={`text-lg font-bold ${
                    priority.priority === 'high' ? 'text-red-900' :
                    priority.priority === 'medium' ? 'text-yellow-900' : 'text-green-900'
                  }`}>
                    {priority.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
