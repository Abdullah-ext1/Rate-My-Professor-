# Rate Professor

A comprehensive platform for students to rate and review professors, share resources, and collaborate with peers.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## ✨ Features

### Core Features
- **Professor Reviews & Ratings** - Rate and review professors with detailed feedback
- **Feed & Posts** - Share experiences, tips, and resources with the community
- **Real-time Chat** - Direct messaging between students
- **Attendance Tracking** - Keep track of class attendance records
- **Previous Year Questions (PYQs)** - Access and share past exam papers
- **Leaderboard** - Gamification with community contribution rankings
- **Announcements** - College-wide announcements and updates

### Advanced Features
- **Admin Dashboard** - Manage content, users, and system settings
- **Moderator Tools** - Content moderation and community management
- **Push Notifications** - Real-time notifications for important updates
- **PWA Support** - Installable web app with offline capabilities
- **Google OAuth** - Easy sign-in with Google accounts
- **Real-time Updates** - Live updates using WebSockets (Socket.io)

## 🛠 Tech Stack

### Frontend
- **Framework:** React 19 with Vite
- **Styling:** Tailwind CSS + PostCSS
- **State Management:** React Query (@tanstack/react-query)
- **Routing:** React Router v7
- **Real-time:** Socket.io Client
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **UI Components:** Lucide React Icons
- **PWA:** Vite PWA Plugin
- **Linting:** ESLint

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + Passport.js
- **Social Auth:** Google OAuth 2.0
- **Real-time:** Socket.io
- **Push Notifications:** Web Push
- **Password Hashing:** bcrypt
- **Session Management:** Express-session
- **Dev Server:** Nodemon

## 📁 Project Structure

```
rateprofessor/
├── frontend/                 # React Vite application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components for routing
│   │   ├── context/         # React Context for state management
│   │   ├── utils/           # Utility functions and hooks
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── package.json
│
└── server/                   # Node.js Express server
    ├── src/
    │   ├── controller/      # Route controllers
    │   ├── models/          # Mongoose schemas
    │   ├── routes/          # API routes
    │   ├── middlewares/     # Express middlewares
    │   ├── socket/          # Socket.io events
    │   ├── db/              # Database configuration
    │   ├── utils/           # Utility functions
    │   ├── app.js           # Express app setup
    │   └── index.js         # Server entry point
    └── package.json
```

### Frontend Pages
- **LoginScreen** - Authentication page
- **OnBoardingScreen** - User setup and preferences
- **FeedScreen** - Main feed with posts
- **ProfessorsScreen** - Browse and search professors
- **RateProfessorScreen** - Submit professor ratings
- **ProfessorReviewsScreen** - View professor reviews
- **PYQsScreen** - Previous year questions repository
- **ChatScreen** - Direct messaging
- **AttendanceScreen** - Attendance tracking
- **AnnouncementScreen** - View announcements
- **LeaderboardScreen** - Community rankings
- **AdminScreen** - Admin dashboard
- **ModeratorDashboard** - Moderation tools
- **NotificationScreen** - Notification center
- **ProfileScreen** - User profile
- **PrivacyPolicyScreen** - Privacy information

### Backend Controllers
- `auth.controller.js` - Authentication & authorization
- `professor.controller.js` - Professor management
- `rating.controller.js` - Ratings and reviews
- `post.controller.js` - Feed posts
- `message.controller.js` - Direct messaging
- `attendance.controller.js` - Attendance tracking
- `pyqs.controller.js` - Previous year questions
- `comment.controller.js` - Comments on posts
- `announcement.controller.js` - Announcements
- `leaderboard.controller.js` - Rankings
- `notification.controller.js` - Notifications
- `college.controller.js` - College information

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas connection)
- Git

### Clone the Repository
```bash
git clone <repository-url>
cd rateprofessor
```

### Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Required variables:
# - MONGODB_URI=mongodb://...
# - JWT_SECRET=your_secret_key
# - GOOGLE_CLIENT_ID=your_google_client_id
# - GOOGLE_CLIENT_SECRET=your_google_client_secret
# - PORT=5000

# Start development server
npm run dev
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Required variables:
# - VITE_API_URL=http://localhost:5000

# Start development server
npm run dev

# Build for production
npm run build
```

## 💻 Development

### Frontend Development
```bash
cd frontend

# Start Vite dev server (typically runs on http://localhost:5173)
npm run dev

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development
```bash
cd server

# Start with Nodemon (auto-reload on changes)
npm run dev

# Start production server
npm start
```

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

**Backend:**
- `npm run dev` - Start development server with Nodemon
- `npm start` - Start production server

## 📦 Deployment

### Frontend Deployment (Vercel)
The frontend is configured for Vercel deployment:

```bash
cd frontend

# Build the application
npm run build

# Deploy to Vercel
vercel
```

See [vercel.json](frontend/vercel.json) for Vercel configuration.

### Backend Deployment
Deploy to your preferred hosting (Heroku, Railway, DigitalOcean, etc.):

1. Set environment variables on your hosting platform
2. Push to your hosting repository
3. Server will start with `npm start`

## 📡 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/google` - Google OAuth login
- `POST /api/auth/logout` - Logout user

### Professors
- `GET /api/professors` - Get all professors
- `GET /api/professors/:id` - Get professor details
- `POST /api/professors` - Create professor (admin)
- `PUT /api/professors/:id` - Update professor (admin)

### Ratings
- `POST /api/ratings` - Create rating
- `GET /api/ratings/:professorId` - Get professor ratings
- `PUT /api/ratings/:id` - Update rating
- `DELETE /api/ratings/:id` - Delete rating

### Posts
- `GET /api/posts` - Get feed posts
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Messages
- `GET /api/messages/:userId` - Get messages with user
- `POST /api/messages` - Send message
- `GET /api/conversations` - Get all conversations

### Additional Endpoints
- `/api/attendance` - Attendance tracking
- `/api/pyqs` - Previous year questions
- `/api/announcements` - Announcements
- `/api/comments` - Comments on posts
- `/api/leaderboard` - Leaderboard rankings
- `/api/notifications` - Notifications

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Google OAuth 2.0 integration
- CORS protection
- Session management
- Role-based access control (Admin, Moderator, User)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👨‍💻 Author

**Ammar Shaikh**

## 📧 Support

For support, please contact the development team or open an issue on the repository.

---

**Last Updated:** May 2026
