// ============ MESSAGING ROUTES ============
import Message from './models/Message.js';

// Get user conversations
app.get('/api/messages/conversations', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }]
    })
    .populate('sender recipient', 'name title')
    .sort({ createdAt: -1 });

    // Group by conversation
    const conversationsMap = new Map();
    
    messages.forEach(msg => {
      const otherId = msg.sender._id.toString() === req.user._id.toString() 
        ? msg.recipient._id.toString() 
        : msg.sender._id.toString();
      
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

    // Count unread messages
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

// Get messages in a conversation
app.get('/api/messages/:conversationId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    })
    .populate('sender recipient', 'name')
    .sort({ createdAt: 1 });

    // Mark as read
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

    // Create conversation ID (sorted user IDs)
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

    // Create notification
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

// ============ ANALYTICS ROUTES ============

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

    // Project stats
    const projectStats = projects.map(p => ({
      _id: p._id,
      title: p.title,
      views: p.views || 0,
      responseCount: p.responses.length,
      saveCount: p.saves.length,
      engagementRate: p.views > 0 ? Math.round((p.responses.length / p.views) * 100) : 0
    }));

    // Top technologies
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

    // Recent activity
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

// ============ BOOKMARKS & COLLECTIONS ROUTES ============
import Collection from './models/Collection.js';

// Get user bookmarks
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

// Get user collections
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

// Create collection
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

// Add project to collection
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

// Remove project from collection
app.delete('/api/collections/:id/projects/:projectId', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    collection.projects = collection.projects.filter(
      p => p.toString() !== req.params.projectId
    );
    await collection.save();

    res.json(collection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============ PROJECT VIEWS TRACKING ============

// Track project view
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
