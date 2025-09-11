import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { registrationNo, name, email, department, year, hostel } = await request.json();

    // Validate required fields
    if (!registrationNo || !name || !email || !department || !year) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if student already exists
    const existingStudent = await (Student as any).findOne({
      $or: [{ registrationNo }, { email }]
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: 'Student with this registration number or email already exists' },
        { status: 409 }
      );
    }

    // Create new student
    const student = await (Student as any).create({
      registrationNo: registrationNo.toUpperCase(),
      name,
      email: email.toLowerCase(),
      department,
      year,
      hostel: hostel || '',
    });

    return NextResponse.json(
      {
        message: 'Student registered successfully',
        student: {
          _id: student._id,
          registrationNo: student.registrationNo,
          name: student.name,
          email: student.email,
          department: student.department,
          year: student.year,
          hostel: student.hostel,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
