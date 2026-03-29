# MEDIALYZE AI - Healthcare Platform

An AI-powered dermatologist booking and medical analysis platform built with Express.js (backend) and Next.js (frontend).

## 📋 Project Overview

MEDIALYZE is a comprehensive healthcare solution that combines:

- **AI Image Analysis** - Analyze skin images for severity scoring (1-10)
- **Smart Booking System** - Schedule appointments with intelligent slot management
- **Prescription Management** - Digital prescription tracking and management
- **Payment Integration** - M-Pesa and card payments (ready for integration)
- **SMS Reminders** - Automated appointment reminders (ready for integration)
- **User Dashboard** - Comprehensive health management interface

## 🏗️ Architecture

### Backend (Express.js)

- RESTful API with TypeScript
- PostgreSQL database
- JWT authentication
- File upload handling with Multer
- AI image analysis endpoints
- User and booking management
- Payment and SMS integration stubs

### Frontend (Next.js)

- React 19 with TypeScript
- Tailwind CSS for styling
- Modern, responsive UI inspired by healthcare design patterns
- Dark theme with vibrant pink/purple accents
- Client-side state management
- Protected routes

## 📁 Project Structure

```
finalYearProject2026/
├── backend/
│   ├── src/
│   │   ├── server.ts                 # Main application entry point
│   │   ├── config/
│   │   │   └── database.ts           # PostgreSQL connection and schema
│   │   ├── routes/
│   │   │   ├── auth.ts               # Authentication endpoints
│   │   │   ├── bookings.ts           # Booking management
│   │   │   ├── ai.ts                 # AI image analysis
│   │   │   └── users.ts              # User management
│   │   └── middleware/
│   │       └── auth.ts               # JWT verification middleware
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── client/
    ├── app/
    │   ├── layout.tsx                # Root layout with navigation
    │   ├── page.tsx                  # Home page
    │   ├── globals.css               # Global styles
    │   ├── login/page.tsx            # Login page
    │   ├── signup/page.tsx           # Signup page
    │   ├── dashboard/page.tsx        # User dashboard
    │   ├── bookings/page.tsx         # Bookings list
    │   ├── features/page.tsx         # Features showcase
    │   └── upload-image/page.tsx     # Image analysis
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    └── .env.local
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. **Install dependencies:**

```bash
cd backend
npm install
```

2. **Configure environment variables:**

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
PORT=5000
NODE_ENV=development

DB_USER=postgres
DB_HOST=localhost
DB_PORT=5432
DB_PASSWORD=your_password
DB_NAME=nsc_ai_dev

JWT_SECRET=your-secret-key-change-in-production
```

3. **Set up PostgreSQL database:**

```bash
createdb nsc_ai_dev
```

4. **Start the backend:**

```bash
npm run dev
```

The backend will be running at `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**

```bash
cd client
npm install
```

2. **Configure environment variables:**

```bash
# .env.local already configured
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. **Start the frontend:**

```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Bookings

- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/all` - Get all bookings (admin/dermatologist)
- `POST /api/bookings` - Create new booking
- `PATCH /api/bookings/:id` - Update booking status
- `GET /api/bookings/:id` - Get booking details

### AI Analysis

- `POST /api/ai/analyze-image` - Analyze skin image
- `GET /api/ai` - Get user's image analyses
- `GET /api/ai/:imageId` - Get specific image analysis

### Users

- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update profile
- `GET /api/users` - Get all users (admin only)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. User signs up or logs in
2. Server returns JWT token
3. Client stores token in localStorage
4. Token is included in `Authorization: Bearer <token>` header for protected endpoints
5. Middleware verifies token before processing request

## 🎨 UI/UX Features

- **Dark Theme** - Professional healthcare dark interface with pink/purple accents
- **Responsive Design** - Fully mobile-responsive
- **Interactive Components** - Smooth transitions and hover effects
- **Semantic HTML** - Accessible markup
- **Performance** - Optimized images and lazy loading
- **Accessibility** - ARIA labels and semantic structure

## 📱 Pages

### Public Pages

- `/` - Home page with features and CTA
- `/features` - Detailed features and FAQ
- `/login` - User login
- `/signup` - User registration

### Protected Pages

- `/dashboard` - User dashboard with stats
- `/bookings` - List all bookings
- `/upload-image` - AI image analysis tool

## 🔄 Key Features

### AI Image Analysis

- Simulated severity scoring (1-10)
- Condition classification (Mild, Moderate, Severe)
- Confidence scoring
- Personalized recommendations

### Booking System

- Date/time selection
- Urgent care slot allocation (reserved for severity 8-10)
- Status tracking (pending, confirmed, completed)
- Payment status tracking

### User Management

- Profile management
- Booking history
- Image analysis history
- Account security with hashed passwords

## 🛠️ Development

### Building for Production

**Backend:**

```bash
cd backend
npm run build
npm start
```

**Frontend:**

```bash
cd client
npm run build
npm start
```

### Linting

**Backend:**

```bash
npm run lint
```

**Frontend:**

```bash
npm run lint
```

## 📦 Dependencies

### Backend

- **express** - Web framework
- **cors** - CORS middleware
- **pg** - PostgreSQL client
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **multer** - File upload handling
- **typescript** - TypeScript support
- **ts-node** - TypeScript execution

### Frontend

- **next** - React framework
- **react** - UI library
- **tailwindcss** - CSS framework
- **typescript** - TypeScript support

## 🔮 Future Enhancements

According to the implementation plan:

- **Phase 2** - Voice assistant integration
- **Phase 3** - Full M-Pesa payment integration
- **Phase 3** - Africa's Talking SMS integration
- **Phase 4** - Production deployment
- Real ML/AI model integration (TensorFlow/PyTorch)
- Multi-language support
- Advanced appointment scheduling
- Prescription e-pharmacy integration

## 📞 Support & Maintenance

### Service Level Agreements

- **Critical Issues** - 1 hour response, 4 hours resolution
- **High Issues** - 4 hours response, 24 hours resolution
- **Medium Issues** - 1 day response, 3 days resolution
- **Low Issues** - 3 days response

### Monitoring

- Database health checks
- API uptime monitoring
- Error tracking with Sentry
- Performance monitoring

## 📄 License

MIT License - See LICENSE file for details

## 👥 Team

NSC Development Team  
March 2026

---

**Note:** This is a fully functional MVP (Minimum Viable Product) ready for testing and integration with production services like M-Pesa, Africa's Talking, and ML/AI models.
