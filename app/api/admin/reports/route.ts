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

    // Get basic stats
    const totalStudents = await (Student as any).countDocuments();
    const totalComplaints = await (Complaint as any).countDocuments();
    const pendingComplaints = await (Complaint as any).countDocuments({ status: 'pending' });
    const inProgressComplaints = await (Complaint as any).countDocuments({ status: 'in-progress' });
    const resolvedComplaints = await (Complaint as any).countDocuments({ status: 'resolved' });

    // Get service statistics
    const serviceStats = await (Complaint as any).aggregate([
      {
        $group: {
          _id: '$service',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $project: {
          _id: 0,
          service: '$_id',
          count: 1
        }
      }
    ]);

    // Get hostel statistics (from student data via populate)
    const hostelStats = await (Complaint as any).aggregate([
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentData'
        }
      },
      {
        $unwind: '$studentData'
      },
      {
        $group: {
          _id: '$studentData.hostel',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $project: {
          _id: 0,
          hostel: '$_id',
          count: 1
        }
      }
    ]);

    // Get priority statistics
    const priorityStats = await (Complaint as any).aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $project: {
          _id: 0,
          priority: '$_id',
          count: 1
        }
      }
    ]);

    // Get monthly statistics (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await (Complaint as any).aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          complaints: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              { $toString: '$_id.month' }
            ]
          },
          complaints: 1
        }
      }
    ]);

    const reportData = {
      totalStudents,
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      serviceStats,
      hostelStats,
      priorityStats,
      monthlyStats,
    };

    return NextResponse.json(reportData, { status: 200 });
  } catch (error) {
    console.error('Reports error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
