import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';
import Complaint from '@/models/Complaint';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (!decoded.adminId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search');
    const hostel = url.searchParams.get('hostel');

    // Build filter object
    const filter: any = {};
    
    if (hostel && hostel !== 'all') {
      filter.hostel = hostel;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { registrationNo: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get students with pagination
    const students = await (Student as any).find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalStudents = await (Student as any).countDocuments(filter);
    const totalPages = Math.ceil(totalStudents / limit);

    // Get complaint counts for each student
    const studentsWithStats = await Promise.all(
      students.map(async (student: any) => {
        const complaintCount = await (Complaint as any).countDocuments({ 
          student: student._id 
        });
        const pendingComplaints = await (Complaint as any).countDocuments({ 
          student: student._id, 
          status: 'pending' 
        });
        
        return {
          ...student.toObject(),
          complaintCount,
          pendingComplaints,
        };
      })
    );

    return NextResponse.json({
      students: studentsWithStats,
      pagination: {
        currentPage: page,
        totalPages,
        totalStudents,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Fetch students error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
