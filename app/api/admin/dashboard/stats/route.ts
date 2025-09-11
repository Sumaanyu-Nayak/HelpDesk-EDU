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

    // Get total students count
    const totalStudents = await (Student as any).countDocuments();

    // Get total complaints count
    const totalComplaints = await (Complaint as any).countDocuments();

    // Get complaints by status
    const pendingComplaints = await (Complaint as any).countDocuments({ status: 'pending' });
    const inProgressComplaints = await (Complaint as any).countDocuments({ status: 'in-progress' });
    const resolvedComplaints = await (Complaint as any).countDocuments({ status: 'resolved' });

    const stats = {
      totalStudents,
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
