'use client';

import Link from 'next/link';
import { useState } from 'react';
import { GraduationCap, MessageSquare, Users, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">HelpDesk EDU</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Student Login
              </Link>
              <Link
                href="/admin/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Digital Complaint Management System
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Submit and track complaints for all college services including hostels, 
            mess facilities, gym, library, and more. Quick, efficient, and transparent.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/auth/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Register Now
            </Link>
            <Link
              href="/auth/login"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Service Coverage
            </h3>
            <p className="text-lg text-gray-600">
              Submit complaints for any college service with ease
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Complaint Submission
              </h4>
              <p className="text-gray-600">
                Submit complaints for hostels, mess, gym, library, and 20+ other services
              </p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Real-time Tracking
              </h4>
              <p className="text-gray-600">
                Track your complaint status from submission to resolution
              </p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Authentication
              </h4>
              <p className="text-gray-600">
                Login using your registration number from your ID card barcode
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              All College Services Covered
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Laundry Service', 'Thapa Mess', 'ABC Mess', 'Girls Mess',
              'Gym Service', 'Girls Gym', 'Barber', 'Food Court',
              'Open Air Cafeteria', 'Stationary', 'Juice Shop', 'General Store',
              'Pizza Shop', 'Abdul Kalam Hostel', 'Vishveshwaria Hostel', 'Gurbir Hostel',
              'Kalpana Chawla Hostel', 'Mess Side Hostel', 'Nand Hostel', 'Library'
            ].map((service, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="text-sm font-medium text-gray-700">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 HelpDesk EDU. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
