import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { registrationNo } = await request.json();

    if (!registrationNo) {
      return NextResponse.json(
        { error: 'Registration number is required' },
        { status: 400 }
      );
    }

    // Find student by registration number
    const student = await (Student as any).findOne({ 
      registrationNo: registrationNo.toUpperCase() 
    });    if (!student) {
      return NextResponse.json(
        { error: 'Invalid registration number' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        studentId: student._id,
        registrationNo: student.registrationNo,
        name: student.name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        student: {
          _id: student._id,
          registrationNo: student.registrationNo,
          name: student.name,
          email: student.email,
          department: student.department,
          year: student.year,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
