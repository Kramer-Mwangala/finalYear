# Clerk Authentication Integration Guide - NSC Backend

## Overview

This guide shows how to integrate Clerk authentication into your Express backend. Clerk provides modern authentication with support for social login, MFA, and more.

---

## Step 1: Get Clerk Credentials

1. **Create Clerk Account**
   - Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
   - Sign up for a free account

2. **Create a New Application**
   - Click "Create Application"
   - Select your preferred authentication methods (Email, Google, Apple, etc.)
   - Copy your credentials from the Clerk Dashboard

3. **Copy Your Keys**
   - **Secret Key**: Found in Dashboard → API Keys → Secret Key
   - **Publishable Key**: Found in Dashboard → API Keys → Publishable Key

---

## Step 2: Configure Environment Variables

1. **Create `.env` file** in the `backend/` directory:

   ```bash
   cp .env.example .env
   ```

2. **Add Clerk credentials to `.env`**:
   ```env
   # Clerk Authentication
   CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here
   CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
   ```

---

## Step 3: Protected Routes Setup

### Using `authenticateUser` (Recommended for Hybrid)

Supports both Clerk and JWT tokens:

```javascript
import { authenticateUser } from "../middleware/auth.js";

router.get("/profile", authenticateUser, (req, res) => {
  // req.user contains: { id, clerkId, email }
  res.json({ user: req.user });
});
```

### Using Clerk-Only Protection

For routes that require Clerk only:

```javascript
import { clerkAuth } from "../middleware/auth.js";

router.post("/admin/update", clerkAuth, (req, res) => {
  const userId = req.auth.userId;
  // Your logic here
});
```

### With Role-Based Access Control

```javascript
import { authenticateUser, authorizeRole } from "../middleware/auth.js";

router.delete(
  "/admin/users/:id",
  authenticateUser,
  authorizeRole("admin"),
  (req, res) => {
    // Only authenticated admin users can access
    res.json({ success: true });
  },
);
```

---

## Step 4: Sync User Data with MongoDB

When a new user is created in Clerk, sync them to your MongoDB `User` model:

**Example in your auth route:**

```javascript
import { User } from "../config/database.js";

// After Clerk user is created (via frontend)
async function syncClerkUser(
  clerkUserId,
  email,
  firstName,
  lastName,
  phoneNumber,
) {
  try {
    const existingUser = await User.findOne({ clerkId: clerkUserId });

    if (!existingUser) {
      const newUser = new User({
        clerkId: clerkUserId,
        email,
        firstName,
        lastName,
        phoneNumber,
        role: "user",
      });
      await newUser.save();
    }

    return existingUser || newUser;
  } catch (error) {
    console.error("Error syncing user:", error);
  }
}
```

---

## Step 5: Update Protected Routes

### Example: Bookings Route

```javascript
import { Router } from "express";
import { authenticateUser, authorizeRole } from "../middleware/auth.js";

const router = Router();

// All booking routes now require authentication
router.use(authenticateUser);

// Create booking
router.post("/", async (req, res) => {
  const userId = req.user.id; // or req.user.clerkId for Clerk users
  const { appointmentDate, dermatologistId } = req.body;

  // Your booking logic
  res.json({ success: true, booking: {...} });
});

// Get user's bookings
router.get("/my-bookings", async (req, res) => {
  const userId = req.user.id;

  // Fetch bookings for this user
  res.json({ bookings: [...] });
});

export default router;
```

### Example: Admin Route

```javascript
// Only admin users can access
router.delete("/admin/users/:id", authorizeRole("admin"), async (req, res) => {
  const userId = req.params.id;

  // Delete user logic
  res.json({ success: true });
});
```

---

## Step 6: Update Auth Routes (if migrating)

If migrating from JWT-only auth, update your auth routes:

```javascript
// Old JWT-based login - can be deprecated
router.post("/login-jwt", async (req, res) => {
  // Legacy JWT login logic
  // Eventually remove this when fully migrated to Clerk
});

// New Clerk sync endpoint
router.post("/sync-clerk-user", authenticateUser, async (req, res) => {
  const { email, firstName, lastName, phoneNumber } = req.body;

  const user = await syncClerkUser(
    req.user.clerkId,
    email,
    firstName,
    lastName,
    phoneNumber,
  );

  res.json({ user });
});
```

---

## Step 7: Test the Integration

### Test with cURL:

```bash
# Assuming you have a Clerk token
curl -H "Authorization: Bearer <clerk_token>" \
  http://localhost:5000/api/users/profile
```

### Test with JavaScript:

```javascript
// Frontend sends Clerk token
const response = await fetch("http://localhost:5000/api/users/profile", {
  headers: {
    Authorization: `Bearer ${clerkToken}`,
  },
});
console.log(await response.json());
```

---

## Step 8: Webhooks (Optional but Recommended)

For automatic user sync when Clerk users are created/updated:

1. **Enable Webhooks in Clerk Dashboard**
   - Go to Dashboard → Webhooks
   - Create endpoint to: `https://your-backend.com/api/webhooks/clerk`
   - Select events: `user.created`, `user.updated`, `user.deleted`

2. **Create Webhook Handler:**

```javascript
import express from "express";
import { Webhook } from "svix";

const router = express.Router();

router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    const wh = new Webhook(WEBHOOK_SECRET);

    try {
      const evt = wh.verify(req.body, req.headers);

      if (evt.type === "user.created") {
        // Sync new Clerk user to MongoDB
        const userData = evt.data;
        // Sync logic here
      }

      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: "Webhook verification failed" });
    }
  },
);

export default router;
```

---

## Common Issues & Solutions

### Issue: "Missing CLERK_SECRET_KEY"

**Solution:** Ensure `.env` file exists in `backend/` directory with proper Clerk keys

### Issue: "Bearer token is invalid"

**Solution:** Ensure the token is being sent from frontend and your Clerk publishable key is correct

### Issue: "Authorization header is missing"

**Solution:** Check that your frontend is sending the token in the correct format: `Authorization: Bearer <token>`

---

## Migration Path

### Phase 1: Hybrid Mode (Current)

- Accept both Clerk tokens and JWT tokens
- Use `authenticateUser` middleware
- Both systems work simultaneously

### Phase 2: Clerk Primary

- Gradually migrate routes to Clerk-only
- Keep JWT as fallback for old integrations

### Phase 3: Clerk Only (Future)

- Remove all JWT-based auth
- Use only `clerkAuth` middleware

---

## Resources

- **Clerk Documentation**: https://clerk.com/docs
- **Express Integration**: https://clerk.com/docs/quickstarts/express
- **API Reference**: https://clerk.com/docs/reference/backend-api

---

## Next Steps

1. ✅ Copy Clerk keys to `.env`
2. ✅ Test with a simple endpoint using `authenticateUser`
3. ✅ Update all protected routes
4. ✅ Test end-to-end from frontend
5. ✅ Set up webhooks for user sync
6. ✅ Monitor logs for any authentication issues
