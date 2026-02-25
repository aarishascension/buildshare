import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Message from '../models/Message.js';

const JWT_SECRET = process.env.JWT_SECRET || 'buildflow-secret-key-2024';

describe('Messaging API Tests', () => {
  let mongoServer;
  let user1Token;
  let user2Token;
  let user1Id;
  let user2Id;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user1 = await User.create({
      name: 'User One',
      email: 'user1@test.com',
      password: hashedPassword,
      userType: 'developer'
    });
    user1Id = user1._id;
    user1Token = jwt.sign({ userId: user1._id }, JWT_SECRET);

    const user2 = await User.create({
      name: 'User Two',
      email: 'user2@test.com',
      password: hashedPassword,
      userType: 'employer'
    });
    user2Id = user2._id;
    user2Token = jwt.sign({ userId: user2._id }, JWT_SECRET);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Message.deleteMany({});
  });

  describe('POST /api/messages', () => {
    it('should send a message', async () => {
      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          recipientId: user2Id,
          content: 'Hello, this is a test message'
        });

      expect(response.status).toBe(200);
      expect(response.body.content).toBe('Hello, this is a test message');
      expect(response.body.sender._id).toBe(user1Id.toString());
      expect(response.body.recipient._id).toBe(user2Id.toString());
    });

    it('should create consistent conversation ID', async () => {
      // Send message from user1 to user2
      const response1 = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          recipientId: user2Id,
          content: 'Message 1'
        });

      // Send message from user2 to user1
      const response2 = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          recipientId: user1Id,
          content: 'Message 2'
        });

      expect(response1.body.conversationId).toBe(response2.body.conversationId);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/messages')
        .send({
          recipientId: user2Id,
          content: 'Test'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/messages/conversations', () => {
    beforeEach(async () => {
      // Create some messages
      const ids = [user1Id.toString(), user2Id.toString()].sort();
      const conversationId = `${ids[0]}_${ids[1]}`;

      await Message.create({
        sender: user1Id,
        recipient: user2Id,
        content: 'Hello',
        conversationId
      });

      await Message.create({
        sender: user2Id,
        recipient: user1Id,
        content: 'Hi there',
        conversationId
      });
    });

    it('should get user conversations', async () => {
      const response = await request(app)
        .get('/api/messages/conversations')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].lastMessage).toBeTruthy();
    });

    it('should include unread count', async () => {
      const response = await request(app)
        .get('/api/messages/conversations')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty('unreadCount');
    });
  });

  describe('GET /api/messages/:conversationId', () => {
    let conversationId;

    beforeEach(async () => {
      const ids = [user1Id.toString(), user2Id.toString()].sort();
      conversationId = `${ids[0]}_${ids[1]}`;

      await Message.create({
        sender: user1Id,
        recipient: user2Id,
        content: 'Message 1',
        conversationId,
        read: false
      });

      await Message.create({
        sender: user2Id,
        recipient: user1Id,
        content: 'Message 2',
        conversationId,
        read: false
      });
    });

    it('should get messages in conversation', async () => {
      const response = await request(app)
        .get(`/api/messages/${conversationId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should mark messages as read', async () => {
      await request(app)
        .get(`/api/messages/${conversationId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      const messages = await Message.find({
        conversationId,
        recipient: user1Id
      });

      expect(messages[0].read).toBe(true);
    });
  });
});
