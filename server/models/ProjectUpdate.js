import mongoose from 'mongoose';

const projectUpdateSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  version: {
    type: String,
    trim: true
  },
  updateType: {
    type: String,
    enum: ['feature', 'bugfix', 'improvement', 'announcement'],
    default: 'announcement'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
projectUpdateSchema.index({ project: 1, createdAt: -1 });

export default mongoose.model('ProjectUpdate', projectUpdateSchema);
