import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import apiRouter, { ensureDefaults } from './routes/api.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const memoryStore = new session.MemoryStore();

app.disable('x-powered-by');

app.use(
  cors({
    origin: ['http://localhost:5173', CLIENT_URL],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure upload directories exist
const uploadDir = path.join(__dirname, 'uploads');
const screenshotsDir = path.join(__dirname, 'uploads', 'screenshots');
const teamDir = path.join(__dirname, 'uploads', 'team');

[uploadDir, screenshotsDir, teamDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

let sessionStore = memoryStore;
let databaseReady = false;
const isProduction = process.env.NODE_ENV === 'production';
app.set('databaseReady', databaseReady);

if (isProduction && process.env.MONGO_URI) {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    sessionStore = MongoStore.create({ mongoUrl: process.env.MONGO_URI });
    databaseReady = true;
    app.set('databaseReady', true);
    await ensureDefaults();
  } catch (error) {
    console.warn('MongoDB unavailable, starting in local fallback mode:', error.message);
  }
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dilatech_secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, databaseReady });
});

// Log all API requests
app.use('/api', (req, res, next) => {
  console.log(`→ ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api', apiRouter);

// 404 handler for undefined routes
app.use('/api/*', (req, res) => {
  console.error(`✗ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log(` Server is running on PORT: ${PORT}`);
  console.log('═══════════════════════════════════════');
  if (isProduction) {
    if (databaseReady) {
      console.log(' Database: CONNECTED');
    } else {
      console.log('  Database: FALLBACK MODE (local storage)');
    }
    console.log('═══════════════════════════════════════');
  } else if (!process.env.MONGO_URI) {
    console.log('  Database: FALLBACK MODE (local storage)');
    console.log('═══════════════════════════════════════');
  }
});

if (!isProduction && process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(async () => {
      databaseReady = true;
      app.set('databaseReady', true);
      await ensureDefaults();
      console.log('  Database: CONNECTED (MongoDB Atlas)');
      console.log('═══════════════════════════════════════');
    })
    .catch((error) => {
      app.set('databaseReady', false);
      console.log('  Database: FALLBACK MODE (local storage)');
      console.log('═══════════════════════════════════════');
      console.warn('MongoDB unavailable:', error.message);
    });
}
