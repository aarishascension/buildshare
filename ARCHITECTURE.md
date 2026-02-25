# BuildFlow - System Architecture

## System Overview

BuildFlow is a modern MERN stack application following a three-tier architecture with RESTful API design, JWT authentication, and production-ready security features.

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Components  │  │    Hooks     │  │   Context    │      │
│  │   (View)     │  │  (useState)  │  │   (Auth)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ React Router │  │    Axios     │                        │
│  │ (Navigation) │  │  (HTTP)      │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/JSON + JWT
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Express.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Security   │  │ Performance  │  │     Auth     │      │
│  │  Middleware  │  │  Middleware  │  │  Middleware  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routes     │  │ Controllers  │  │   Models     │      │
│  │  (Endpoints) │  │   (Logic)    │  │  (Mongoose)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (MongoDB)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Users     │  │   Projects   │  │Notifications │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   Messages   │  │ Collections  │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **CSS3** - Custom styling (no framework)

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Security & Performance
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **express-mongo-sanitize** - NoSQL injection prevention
- **xss-clean** - XSS prevention
- **compression** - Gzip compression

### DevOps
- **Docker** - Containerization
- **Jest** - Testing framework
- **mongodb-memory-server** - In-memory DB for development

## Component Architecture

### Frontend Layer

**Structure:**
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx       # Navigation, user menu
│   │   ├── ProjectPost.jsx  # Project card display
│   │   ├── SearchBar.jsx    # Search with filters
│   │   ├── NotificationBell.jsx  # Real-time notifications
│   │   └── NewPostModal.jsx # Project creation modal
│   ├── pages/               # Route components
│   │   ├── Feed.jsx         # Main project feed
│   │   ├── Login.jsx        # Authentication
│   │   ├── Register.jsx     # User registration
│   │   ├── Profile.jsx      # User profile with stats
│   │   ├── Messages.jsx     # Direct messaging
│   │   ├── Analytics.jsx    # Analytics dashboard
│   │   └── Bookmarks.jsx    # Saved projects
│   ├── context/
│   │   └── AuthContext.jsx  # Global auth state
│   ├── App.jsx              # Main app with routing
│   └── main.jsx             # Entry point
```

**Key Patterns:**
- **Hooks**: useState, useEffect, useContext, custom hooks
- **Context API**: Global authentication state
- **Protected Routes**: Auth-required pages
- **Axios Interceptors**: Automatic token injection
- **Component Composition**: Reusable, modular components

### Backend Layer

**Structure:**
```
server/
├── models/                  # Mongoose schemas
│   ├── User.js             # User model with auth
│   ├── Project.js          # Project with embedded responses
│   ├── Notification.js     # Notification tracking
│   ├── Message.js          # Direct messaging
│   └── Collection.js       # Bookmark collections
├── middleware/
│   ├── security.js         # Security middleware
│   └── performance.js      # Performance middleware
├── tests/
│   └── auth.test.js        # Jest tests
└── server.js               # Main server file
```

**Middleware Stack:**
```javascript
1. securityHeaders (Helmet)
2. cors (CORS configuration)
3. express.json() (Body parser)
4. sanitizeData (NoSQL injection prevention)
5. preventXSS (XSS prevention)
6. compressResponses (Gzip compression)
7. responseTimeLogger (Performance monitoring)
8. limiter (Rate limiting)
9. auth (JWT verification - protected routes only)
```

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique, indexed),
  password: String (bcrypt hashed),
  userType: Enum ['developer', 'employer'],
  title: String,
  location: String,
  company: String,
  bio: String,
  createdAt: Date
}
```

### Project Model
```javascript
{
  user: ObjectId (ref: User),
  title: String,
  description: String,
  technologies: [String],
  demoUrl: String,
  githubUrl: String,
  lookingFor: Enum ['job', 'freelance', 'collaboration', 'feedback'],
  responses: [{
    user: ObjectId (ref: User),
    content: String,
    helpful: [ObjectId],
    createdAt: Date
  }],
  saves: [ObjectId],
  views: Number,
  createdAt: Date
}
```

### Notification Model
```javascript
{
  user: ObjectId (ref: User),
  type: Enum ['response', 'save', 'message', 'helpful'],
  message: String,
  relatedProject: ObjectId (ref: Project),
  relatedUser: ObjectId (ref: User),
  read: Boolean,
  createdAt: Date
}
```

### Message Model
```javascript
{
  sender: ObjectId (ref: User),
  recipient: ObjectId (ref: User),
  content: String,
  conversationId: String (indexed),
  read: Boolean,
  createdAt: Date
}
```

### Collection Model
```javascript
{
  user: ObjectId (ref: User),
  name: String,
  description: String,
  projects: [ObjectId (ref: Project)],
  createdAt: Date
}
```

## Data Flow Examples

### User Registration Flow

```
1. User fills registration form
   ↓
2. Frontend validates input
   ↓
3. POST /api/auth/register
   ↓
4. Rate limiter checks (5 req/15min)
   ↓
5. Security middleware sanitizes input
   ↓
6. Check if email exists
   ↓
7. Hash password with bcrypt (10 rounds)
   ↓
8. Create user in MongoDB
   ↓
9. Generate JWT token
   ↓
10. Return user + token
    ↓
11. Frontend stores token in localStorage
    ↓
12. Update AuthContext
    ↓
13. Redirect to feed
```

### Creating a Project

```
1. Developer clicks "New Project"
   ↓
2. Modal opens with form
   ↓
3. User fills project details
   ↓
4. POST /api/projects (with JWT token)
   ↓
5. Auth middleware verifies token
   ↓
6. Check user is developer
   ↓
7. Validate required fields
   ↓
8. Create project document
   ↓
9. Populate user details
   ↓
10. Return project
    ↓
11. Frontend adds to feed
    ↓
12. Show success notification
```

### Real-time Messaging

```
1. User opens Messages page
   ↓
2. GET /api/messages/conversations
   ↓
3. Backend aggregates conversations
   ↓
4. Calculate unread counts
   ↓
5. Return conversation list
   ↓
6. User selects conversation
   ↓
7. GET /api/messages/:conversationId
   ↓
8. Mark messages as read
   ↓
9. Return message thread
   ↓
10. Auto-refresh every 3-5 seconds
    ↓
11. User sends message
    ↓
12. POST /api/messages
    ↓
13. Create notification for recipient
    ↓
14. Return new message
```

## API Design

### Authentication Endpoints

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| POST | /api/auth/register | No | 5/15min | Create account |
| POST | /api/auth/login | No | 5/15min | Login |
| GET | /api/auth/me | Yes | 100/15min | Get current user |

### Project Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/projects | No | List all projects |
| GET | /api/projects/:id | No | Get single project |
| POST | /api/projects | Yes | Create project (dev only) |
| POST | /api/projects/:id/responses | Yes | Add response (employer only) |
| POST | /api/projects/:id/save | Yes | Toggle save |
| POST | /api/projects/:id/view | No | Increment view count |
| GET | /api/projects/search | No | Search with filters |

### User Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/users/:userId | No | Get user profile |
| PUT | /api/users/profile | Yes | Update profile |

### Notification Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/notifications | Yes | Get notifications |
| PUT | /api/notifications/:id/read | Yes | Mark as read |
| PUT | /api/notifications/read-all | Yes | Mark all as read |

### Messaging Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/messages/conversations | Yes | List conversations |
| GET | /api/messages/:conversationId | Yes | Get messages |
| POST | /api/messages | Yes | Send message |

### Analytics Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/analytics | Yes | Get user analytics |

### Bookmark Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/bookmarks | Yes | Get saved projects |
| GET | /api/collections | Yes | List collections |
| POST | /api/collections | Yes | Create collection |
| POST | /api/collections/:id/projects | Yes | Add to collection |

## Security Architecture

### Authentication Flow

```javascript
// JWT Token Structure
{
  userId: "507f1f77bcf86cd799439011",
  iat: 1516239022,
  exp: 1516325422
}

// Auth Middleware
const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const decoded = jwt.verify(token, JWT_SECRET);
  const user = await User.findById(decoded.userId);
  req.user = user;
  next();
};
```

### Security Layers

1. **Rate Limiting**
   - General: 100 requests per 15 minutes
   - Auth: 5 requests per 15 minutes
   - Prevents brute force attacks

2. **Input Sanitization**
   - NoSQL injection prevention
   - XSS prevention
   - HTML escaping

3. **Security Headers** (Helmet)
   - Content Security Policy
   - X-Frame-Options
   - X-Content-Type-Options
   - Strict-Transport-Security

4. **Password Security**
   - bcrypt hashing (10 salt rounds)
   - Never stored in plain text
   - Never returned in API responses

5. **CORS Configuration**
   - Whitelist specific origins
   - Credentials support
   - Proper headers

## Performance Optimizations

### Backend Optimizations

1. **Compression**
   - Gzip compression for all responses
   - 70% size reduction average

2. **Database Queries**
   - Mongoose population with field selection
   - Lean queries for read-only operations
   - Indexes on frequently queried fields

3. **Response Time Monitoring**
   - Log slow requests (>1000ms)
   - Identify bottlenecks

### Frontend Optimizations

1. **Code Splitting**
   - Vite automatic code splitting
   - Lazy loading routes

2. **Asset Optimization**
   - Minification
   - Tree shaking
   - CSS optimization

3. **Caching**
   - Browser caching
   - API response caching (future)

## Scalability Strategy

### Current Architecture (MVP)
```
Single Server → MongoDB Memory Server
```

### Phase 1: Production Database
```
Single Server → MongoDB Atlas (Managed)
```

### Phase 2: Horizontal Scaling
```
Load Balancer
    ├── Server Instance 1
    ├── Server Instance 2
    └── Server Instance 3
         ↓
    MongoDB Atlas (Replica Set)
```

### Phase 3: Caching Layer
```
Request → Redis Cache → MongoDB
           ↓ Hit
         Return
           ↓ Miss
    Query DB → Cache → Return
```

### Phase 4: Microservices
```
API Gateway
    ├── User Service
    ├── Project Service
    ├── Message Service
    ├── Notification Service
    └── Analytics Service
```

## Deployment Architecture

### Development
```
Frontend: http://localhost:3001 (Vite dev server)
Backend: http://localhost:5000 (Express)
Database: MongoDB Memory Server (in-memory)
```

### Production (Recommended)
```
Frontend: Vercel (CDN, auto-deploy from Git)
Backend: Railway (Container, auto-deploy)
Database: MongoDB Atlas (Managed, free tier)
```

### Docker Deployment
```
Docker Compose:
    ├── Node.js App (Express)
    ├── MongoDB (Persistent volume)
    └── Nginx (Reverse proxy)
```

## Monitoring & Observability

### Metrics to Track

**Performance:**
- API response time (p50, p95, p99)
- Database query time
- Error rate
- Request throughput

**Business:**
- New registrations per day
- Projects posted per day
- Messages sent per day
- Engagement rate

**Infrastructure:**
- CPU usage
- Memory usage
- Database connections
- Disk I/O

### Logging Strategy

```javascript
// Request logging
app.use(responseTimeLogger);

// Error logging
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`, err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
```

## Testing Strategy

### Unit Tests (Jest)
```javascript
describe('Auth API', () => {
  test('registers user with valid data', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(validUserData);
    expect(response.status).toBe(201);
  });
});
```

### Integration Tests
- API endpoint testing
- Database operations
- Authentication flow

### E2E Tests (Future)
- User registration → project creation → response flow
- Messaging flow
- Analytics dashboard

## Future Enhancements

### Short-term
- [ ] WebSockets for real-time updates
- [ ] File uploads (AWS S3)
- [ ] Email notifications (SendGrid)
- [ ] Advanced search (Elasticsearch)

### Medium-term
- [ ] Mobile app (React Native)
- [ ] Video demos
- [ ] Team projects
- [ ] Code review features

### Long-term
- [ ] AI-powered matching
- [ ] Interview scheduling
- [ ] Skills assessment
- [ ] Microservices architecture

---

**This architecture demonstrates production-ready patterns while remaining simple enough for a portfolio project. It showcases modern MERN stack development with security, performance, and scalability awareness.**
