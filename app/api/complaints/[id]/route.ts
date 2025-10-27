import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import Student from '@/models/Student';
import jwt from 'jsonwebtoken';

function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return null;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const complaintId = params.id;

    // Find the complaint
    const complaint = await (Complaint as any).findById(complaintId).populate('student');
    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Check if the complaint belongs to the authenticated student
    const student = await (Student as any).findOne({ 
      registrationNo: (decoded as any).registrationNo 
    });
    
    if (!student || complaint.student._id.toString() !== student._id.toString()) {
      return NextResponse.json(
        { error: 'You can only delete your own complaints' },
        { status: 403 }
      );
    }

    // Only allow deletion of pending complaints
    if (complaint.status !== 'pending') {
      return NextResponse.json(
        { error: 'You can only delete pending complaints' },
        { status: 400 }
      );
    }

    // Delete the complaint
    await (Complaint as any).findByIdAndDelete(complaintId);

    return NextResponse.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Delete complaint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const complaintId = params.id;
    const { title, description, priority } = await request.json();

    // Find the complaint
    const complaint = await (Complaint as any).findById(complaintId).populate('student');
    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Check if the complaint belongs to the authenticated student
    const student = await (Student as any).findOne({ 
      registrationNo: (decoded as any).registrationNo 
    });
    
    if (!student || complaint.student._id.toString() !== student._id.toString()) {
      return NextResponse.json(
        { error: 'You can only edit your own complaints' },
        { status: 403 }
      );
    }

    // Only allow editing of pending complaints
    if (complaint.status !== 'pending') {
      return NextResponse.json(
        { error: 'You can only edit pending complaints' },
        { status: 400 }
      );
    }

    // Update the complaint
    const updatedComplaint = await (Complaint as any).findByIdAndUpdate(
      complaintId,
      {
        title: title || complaint.title,
        description: description || complaint.description,
        priority: priority || complaint.priority,
      },
      { new: true }
    ).populate('student', 'name registrationNo email');

    return NextResponse.json(updatedComplaint);
  } catch (error) {
    console.error('Update complaint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}