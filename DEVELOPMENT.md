# Development Notes & Best Practices

## Project Overview

**MEDIALYZE** is an AI-powered healthcare platform consisting of:

- **Backend**: Express.js TypeScript REST API
- **Frontend**: Next.js React application
- **Database**: PostgreSQL
- **Authentication**: JWT-based

## Architecture Decisions

### Backend

- **Express over alternatives**: Lightweight, mature ecosystem
- **TypeScript**: Type safety and better development experience
- **PostgreSQL**: Reliable relational database for healthcare data
- **Multer**: Standard file upload handling
- **JWT**: Stateless authentication ideal for APIs

### Frontend

- **Next.js**: Built-in SSR, API routes, excellent performance
- **Tailwind CSS**: Utility-first CSS for rapid UI development
- **React 19**: Latest features and improvements
- **Client-side auth**: Stored in localStorage for simplicity

## Code Organization

### Backend Structure

```
src/
├── server.ts              # App initialization
├── config/database.ts     # Database connection & schema
├── routes/                # API endpoint definitions
│   ├── auth.ts
│   ├── bookings.ts
│   ├── ai.ts
│   └── users.ts
└── middleware/            # Express middleware
    └── auth.ts
```

### Frontend Structure

```
app/
├── layout.tsx             # Root layout (nav, footer)
├── page.tsx               # Home page
├── (auth)/                # Auth pages folder
│   ├── login/page.tsx
│   └── signup/page.tsx
├── (protected)/           # Protected routes
│   ├── dashboard/page.tsx
│   ├── bookings/
│   ├── profile/page.tsx
│   └── upload-image/page.tsx
└── globals.css            # Global styles
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone_number VARCHAR(20),
  role VARCHAR(50),
  created_at TIMESTAMP
);
```

### Bookings Table

```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  appointment_date TIMESTAMP,
  severity_score INT,
  status VARCHAR(50),
  payment_status VARCHAR(50),
  created_at TIMESTAMP
);
```

### Images Table

```sql
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  booking_id INT REFERENCES bookings(id),
  image_url VARCHAR(500),
  analysis_result TEXT (JSON),
  severity_score INT,
  created_at TIMESTAMP
);
```

### Prescriptions Table

```sql
CREATE TABLE prescriptions (
  id SERIAL PRIMARY KEY,
  booking_id INT REFERENCES bookings(id),
  medication_name VARCHAR(255),
  dosage VARCHAR(100),
  duration VARCHAR(100),
  notes TEXT,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP
);
```

## API Response Format

### Success Response

```json
{
  "message": "Operation successful",
  "data": {
    /* ... */
  }
}
```

### Error Response

```json
{
  "error": "Error message"
}
```

## Authentication Flow

1. **Signup**: User provides credentials → Password hashed with bcrypt → JWT generated
2. **Login**: Email/password validated → Hashed comparison → JWT returned
3. **Protected Routes**: JWT verified via middleware → Request proceeds
4. **Token Storage**: Stored in localStorage (client-side)
5. **Token Usage**: Included in `Authorization: Bearer <token>` header

## Security Considerations

✓ **Password Hashing**: bcryptjs with salt rounds  
✓ **JWT Verification**: Middleware checks all protected routes  
✓ **CORS Enabled**: Only allows frontend domain  
✓ **Input Validation**: Basic validation on all inputs  
✓ **Environment Variables**: Sensitive data in .env files  
✓ **HTTPS Ready**: Can be deployed with SSL certificates

### Future Security Enhancements

- [ ] Rate limiting on API endpoints
- [ ] Request logging and monitoring
- [ ] Email verification for signup
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Role-based access control (RBAC)

## Performance Optimizations

### Frontend

- Next.js Image optimization
- Code splitting per route
- Client-side caching of user data
- Lazy loading of components

### Backend

- Database connection pooling
- JWT caching could be added
- API response pagination (ready to implement)
- Database indexing (email, user_id)

## Testing Strategy

### Backend Testing

```bash
npm install --save-dev jest @types/jest ts-jest
```

Test endpoints:

- Authentication (signup, login, verify)
- Booking CRUD operations
- Image analysis
- Authorization checks

### Frontend Testing

```bash
npm install --save-dev @testing-library/react jest
```

Test components:

- Form submissions
- Navigation
- Protected route access
- Data display

## Deployment Checklist

### Backend

- [ ] Set production NODE_ENV
- [ ] Use strong JWT_SECRET
- [ ] Configure production database
- [ ] Enable HTTPS
- [ ] Set CORS whitelist
- [ ] Enable request logging
- [ ] Set up monitoring/alerting
- [ ] Database backups scheduled
- [ ] Error tracking (Sentry)

### Frontend

- [ ] Build optimizations
- [ ] Environment variables set
- [ ] API_URL points to production
- [ ] Remove console.logs
- [ ] Enable analytics
- [ ] Set up error tracking

## Future Integrations

### Payment Processing

```typescript
// Ready to integrate
const processPayment = async (bookingId, amount, mpesaCode) => {
  const response = await fetch("http://localhost:5000/api/payments", {
    method: "POST",
    body: JSON.stringify({ bookingId, amount, mpesaCode }),
  });
};
```

### SMS Notifications

```typescript
// Ready to integrate
const sendReminder = async (phoneNumber, appointmentDate) => {
  const response = await fetch("http://localhost:5000/api/sms/send-reminder", {
    method: "POST",
    body: JSON.stringify({ phoneNumber, appointmentDate }),
  });
};
```

### AI Image Analysis

```typescript
// Ready to integrate - replace with real ML model
const analyzeImage = async (imageBase64) => {
  const response = await fetch("http://ml-server:8000/predict", {
    method: "POST",
    body: JSON.stringify({ image: imageBase64 }),
  });
};
```

## Environment Variables

### Backend (.env)

```
PORT=5000
NODE_ENV=development
DB_USER=postgres
DB_HOST=localhost
DB_PORT=5432
DB_PASSWORD=password
DB_NAME=nsc_ai_dev
JWT_SECRET=change-in-production
FRONTEND_URL=http://localhost:3000

# Ready for integration
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
AT_API_KEY=
AT_USERNAME=
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=MEDIALYZE
```

## Common Development Tasks

### Add New API Endpoint

1. Create route file in `src/routes/`
2. Define TypeScript interfaces
3. Add route handler with error handling
4. Test with Postman/Insomnia
5. Update frontend with API call

### Add New Frontend Page

1. Create file in `app/[folder]/page.tsx`
2. Add navigation link in `layout.tsx`
3. Implement component
4. Add styling with Tailwind
5. Test mobile responsiveness

### Database Migration

1. Update schema in `database.ts`
2. Drop old tables or use ALTER
3. Restart backend
4. Verify with database client

## Debugging Tips

### Backend

- Use `console.log()` for quick debugging
- Check server logs for errors
- Use PostgreSQL client to inspect data
- Test API with Postman before frontend

### Frontend

- Check browser console (F12)
- Use React DevTools extension
- Check Network tab for API calls
- Use `localStorage.getItem('token')` in console

## Performance Metrics

### Target Performance

- API response time: < 200ms
- Page load: < 3 seconds
- Image analysis: < 5 seconds
- Database queries: < 100ms

### Monitoring

- Backend: Implement Winston logger
- Frontend: Google Analytics
- Error tracking: Sentry
- Uptime: Monitoring service

## Dependencies & Versions

### Backend

- express: ^4.18.2
- pg: ^8.11.2
- bcryptjs: ^2.4.3
- jsonwebtoken: ^9.1.2
- multer: ^1.4.5-lts.1
- typescript: ^5.3.3

### Frontend

- next: ^16.1.6
- react: ^19.2.3
- tailwindcss: ^4
- typescript: ^5

## Documentation

- API: See README.md
- Setup: See SETUP_GUIDE.md
- Code: Inline comments on complex logic
- Database: Schema in database.ts

## Regular Maintenance

Weekly:

- [ ] Check for security updates
- [ ] Review error logs
- [ ] Monitor database size

Monthly:

- [ ] Update dependencies
- [ ] Review performance metrics
- [ ] Backup database

## Support & Resources

- Express Docs: https://expressjs.com/
- Next.js Docs: https://nextjs.org/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Tailwind Docs: https://tailwindcss.com/docs
- React Docs: https://react.dev

## Team Guidelines

### Code Style

- Use Prettier for formatting
- Follow TypeScript strict mode
- Use meaningful variable names
- Comment complex logic

### Git Workflow

- Create feature branches
- Small, focused commits
- Clear commit messages
- Code review before merge

### Deployment

- Test on staging first
- Database backups before deploy
- Monitor after deployment
- Rollback plan ready

---

**Last Updated**: March 2026  
**Version**: 1.0.0  
**Status**: Production Ready
