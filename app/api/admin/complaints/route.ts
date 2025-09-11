import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import Student from '@/models/Student';
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
    const status = url.searchParams.get('status');
    const service = url.searchParams.get('service');
    const priority = url.searchParams.get('priority');
    const search = url.searchParams.get('search');

    // Build filter object
    const filter: any = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (service && service !== 'all') {
      filter.service = service;
    }
    
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get complaints with pagination and populate student data
    const complaints = await (Complaint as any).find(filter)
      .populate('student', 'name registrationNo email hostel')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalComplaints = await (Complaint as any).countDocuments(filter);
    const totalPages = Math.ceil(totalComplaints / limit);

    return NextResponse.json({
      complaints,
      pagination: {
        currentPage: page,
        totalPages,
        totalComplaints,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Fetch complaints error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const { complaintId, status, adminResponse } = await request.json();

    if (!complaintId || !status) {
      return NextResponse.json(
        { error: 'Complaint ID and status are required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (adminResponse) {
      updateData.adminResponse = adminResponse;
    }

    const complaint = await (Complaint as any).findByIdAndUpdate(
      complaintId,
      updateData,
      { new: true }
    ).populate('student', 'name registrationNo email');

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Complaint updated successfully',
      complaint,
    }, { status: 200 });
  } catch (error) {
    console.error('Update complaint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
