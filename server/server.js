import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from './models/User.js';
import Project from './models/Project.js';
import { 
  limiter, 
  authLimiter, 
  securityHeaders, 
  sanitizeData, 
  preventXSS,
  corsOptions 
} from './middleware/security.js';
import { 
  compressResponses, 
  responseTimeLogger 
} from './middleware/performance.js';
import { logger, requestLogger, errorLogger } from './middleware/logging.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Parse CORS origins for Socket.io
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:3001'];

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Security & Performance Middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(express.json());
app.use(sanitizeData);
app.use(preventXSS);
app.use(compressResponses);
app.use(requestLogger); // Add request logging
app.use(responseTimeLogger);
app.use(limiter);

// MongoDB Connection
let mongoServer;
const connectDB = async () => {
  try {
    // Use MongoDB Atlas in production, in-memory for development
    if (process.env.NODE_ENV === 'production' && process.env.MONGODB_URI) {
      // Production: Use MongoDB Atlas
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB Atlas Connected');
    } else {
      // Development: Use in-memory MongoDB
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ MongoDB In-Memory Server Connected');
      console.log('📝 Note: Data will be lost when server restarts');
    }
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
};

await connectDB();

// Auth Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'buildshare-secret-key-2024');
    const user = await User.findById(decoded.userId);
    
    if (!user) throw new Error();
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// ============ AUTH ROUTES ============

// Register (with rate limiting)
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password, userType, title, location, company } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      userType,
      title,
      location,
      company
    });
    
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'buildflow-secret-key-2024');
    
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        title: user.title,
        location: user.location,
        company: user.company
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login (with rate limiting)
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'buildshare-secret-key-2024');
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        title: user.title,
        location: user.location,
        company: user.company
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', auth, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    userType: req.user.userType,
    title: req.user.title,
    location: req.user.location,
    company: req.user.company
  });
});

// ============ PROJECT ROUTES ============

// Create project
app.post('/api/projects', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'developer') {
      return res.status(403).json({ error: 'Only developers can create projects' });
    }
    
    const { title, description, images, technologies, demoUrl, githubUrl, lookingFor } = req.body;
    
    const project = new Project({
      user: req.user._id,
      title,
      description,
      images: images || [],
      technologies,
      demoUrl,
      githubUrl,
      lookingFor
    });
    
    await project.save();
    await project.populate('user', 'name title location');
    
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all projects with pagination
app.get('/api/projects', async (req, res) => {
  try {
    const { filter = 'all', page = 1, limit = 20 } = req.query;
    
    let query = {};
    let sort = { createdAt: -1 };
    
    if (filter === 'trending') {
      // Sort by number of responses
      sort = { 'responses.length': -1, createdAt: -1 };
    } else if (filter === 'recent') {
      sort = { createdAt: -1 };
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count for pagination info
    const total = await Project.countDocuments(query);
    
    const projects = await Project.find(query)
      .populate('user', 'name title location company')
      .populate('responses.user', 'name company userType')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    res.json({
      projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
        hasMore: skip + projects.length < total
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('user', 'name title location company')
      .populate('responses.user', 'name company userType');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add response to project
app.post('/api/projects/:id/responses', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'employer') {
      return res.status(403).json({ error: 'Only employers can respond to projects' });
    }
    
    const { content } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    project.responses.push({
      user: req.user._id,
      content
    });
    
    await project.save();
    await project.populate('responses.user', 'name company userType');
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete project
app.delete('/api/projects/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Check if user is the owner
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this project' });
    }
    
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle save project
app.post('/api/projects/:id/save', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const saveIndex = project.saves.indexOf(req.user._id);
    
    if (saveIndex > -1) {
      project.saves.splice(saveIndex, 1);
    } else {
      project.saves.push(req.user._id);
    }
    
    await project.save();
    res.json({ saved: saveIndex === -1 });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle helpful on response
app.post('/api/projects/:projectId/responses/:responseId/helpful', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const response = project.responses.id(req.params.responseId);
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }
    
    const helpfulIndex = response.helpful.indexOf(req.user._id);
    
    if (helpfulIndex > -1) {
      response.helpful.splice(helpfulIndex, 1);
    } else {
      response.helpful.push(req.user._id);
    }
    
    await project.save();
    res.json({ helpful: helpfulIndex === -1, count: response.helpful.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ USER PROFILE ROUTES ============

// Get user profile with projects and stats
app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const projects = await Project.find({ user: req.params.userId })
      .populate('user', 'name title location')
      .populate('responses.user', 'name company userType')
      .sort({ createdAt: -1 });
    
    const stats = {
      projectCount: projects.length,
      totalResponses: projects.reduce((sum, p) => sum + p.responses.length, 0),
      totalSaves: projects.reduce((sum, p) => sum + p.saves.length, 0)
    };
    
    res.json({ user, projects, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
app.put('/api/users/profile', auth, async (req, res) => {
  try {
    const { name, title, location, bio, company } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, title, location, bio, company },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ SEARCH & FILTER ROUTES ============

// Search projects with filters and pagination
app.get('/api/projects/search', async (req, res) => {
  try {
    const { q, technology, location, lookingFor, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (technology) {
      query.technologies = { $in: [technology] };
    }
    
    if (lookingFor) {
      query.lookingFor = lookingFor;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count
    const total = await Project.countDocuments(query);
    
    const projects = await Project.find(query)
      .populate('user', 'name title location company')
      .populate('responses.user', 'name company userType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Filter by location (user location) if specified
    let filteredProjects = projects;
    if (location) {
      filteredProjects = projects.filter(p => 
        p.user.location && p.user.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    res.json({
      projects: filteredProjects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: location ? filteredProjects.length : total,
        pages: Math.ceil((location ? filteredProjects.length : total) / parseInt(limit)),
        hasMore: skip + filteredProjects.length < (location ? filteredProjects.length : total)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ NOTIFICATION ROUTES ============

import Notification from './models/Notification.js';

// Get user notifications
app.get('/api/notifications', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate('relatedUser', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark all notifications as read
app.put('/api/notifications/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Helper function to create notification
async function createNotification(userId, type, message, relatedProject, relatedUser) {
  try {
    const notification = new Notification({
      user: userId,
      type,
      message,
      relatedProject,
      relatedUser
    });
    await notification.save();
  } catch (error) {
    logger.error('Failed to create notification', { error: error.message, userId, type });
  }
}

// Error handler with logging
app.use(errorLogger);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join conversation room
  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  // Leave conversation room
  socket.on('leave-conversation', (conversationId) => {
    socket.leave(conversationId);
    console.log(`User ${socket.id} left conversation ${conversationId}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'BuildShare API',
    version: '1.0.0',
    description: 'MERN stack job finding platform',
    endpoints: {
      auth: '/api/auth/*',
      projects: '/api/projects/*',
      users: '/api/users/*',
      messages: '/api/messages/*',
      notifications: '/api/notifications/*',
      analytics: '/api/analytics',
      collections: '/api/collections/*'
    }
  });
});

httpServer.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server ready`);
});


// ============ MESSAGING ROUTES (Phase 2) ============
import Message from './models/Message.js';

// Get user conversations
app.get('/api/messages/conversations', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }]
    })
    .populate('sender recipient', 'name title')
    .sort({ createdAt: -1 });

    const conversationsMap = new Map();
    
    messages.forEach(msg => {
      if (!conversationsMap.has(msg.conversationId)) {
        const otherUser = msg.sender._id.toString() === req.user._id.toString() 
          ? msg.recipient 
          : msg.sender;
        
        conversationsMap.set(msg.conversationId, {
          conversationId: msg.conversationId,
          otherUser,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: 0
        });
      }
    });

    for (let [convId, conv] of conversationsMap) {
      const unread = await Message.countDocuments({
        conversationId: convId,
        recipient: req.user._id,
        read: false
      });
      conv.unreadCount = unread;
    }

    res.json(Array.from(conversationsMap.values()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages in conversation
app.get('/api/messages/:conversationId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    })
    .populate('sender recipient', 'name')
    .sort({ createdAt: 1 });

    await Message.updateMany(
      {
        conversationId: req.params.conversationId,
        recipient: req.user._id,
        read: false
      },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message
app.post('/api/messages', auth, async (req, res) => {
  try {
    const { recipientId, content } = req.body;

    const ids = [req.user._id.toString(), recipientId].sort();
    const conversationId = `${ids[0]}_${ids[1]}`;

    const message = new Message({
      sender: req.user._id,
      recipient: recipientId,
      content,
      conversationId
    });

    await message.save();
    await message.populate('sender recipient', 'name');

    // Emit real-time message via Socket.io
    const io = req.app.get('io');
    io.to(conversationId).emit('new-message', message);

    await createNotification(
      recipientId,
      'message',
      `${req.user.name} sent you a message`,
      null,
      req.user._id
    );

    res.json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ ANALYTICS ROUTES (Phase 2) ============

app.get('/api/analytics', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id })
      .populate('responses.user', 'name');

    const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalResponses = projects.reduce((sum, p) => sum + p.responses.length, 0);
    const totalSaves = projects.reduce((sum, p) => sum + p.saves.length, 0);
    const engagementRate = projects.length > 0 
      ? Math.round((totalResponses / projects.length) * 100) 
      : 0;

    const projectStats = projects.map(p => ({
      _id: p._id,
      title: p.title,
      views: p.views || 0,
      responseCount: p.responses.length,
      saveCount: p.saves.length,
      engagementRate: p.views > 0 ? Math.round((p.responses.length / p.views) * 100) : 0
    }));

    const techMap = new Map();
    projects.forEach(p => {
      p.technologies.forEach(tech => {
        techMap.set(tech, (techMap.get(tech) || 0) + 1);
      });
    });
    const topTechnologies = Array.from(techMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const recentActivity = [];
    projects.forEach(p => {
      p.responses.forEach(r => {
        recentActivity.push({
          type: 'response',
          message: `${r.user.name} responded to "${p.title}"`,
          timestamp: r.createdAt
        });
      });
    });
    recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      totalViews,
      totalResponses,
      totalSaves,
      engagementRate,
      projectStats,
      topTechnologies,
      recentActivity: recentActivity.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ BOOKMARKS & COLLECTIONS (Phase 2) ============
import Collection from './models/Collection.js';
import ProjectUpdate from './models/ProjectUpdate.js';

app.get('/api/bookmarks', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      saves: req.user._id
    })
    .populate('user', 'name title location')
    .populate('responses.user', 'name company userType')
    .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/collections', auth, async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user._id })
      .populate('projects')
      .sort({ createdAt: -1 });

    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/collections', auth, async (req, res) => {
  try {
    const { name, description } = req.body;

    const collection = new Collection({
      user: req.user._id,
      name,
      description
    });

    await collection.save();
    res.json(collection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/collections/:id/projects', auth, async (req, res) => {
  try {
    const { projectId } = req.body;

    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    if (!collection.projects.includes(projectId)) {
      collection.projects.push(projectId);
      await collection.save();
    }

    res.json(collection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Share collection (make public)
app.put('/api/collections/:id/share', auth, async (req, res) => {
  try {
    const { isPublic } = req.body;
    
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    collection.isPublic = isPublic;
    await collection.save();
    
    res.json(collection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get public collection by ID (shareable link)
app.get('/api/collections/shared/:id', async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      isPublic: true
    })
      .populate('user', 'name title')
      .populate({
        path: 'projects',
        populate: {
          path: 'user',
          select: 'name title location'
        }
      });

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found or not public' });
    }

    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all public collections
app.get('/api/collections/public', async (req, res) => {
  try {
    const collections = await Collection.find({ isPublic: true })
      .populate('user', 'name title')
      .populate('projects', 'title technologies')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects/:id/view', async (req, res) => {
  try {
    await Project.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ PROJECT UPDATES (Phase 2) ============

// Get updates for a project
app.get('/api/projects/:id/updates', async (req, res) => {
  try {
    const updates = await ProjectUpdate.find({ project: req.params.id })
      .populate('user', 'name title')
      .sort({ createdAt: -1 });
    
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project update
app.post('/api/projects/:id/updates', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Only project owner can post updates
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only project owner can post updates' });
    }
    
    const { title, content, version, updateType } = req.body;
    
    const update = new ProjectUpdate({
      project: req.params.id,
      user: req.user._id,
      title,
      content,
      version,
      updateType
    });
    
    await update.save();
    await update.populate('user', 'name title');
    
    // Notify users who saved this project
    const usersToNotify = project.saves.filter(
      userId => userId.toString() !== req.user._id.toString()
    );
    
    for (const userId of usersToNotify) {
      await createNotification(
        userId,
        'update',
        `${project.title} has a new update: ${title}`,
        project._id,
        req.user._id
      );
    }
    
    res.json(update);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all updates from projects user follows (saved)
app.get('/api/updates/feed', auth, async (req, res) => {
  try {
    const savedProjects = await Project.find({
      saves: req.user._id
    }).select('_id');
    
    const projectIds = savedProjects.map(p => p._id);
    
    const updates = await ProjectUpdate.find({
      project: { $in: projectIds }
    })
      .populate('user', 'name title')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
