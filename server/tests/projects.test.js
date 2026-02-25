import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Project from '../models/Project.js';

// Note: Import app without starting the server
// You'll need to export app separately from server.js

const JWT_SECRET = process.env.JWT_SECRET || 'buildflow-secret-key-2024';

describe('Project API Tests', () => {
  let mongoServer;
  let developerToken;
  let employerToken;
  let developerId;
  let employerId;
  let projectId;

  beforeAll(async () => {
    // Setup in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const developer = await User.create({
      name: 'Test Developer',
      email: 'dev@test.com',
      password: hashedPassword,
      userType: 'developer',
      title: 'Full Stack Developer',
      location: 'San Francisco'
    });
    developerId = developer._id;
    developerToken = jwt.sign({ userId: developer._id }, JWT_SECRET);

    const employer = await User.create({
      name: 'Test Employer',
      email: 'employer@test.com',
      password: hashedPassword,
      userType: 'employer',
      company: 'Tech Corp',
      location: 'New York'
    });
    employerId = employer._id;
    employerToken = jwt.sign({ userId: employer._id }, JWT_SECRET);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Project.deleteMany({});
  });

  describe('POST /api/projects', () => {
    it('should create a project as developer', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'A test project description',
        technologies: ['React', 'Node.js', 'MongoDB'],
        demoUrl: 'https://demo.com',
        githubUrl: 'https://github.com/test',
        lookingFor: 'job'
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${developerToken}`)
        .send(projectData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(projectData.title);
      expect(response.body.user._id).toBe(developerId.toString());
      projectId = response.body._id;
    });

    it('should not allow employer to create project', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'A test project',
        technologies: ['React'],
        lookingFor: 'job'
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${employerToken}`)
        .send(projectData);

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Only developers');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({ title: 'Test' });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/projects', () => {
    beforeEach(async () => {
      await Project.create({
        user: developerId,
        title: 'Project 1',
        description: 'Description 1',
        technologies: ['React'],
        lookingFor: 'job'
      });

      await Project.create({
        user: developerId,
        title: 'Project 2',
        description: 'Description 2',
        technologies: ['Vue'],
        lookingFor: 'freelance'
      });
    });

    it('should get all projects', async () => {
      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should filter projects by technology', async () => {
      const response = await request(app)
        .get('/api/projects/search?technology=React');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Project 1');
    });
  });

  describe('POST /api/projects/:id/responses', () => {
    beforeEach(async () => {
      const project = await Project.create({
        user: developerId,
        title: 'Test Project',
        description: 'Description',
        technologies: ['React'],
        lookingFor: 'job'
      });
      projectId = project._id;
    });

    it('should allow employer to respond', async () => {
      const response = await request(app)
        .post(`/api/projects/${projectId}/responses`)
        .set('Authorization', `Bearer ${employerToken}`)
        .send({ content: 'Great project! Interested in hiring.' });

      expect(response.status).toBe(200);
      expect(response.body.responses).toHaveLength(1);
      expect(response.body.responses[0].content).toContain('Great project');
    });

    it('should not allow developer to respond', async () => {
      const response = await request(app)
        .post(`/api/projects/${projectId}/responses`)
        .set('Authorization', `Bearer ${developerToken}`)
        .send({ content: 'Test response' });

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/projects/:id/save', () => {
    beforeEach(async () => {
      const project = await Project.create({
        user: developerId,
        title: 'Test Project',
        description: 'Description',
        technologies: ['React'],
        lookingFor: 'job'
      });
      projectId = project._id;
    });

    it('should toggle save status', async () => {
      // Save project
      let response = await request(app)
        .post(`/api/projects/${projectId}/save`)
        .set('Authorization', `Bearer ${employerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.saved).toBe(true);

      // Unsave project
      response = await request(app)
        .post(`/api/projects/${projectId}/save`)
        .set('Authorization', `Bearer ${employerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.saved).toBe(false);
    });
  });
});
