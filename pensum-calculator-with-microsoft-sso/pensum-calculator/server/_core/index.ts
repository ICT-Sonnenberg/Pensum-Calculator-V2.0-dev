import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from '../routers.js';
import { createContext } from './trpc.js';
import { configureMicrosoftAuth } from './microsoftAuth.js';
import { ENV } from './env.js';
import { getUserByMicrosoftId } from '../db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: ENV.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
configureMicrosoftAuth();

// Microsoft OAuth routes
app.get('/api/auth/microsoft', passport.authenticate('microsoft'));

app.get(
  '/api/auth/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: '/' }),
  async (req, res) => {
    // User is authenticated, redirect to dashboard
    const user = req.user as any;
    if (user?.microsoftId) {
      const dbUser = await getUserByMicrosoftId(user.microsoftId);
      (req as any).user = dbUser;
    }
    res.redirect('/dashboard');
  }
);

// tRPC middleware
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
