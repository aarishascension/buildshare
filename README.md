# BuildFlow - MERN Stack Job Finding Platform

A modern fullstack application where developers showcase their projects and employers discover talent through meaningful engagement.

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Custom styling (no frameworks)

### Backend
- **Node.js & Express** - RESTful API server
- **MongoDB & Mongoose** - NoSQL database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 🚀 Features

- User authentication (developers & employers)
- Project showcase with rich details
- Real-time employer responses
- Save/bookmark projects
- Filter projects (All, Trending, Recent)
- Responsive design matching the original BuildFlow aesthetic

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### 1. Clone and Setup

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Create `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/buildflow
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### 3. Start MongoDB

```bash
# If using local MongoDB
mongod
```

Or use MongoDB Atlas and update the `MONGODB_URI` in `.env`

### 4. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Usage

1. **Register** as a Developer or Employer
2. **Developers** can:
   - Share projects with title, description, tech stack
   - Add demo and GitHub links
   - Specify what they're looking for (full-time, contract, etc.)
   - View employer responses
3. **Employers** can:
   - Browse developer projects
   - Respond to projects with opportunities
   - Mark responses as helpful
   - Save interesting projects

## 🎨 Design

The UI matches the original BuildFlow design with:
- Libre Baskerville serif font for headings
- Work Sans for body text
- Elegant cream and charcoal color scheme
- Smooth animations and transitions
- Fully responsive layout

## 📁 Project Structure

```
├── server/
│   ├── models/
│   │   ├── User.js
│   │   └── Project.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── NewPostModal.jsx
│   │   │   └── ProjectPost.jsx
│   │   ├── pages/
│   │   │   ├── Feed.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Input validation
- CORS configuration

## 🚢 Deployment

### Backend (Railway/Render/Heroku)
1. Set environment variables
2. Deploy from GitHub
3. Ensure MongoDB connection string is set

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Set API URL environment variable

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (developers only)
- `POST /api/projects/:id/responses` - Add response (employers only)
- `POST /api/projects/:id/save` - Toggle save project
- `POST /api/projects/:projectId/responses/:responseId/helpful` - Mark response helpful

## 🎓 Learning Outcomes

This project demonstrates:
- Full MERN stack development
- RESTful API design
- JWT authentication
- React hooks and context
- Component composition
- Responsive CSS design
- MongoDB schema design
- Protected routes
- Form handling and validation

## 📄 License

MIT License - Free for learning and portfolio use

---

**Built with ❤️ as a fullstack portfolio project**
