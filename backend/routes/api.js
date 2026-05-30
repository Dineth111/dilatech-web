import express from 'express';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import App from '../models/App.js';
import SiteData from '../models/SiteData.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initialApps = [
  {
    id: 'dilatech-studio',
    name: 'diLA Studio',
    category: 'Productivity',
    shortDesc: 'Studio workflow tools for modern app teams.',
    fullDesc: 'A polished internal toolkit for planning releases, tracking product work, and coordinating app launches across the studio.',
    rating: 4.9,
    downloads: '128K+',
    iconClass: 'studio',
    iconBxi: 'bx-grid-alt',
    screenshots: [
      { src: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80', label: 'Dashboard' },
      { src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80', label: 'Planning' },
    ],
    playStoreUrl: 'https://play.google.com',
    appStoreUrl: 'https://www.apple.com/app-store/',
    features: ['Project planning', 'Team sync', 'Release tracking'],
    version: '1.0.0',
    size: '24 MB',
  },
  {
    id: 'focus-works',
    name: 'Focus Works',
    category: 'Productivity',
    shortDesc: 'Time blocking and deep-work sessions.',
    fullDesc: 'A distraction-control app built to keep makers and founders in flow with clean schedules and calm reminders.',
    rating: 4.8,
    downloads: '82K+',
    iconClass: 'focus',
    iconBxi: 'bx-time-five',
    screenshots: [
      { src: 'https://images.unsplash.com/photo-1522543558187-768b6df7c25c?auto=format&fit=crop&w=1200&q=80', label: 'Sessions' },
      { src: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80', label: 'Calendar' },
    ],
    playStoreUrl: 'https://play.google.com',
    appStoreUrl: 'https://www.apple.com/app-store/',
    features: ['Pomodoro flow', 'Task buckets', 'Daily focus score'],
    version: '1.1.0',
    size: '18 MB',
  },
  {
    id: 'money-mint',
    name: 'Money Mint',
    category: 'Finance',
    shortDesc: 'Simple expense tracking with insight cards.',
    fullDesc: 'A lightweight finance companion for expense logging, savings goals, and monthly budgeting.',
    rating: 4.7,
    downloads: '64K+',
    iconClass: 'finance',
    iconBxi: 'bx-wallet',
    screenshots: [
      { src: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80', label: 'Budget' },
      { src: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80', label: 'Insights' },
    ],
    playStoreUrl: 'https://play.google.com',
    appStoreUrl: 'https://www.apple.com/app-store/',
    features: ['Income tracking', 'Goal planner', 'Spending analytics'],
    version: '2.0.0',
    size: '21 MB',
  },
];

const defaultSiteData = {
  site_stats: {
    publishedApps: 12,
    downloads: '250K+',
    rating: 4.9,
    activeUsers: '18K+',
  },
  premium_settings: {
    monthly: 19,
    yearly: 189,
    discount: 17,
    plans: [
      {
        name: 'Starter',
        priceMonthly: 19,
        priceYearly: 189,
        features: ['1 app launch strategy', 'Basic support', 'Monthly insights'],
      },
      {
        name: 'Growth',
        priceMonthly: 49,
        priceYearly: 489,
        features: ['Brand strategy', 'Growth experiments', 'Priority support'],
      },
      {
        name: 'Scale',
        priceMonthly: 99,
        priceYearly: 989,
        features: ['Dedicated product team', 'Custom roadmap', 'Executive reporting'],
      },
    ],
    features: ['Dedicated strategists', 'Launch support', 'Priority feedback loops', 'Investor-ready polish'],
  },
  reviews: [
    { rating: 5, text: 'diLA Tech delivered a smooth app launch process and a very polished product.', name: 'A. Perera', title: 'Founder' },
    { rating: 5, text: 'The team understood our product vision and turned it into a clean experience.', name: 'N. Silva', title: 'Product Lead' },
    { rating: 4, text: 'Clear communication, quick delivery, and strong technical execution.', name: 'R. Fernando', title: 'Operations Manager' },
  ],
};

const memoryState = {
  apps: structuredClone(initialApps),
  siteData: new Map(Object.entries(defaultSiteData).map(([key, value]) => [key, structuredClone(value)])),
  contactMessages: [],
};

function getUploadDir() {
  return path.join(__dirname, '..', 'uploads', 'team');
}

function ensureUploadDir() {
  fs.mkdirSync(getUploadDir(), { recursive: true });
}

ensureUploadDir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, getUploadDir()),
  filename: (req, _file, cb) => cb(null, `${req.params.id}.jpg`),
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export function requireAdmin(req, res, next) {
  if (req.session?.isAdmin) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

async function ensureDefaults() {
  const appCount = await App.countDocuments();
  if (!appCount) {
    await App.insertMany(initialApps);
  }

  for (const [key, value] of Object.entries(defaultSiteData)) {
    const existing = await SiteData.findOne({ key });
    if (!existing) {
      await SiteData.create({ key, value });
    }
  }
}

function isDatabaseReady(req) {
  return req.app.get('databaseReady') === true;
}

function getAppsFallback() {
  return memoryState.apps.map((app) => structuredClone(app));
}

function setAppsFallback(nextApps) {
  memoryState.apps = nextApps.map((app) => structuredClone(app));
}

function getSiteValueFallback(key) {
  if (key === 'contact_messages') {
    return structuredClone(memoryState.contactMessages);
  }
  if (memoryState.siteData.has(key)) {
    return structuredClone(memoryState.siteData.get(key));
  }

  // If no in-memory value exists, fall back to the declared defaults
  // to keep the returned shape consistent with the database-backed path.
  if (Object.hasOwn(defaultSiteData, key)) {
    return structuredClone(defaultSiteData[key]);
  }

  return null;
}

function setSiteValueFallback(key, value) {
  if (key === 'contact_messages') {
    memoryState.contactMessages = structuredClone(Array.isArray(value) ? value : []);
    return;
  }
  memoryState.siteData.set(key, structuredClone(value));
}

router.get('/apps', async (req, res) => {
  if (!isDatabaseReady(req)) {
    return res.json(getAppsFallback());
  }

  const apps = await App.find().sort({ createdAt: -1 });
  res.json(apps.length ? apps : initialApps);
});

router.get('/apps/:id', async (req, res) => {
  if (!isDatabaseReady(req)) {
    const fallback = memoryState.apps.find((item) => item.id === req.params.id);
    if (fallback) {
      return res.json(structuredClone(fallback));
    }
    return res.status(404).json({ error: 'App not found' });
  }

  const app = await App.findOne({ id: req.params.id });
  if (app) {
    return res.json(app);
  }
  const fallback = initialApps.find((item) => item.id === req.params.id);
  if (fallback) {
    return res.json(fallback);
  }
  return res.status(404).json({ error: 'App not found' });
});

router.post('/apps', requireAdmin, async (req, res) => {
  if (!isDatabaseReady(req)) {
    const nextApp = req.body;
    setAppsFallback([...memoryState.apps.filter((item) => item.id !== nextApp.id), nextApp]);
    return res.status(201).json(nextApp);
  }

  const app = await App.create(req.body);
  res.status(201).json(app);
});

router.put('/apps/:id', requireAdmin, async (req, res) => {
  if (!isDatabaseReady(req)) {
    const nextApp = { ...req.body, id: req.params.id };
    setAppsFallback(memoryState.apps.map((item) => (item.id === req.params.id ? nextApp : item)));
    return res.json(nextApp);
  }

  const app = await App.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, upsert: true });
  res.json(app);
});

router.delete('/apps/:id', requireAdmin, async (req, res) => {
  if (!isDatabaseReady(req)) {
    setAppsFallback(memoryState.apps.filter((item) => item.id !== req.params.id));
    return res.json({ success: true });
  }

  await App.deleteOne({ id: req.params.id });
  res.json({ success: true });
});

router.get('/site-data/:key', async (req, res) => {
  if (!isDatabaseReady(req)) {
    return res.json(getSiteValueFallback(req.params.key));
  }

  const item = await SiteData.findOne({ key: req.params.key });
  if (item) {
    return res.json(item.value);
  }
  return res.json(defaultSiteData[req.params.key] ?? null);
});

router.post('/site-data/:key', requireAdmin, async (req, res) => {
  if (!isDatabaseReady(req)) {
    setSiteValueFallback(req.params.key, req.body.value);
    return res.json({ key: req.params.key, value: getSiteValueFallback(req.params.key) });
  }

  const item = await SiteData.findOneAndUpdate(
    { key: req.params.key },
    { key: req.params.key, value: req.body.value },
    { new: true, upsert: true }
  );
  res.json(item);
});

router.post('/team/photo/:id', requireAdmin, upload.single('photo'), async (req, res) => {
  res.json({ success: true, file: `/uploads/team/${req.params.id}.jpg` });
});

// Screenshot upload endpoint
const screenshotStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const screenshotDir = path.join(__dirname, '..', 'uploads', 'screenshots');
    fs.mkdirSync(screenshotDir, { recursive: true });
    cb(null, screenshotDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `screenshot-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const screenshotUpload = multer({
  storage: screenshotStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
});

// Screenshot upload endpoint
router.post('/upload/screenshot', requireAdmin, screenshotUpload.single('screenshot'), (req, res) => {
  try {
    if (!req.file) {
      console.error('✗ No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Return the correct URL path that matches the static file serving
    const fileUrl = `/uploads/screenshots/${req.file.filename}`;
    
    console.log('✓ Screenshot uploaded successfully:', fileUrl);
    console.log('  - Filename:', req.file.filename);
    console.log('  - Size:', req.file.size, 'bytes');
    console.log('  - Type:', req.file.mimetype);
    
    res.json({ 
      success: true, 
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size 
    });
  } catch (error) {
    console.error('✗ Upload handler error:', error);
    res.status(500).json({ error: 'Failed to upload screenshot' });
  }
});

router.post('/contact', async (req, res) => {
  const { name = '', email = '', message = '' } = req.body ?? {};
  const trimmedName = String(name).trim();
  const trimmedEmail = String(email).trim();
  const trimmedMessage = String(message).trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const entry = {
    id: req.body?.id || `msg-${Date.now()}`,
    name: trimmedName,
    email: trimmedEmail,
    message: trimmedMessage,
    createdAt: req.body?.createdAt || new Date().toISOString(),
  };

  if (!isDatabaseReady(req)) {
    const currentMessages = Array.isArray(memoryState.contactMessages) ? memoryState.contactMessages : [];
    memoryState.contactMessages = [entry, ...currentMessages].slice(0, 50);
    return res.json({ success: true });
  }

  const existing = await SiteData.findOne({ key: 'contact_messages' });
  const currentMessages = Array.isArray(existing?.value) ? existing.value : [];
  const nextMessages = [entry, ...currentMessages].slice(0, 50);

  await SiteData.findOneAndUpdate(
    { key: 'contact_messages' },
    { key: 'contact_messages', value: nextMessages },
    { new: true, upsert: true }
  );

  return res.json({ success: true });
});

router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body ?? {};
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return req.session.save(() => res.json({ success: true }));
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

router.post('/auth/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

router.get('/auth/me', (req, res) => {
  if (req.session?.isAdmin) {
    return res.json({ isAdmin: true });
  }
  return res.status(401).json({ isAdmin: false });
});

// Log all requests for debugging
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

export { ensureDefaults, initialApps, defaultSiteData };
export default router;
