import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import Student from '@/models/Student';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as any;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const service = searchParams.get('service');

    // Build query
    const query: any = { student: decoded.studentId };
    if (status) query.status = status;
    if (service) query.service = service;

    const skip = (page - 1) * limit;

        const [complaints, total] = await Promise.all([
      (Complaint as any).find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('student', 'name registrationNo email'),
      (Complaint as any).countDocuments(query),
    ]);

    return NextResponse.json({
      complaints,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total,
      },
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { service, title, description, priority } = await request.json();

    // Validate required fields
    if (!service || !title || !description) {
      return NextResponse.json(
        { error: 'Service, title, and description are required' },
        { status: 400 }
      );
    }

    // Validate service exists in the allowed services
    const allowedServices = [
      'laundry service', 'thapa mess', 'abc mess', 'gym service', 'barber',
      'girls mess', 'girls gym', 'food court', 'open air cafeteria',
      'stationary morning', 'stationary evening', 'juice shop', 'general store', 'pizza shop',
      'abdul kalam hostel', 'vishveshwaria hostel', 'gurbir hostel',
      'kalpana chawla hostel', 'mess side hostel', 'be-hostel', 'library', 'nand hostel'
    ];
    
    if (!allowedServices.includes(service.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid service selected' },
        { status: 400 }
      );
    }

        // Find the student
    const student = await (Student as any).findOne({ 
      registrationNo: decoded.registrationNo 
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Create complaint
    const complaint = await (Complaint as any).create({
      student: student._id,
      title,
      description,
      service: service.toLowerCase(),
      priority,
    });

    return NextResponse.json(
      {
        message: 'Complaint submitted successfully',
        complaint,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create complaint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
