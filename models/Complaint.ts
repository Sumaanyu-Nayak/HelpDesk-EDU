import mongoose, { Schema, model, models } from 'mongoose';

const ComplaintSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  service: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'laundry service',
      'thapa mess',
      'abc mess',
      'gym service',
      'barber',
      'girls mess',
      'girls gym',
      'food court',
      'open air cafeteria',
      'stationary morning',
      'stationary evening',
      'juice shop',
      'general store',
      'pizza shop',
      'abdul kalam hostel',
      'vishveshwaria hostel',
      'gurbir hostel',
      'kalpana chawla hostel',
      'mess side hostel',
      'be-hostel',
      'library',
      'nand hostel',
    ],
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  adminResponse: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Index for better query performance
ComplaintSchema.index({ student: 1, createdAt: -1 });
ComplaintSchema.index({ service: 1, status: 1 });
ComplaintSchema.index({ status: 1 });

export default models.Complaint || model('Complaint', ComplaintSchema);
