import bcrypt from 'bcrypt';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { generateAIProfile } from './openai';

declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

// PostgreSQL session store to prevent memory leaks
const PgSession = connectPg(session);
const sessionStore = new PgSession({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: true,
  tableName: 'sessions',
});

export const sessionConfig = {
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
};

export interface AuthRequest extends Request {
  userId?: number;
  user?: any;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.userId = user.id;
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Authentication error' });
  }
};

export const requirePremium = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (!req.user.isSubscribed || req.user.subscriptionTier !== 'premium') {
    return res.status(403).json({ 
      message: 'Premium subscription required',
      upgradeRequired: true,
      currentTier: req.user.subscriptionTier || 'free'
    });
  }

  next();
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};

export const requireCoach = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'coach' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Coach access required' });
  }

  next();
};

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function registerUser(userData: {
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  dexterity?: string;
  gender?: string;
  golfHandicap?: number;
  golfExperience?: string;
  goals?: string;
  bio?: string;
  subscriptionTier?: string;
  isSubscribed?: boolean;
}) {
  // Check if user already exists by username or email
  const existingUserByUsername = await storage.getUserByUsername(userData.username);
  if (existingUserByUsername) {
    throw new Error('Username already exists');
  }

  const existingUserByEmail = await storage.getUserByEmail(userData.email);
  if (existingUserByEmail) {
    throw new Error('Email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(userData.password);

  // Generate AI profile from bio if provided
  let aiGeneratedProfile = null;
  // TODO: Fix AI profile generation - temporarily disabled
  // if (userData.bio) {
  //   try {
  //     aiGeneratedProfile = await generateAIProfile(userData.bio, {
  //       username: userData.username,
  //       dexterity: userData.dexterity,
  //       gender: userData.gender,
  //       golfHandicap: userData.golfHandicap
  //     });
  //   } catch (error) {
  //     console.error('Failed to generate AI profile:', error);
  //     // Continue without AI profile if generation fails
  //   }
  // }

  // Create user
  const newUser = await storage.createUser({
    username: userData.username,
    firstName: userData.firstName || null,
    lastName: userData.lastName || null,
    email: userData.email,
    password: hashedPassword,
    dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
    dexterity: userData.dexterity || null,
    gender: userData.gender || null,
    golfHandicap: userData.golfHandicap || null,
    golfExperience: userData.golfExperience || null,
    goals: userData.goals || null,
    bio: userData.bio || null,
    aiGeneratedProfile,
    isSubscribed: userData.isSubscribed || false,
    subscriptionTier: userData.subscriptionTier || 'free'
  });

  return newUser;
}

export async function loginUser(email: string, password: string) {
  console.log('Login attempt for email:', email);
  const user = await storage.getUserByEmail(email);
  
  console.log('User found:', !!user, user ? 'with email: ' + user.email : 'not found');
  
  if (!user) {
    console.log('No user found with email:', email);
    throw new Error('Invalid email or password');
  }

  console.log('Verifying password for user:', user.username);
  const isValid = await verifyPassword(password, user.password);
  console.log('Password verification result:', isValid);

  if (!isValid) {
    console.log('Password verification failed for user:', user.username);
    throw new Error('Invalid email or password');
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;
  console.log('Login successful for user:', userWithoutPassword.username);
  return userWithoutPassword;
}