import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const projectSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  technologies: [{
    type: String,
    trim: true
  }],
  demoUrl: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: ''
  },
  lookingFor: {
    type: String,
    enum: ['full-time', 'contract', 'freelance', 'feedback'],
    required: true
  },
  responses: [responseSchema],
  saves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema);
