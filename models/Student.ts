import mongoose, { Schema, model, models } from 'mongoose';

const StudentSchema = new Schema({
  registrationNo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
  },
  hostel: {
    type: String,
    required: false,
    trim: true,
    enum: [
      'abdul kalam hostel',
      'vishveshwaria hostel', 
      'gurbir hostel',
      'kalpana chawla hostel',
      'mess side hostel',
      'be-hostel',
      'nand hostel',
      '',
    ],
    default: '',
  },
}, {
  timestamps: true,
});

export default models.Student || model('Student', StudentSchema);
