import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import path from 'node:path';
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
app.use('/api', apiRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`API listening on ${PORT}`);
  console.log(databaseReady ? 'Database connected.' : 'Database fallback mode enabled.');
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
      console.log('MongoDB connected in development mode.');
    })
    .catch((error) => {
      app.set('databaseReady', false);
      console.warn('MongoDB unavailable in development mode:', error.message);
    });
}
