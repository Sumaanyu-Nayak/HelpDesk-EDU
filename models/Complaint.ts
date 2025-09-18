import mongoose, { Schema, model, models } from 'mongoose';
import { SERVICES } from '@/types';

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
    enum: SERVICES.map(service => service.id),
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
