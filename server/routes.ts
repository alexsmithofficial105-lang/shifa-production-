import express, { type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { getDb, saveDb } from './db.ts';
import { verifyPassword, hashPassword, createSession, verifySession, destroySession, getSession } from './auth.ts';
import type { Inquiry, ServiceItem, PortfolioItem, PackageItem, TestimonialItem, FaqItem, TeamMember } from './types.ts';

const router = express.Router();

// Ensure upload directory exists
const UPLOADS_DIR = path.resolve(process.cwd(), 'data', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanBase}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|mp4|webm|mov|svg/i;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.test(ext) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Allowed: Images and Video files.'));
    }
  },
});

// Middleware for admin protected routes
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || (req.query.token as string);

  if (!verifySession(token)) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
    return;
  }
  next();
}

// ----------------- AUTH ROUTES -----------------
// Strict allowlist: ONLY these 2 email addresses are permitted to access the admin panel.
const STRICT_ADMIN_EMAILS = [
  'shifaproductions.pk@gmail.com',
  'umairwyc@gmail.com',
];

router.post('/auth/login', (req: Request, res: Response): void => {
  const { email, password } = req.body;
  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Admin email is required.' });
    return;
  }

  const cleanEmail = email.trim().toLowerCase();

  // STRICT CHECK: Only these 2 emails, no other accounts allowed
  if (!STRICT_ADMIN_EMAILS.includes(cleanEmail)) {
    res.status(403).json({
      error: `Access Denied: "${cleanEmail}" is not authorized. ONLY shifaproductions.pk@gmail.com and umairwyc@gmail.com have access to this admin panel.`,
    });
    return;
  }

  if (!password || typeof password !== 'string') {
    res.status(400).json({ error: 'Admin password is required.' });
    return;
  }

  const db = getDb();
  const admin = db.admin;

  // Verify password: check against DB hash or master password 'ShifaAdmin2026!'
  const isValidPass =
    (admin.passwordHash && admin.salt && verifyPassword(password, admin.passwordHash, admin.salt)) ||
    password === 'ShifaAdmin2026!';

  if (!isValidPass) {
    res.status(401).json({ error: 'Incorrect password. Please enter the valid admin password.' });
    return;
  }

  const token = createSession(cleanEmail, cleanEmail === 'umairwyc@gmail.com' ? 'Umair' : 'Shifa Productions Admin');
  res.json({
    token,
    user: {
      username: cleanEmail === 'umairwyc@gmail.com' ? 'Umair' : 'Shifa Productions Admin',
      email: cleanEmail,
    },
  });
});

router.post('/auth/google', (req: Request, res: Response): void => {
  let { email, name, avatar, credential } = req.body;

  // If a JWT credential was supplied from Google One-Tap/GIS, decode payload
  if (credential && typeof credential === 'string') {
    try {
      const parts = credential.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
        if (payload.email) {
          email = payload.email;
          name = payload.name || name;
          avatar = payload.picture || avatar;
        }
      }
    } catch {
      // ignore decode error and use body values
    }
  }

  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Google account email is required' });
    return;
  }

  const cleanEmail = email.trim().toLowerCase();

  // Strict check: Only these 2 emails, no other accounts allowed
  if (!STRICT_ADMIN_EMAILS.includes(cleanEmail)) {
    res.status(403).json({
      error: `Access Denied: The Google account "${cleanEmail}" is not authorized. ONLY shifaproductions.pk@gmail.com and umairwyc@gmail.com are permitted to access this admin panel.`,
    });
    return;
  }

  const displayName = cleanEmail === 'umairwyc@gmail.com' ? 'Umair' : (name || 'Shifa Productions Admin');
  const token = createSession(cleanEmail, displayName, avatar);

  res.json({
    token,
    user: {
      username: displayName,
      email: cleanEmail,
      avatar: avatar || null,
      authProvider: 'google',
    },
  });
});

router.post('/auth/logout', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  destroySession(token);
  res.json({ success: true, message: 'Logged out successfully' });
});

router.get('/auth/me', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  const session = getSession(token);
  if (!session) {
    res.status(401).json({ authenticated: false });
    return;
  }
  const db = getDb();
  res.json({
    authenticated: true,
    user: {
      username: session.username || db.admin.username,
      email: session.email || db.admin.email,
      avatar: session.avatar || null,
    },
  });
});

router.post('/auth/change-password', requireAdmin, (req: Request, res: Response): void => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    res.status(400).json({ error: 'New password must be at least 6 characters long' });
    return;
  }

  const db = getDb();
  if (!verifyPassword(currentPassword, db.admin.passwordHash, db.admin.salt)) {
    res.status(400).json({ error: 'Current password does not match' });
    return;
  }

  const { hash, salt } = hashPassword(newPassword);
  db.admin.passwordHash = hash;
  db.admin.salt = salt;
  saveDb(db);

  res.json({ success: true, message: 'Admin password updated successfully' });
});

// ----------------- STATS & ANALYTICS ROUTES -----------------
function parseBudgetNumber(str: string): number {
  if (!str) return 400000;
  const numbers = str.match(/[\d,]+/g);
  if (!numbers || numbers.length === 0) return 400000;
  const parsed = numbers.map((n) => parseInt(n.replace(/,/g, ''), 10)).filter((n) => !isNaN(n) && n > 0);
  if (parsed.length === 0) return 400000;
  if (parsed.length === 1) return parsed[0];
  return Math.round((parsed[0] + parsed[1]) / 2);
}

router.get('/stats', requireAdmin, (_req: Request, res: Response): void => {
  const db = getDb();
  const inquiries = db.inquiries || [];
  const newInquiries = inquiries.filter((i) => i.status === 'New').length;
  const inDiscussion = inquiries.filter((i) => i.status === 'In Discussion').length;
  const confirmed = inquiries.filter((i) => i.status === 'Confirmed' || i.status === 'Completed').length;

  res.json({
    totalInquiries: inquiries.length,
    newInquiries,
    inDiscussion,
    confirmedProjects: confirmed,
    totalPortfolio: db.portfolio.length,
    totalServices: db.services.length,
  });
});

router.get('/analytics', requireAdmin, (_req: Request, res: Response): void => {
  const db = getDb();
  const inquiries = db.inquiries || [];
  const total = inquiries.length;

  // 1. Lead & Funnel Analytics
  const newCount = inquiries.filter((i) => i.status === 'New').length;
  const inDiscussion = inquiries.filter((i) => i.status === 'In Discussion' || i.status === 'Contacted').length;
  const confirmed = inquiries.filter((i) => i.status === 'Confirmed').length;
  const completed = inquiries.filter((i) => i.status === 'Completed').length;
  const bookedTotal = confirmed + completed;
  const conversionRate = total > 0 ? Math.round((bookedTotal / total) * 100) : 0;

  // Monthly trends (May to Oct)
  const monthNames = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const monthMap: Record<string, { count: number; confirmed: number }> = {};
  monthNames.forEach((m) => {
    monthMap[m] = { count: 0, confirmed: 0 };
  });

  inquiries.forEach((inq) => {
    const d = new Date(inq.createdAt);
    const m = d.toLocaleString('en-US', { month: 'short' });
    if (monthMap[m]) {
      monthMap[m].count += 1;
      if (inq.status === 'Confirmed' || inq.status === 'Completed') {
        monthMap[m].confirmed += 1;
      }
    }
  });

  const monthlyTrends = monthNames.map((m) => ({
    month: m,
    inquiries: monthMap[m].count,
    booked: monthMap[m].confirmed,
  }));

  // 2. Financial / Revenue Pipeline (in PKR)
  let totalPipelinePkr = 0;
  let realizedRevenuePkr = 0;
  const budgetBracketsCount = {
    under300k: 0,
    range300to600k: 0,
    range600to1200k: 0,
    over1200k: 0,
  };

  inquiries.forEach((inq) => {
    const val = parseBudgetNumber(inq.estimatedBudget);
    totalPipelinePkr += val;
    if (inq.status === 'Confirmed' || inq.status === 'Completed') {
      realizedRevenuePkr += val;
    }
    if (val < 300000) budgetBracketsCount.under300k += 1;
    else if (val <= 600000) budgetBracketsCount.range300to600k += 1;
    else if (val <= 1200000) budgetBracketsCount.range600to1200k += 1;
    else budgetBracketsCount.over1200k += 1;
  });

  const avgDealSizePkr = total > 0 ? Math.round(totalPipelinePkr / total) : 0;

  const budgetBrackets = [
    { label: 'Under PKR 300K', count: budgetBracketsCount.under300k, pct: total ? Math.round((budgetBracketsCount.under300k / total) * 100) : 0 },
    { label: 'PKR 300K - 600K', count: budgetBracketsCount.range300to600k, pct: total ? Math.round((budgetBracketsCount.range300to600k / total) * 100) : 0 },
    { label: 'PKR 600K - 1.2M', count: budgetBracketsCount.range600to1200k, pct: total ? Math.round((budgetBracketsCount.range600to1200k / total) * 100) : 0 },
    { label: 'PKR 1.2M+ (Grand Cinema)', count: budgetBracketsCount.over1200k, pct: total ? Math.round((budgetBracketsCount.over1200k / total) * 100) : 0 },
  ];

  // 3. Service Demand Breakdown
  const serviceCounts: Record<string, { count: number; volumePkr: number }> = {};
  inquiries.forEach((inq) => {
    const s = inq.requiredService || 'Other Production';
    if (!serviceCounts[s]) serviceCounts[s] = { count: 0, volumePkr: 0 };
    serviceCounts[s].count += 1;
    serviceCounts[s].volumePkr += parseBudgetNumber(inq.estimatedBudget);
  });

  const serviceBreakdown = Object.entries(serviceCounts)
    .map(([service, data]) => ({
      service,
      count: data.count,
      pct: total ? Math.round((data.count / total) * 100) : 0,
      volumePkr: data.volumePkr,
    }))
    .sort((a, b) => b.count - a.count);

  // 4. Geographic Distribution (Pakistani Cities)
  const cityCounts: Record<string, number> = {};
  inquiries.forEach((inq) => {
    const c = inq.city || 'Other Pakistan';
    cityCounts[c] = (cityCounts[c] || 0) + 1;
  });

  const cityDistribution = Object.entries(cityCounts)
    .map(([city, count]) => ({
      city,
      count,
      pct: total ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // 5. Lead Acquisition & Communication Channels
  const channelCounts: Record<string, number> = { whatsapp: 0, phone: 0, email: 0 };
  inquiries.forEach((inq) => {
    const ch = inq.preferredContactMethod || 'whatsapp';
    channelCounts[ch] = (channelCounts[ch] || 0) + 1;
  });

  const leadChannels = [
    { channel: 'WhatsApp Inquiries', count: channelCounts.whatsapp, pct: total ? Math.round((channelCounts.whatsapp / total) * 100) : 0, key: 'whatsapp' },
    { channel: 'Direct Phone Calls', count: channelCounts.phone, pct: total ? Math.round((channelCounts.phone / total) * 100) : 0, key: 'phone' },
    { channel: 'Website & Email Quotes', count: channelCounts.email, pct: total ? Math.round((channelCounts.email / total) * 100) : 0, key: 'email' },
  ].sort((a, b) => b.count - a.count);

  res.json({
    funnel: {
      total,
      newCount,
      inDiscussion,
      confirmed,
      completed,
      bookedTotal,
      conversionRate,
      monthlyTrends,
    },
    revenue: {
      totalPipelinePkr,
      realizedRevenuePkr,
      avgDealSizePkr,
      budgetBrackets,
    },
    services: serviceBreakdown,
    geography: cityDistribution,
    leadChannels,
    operationalKpis: {
      avgResponseHours: 1.6,
      topBookingMonth: 'October 2026',
      highestDemandCity: cityDistribution[0]?.city || 'Lahore',
      topServiceRequested: serviceBreakdown[0]?.service || 'Commercial & Brand Films',
    },
  });
});

// ----------------- SETTINGS & CONTENT -----------------
router.get('/settings', (_req: Request, res: Response): void => {
  const db = getDb();
  res.json(db.settings);
});

router.put('/settings', requireAdmin, (req: Request, res: Response): void => {
  const db = getDb();
  db.settings = {
    ...db.settings,
    ...req.body,
  };
  saveDb(db);
  res.json({ success: true, settings: db.settings });
});

// ----------------- INQUIRIES -----------------
router.post('/inquiries', (req: Request, res: Response): void => {
  const {
    fullName,
    phoneNumber,
    email,
    city,
    requiredService,
    projectDescription,
    preferredDate,
    estimatedBudget,
    preferredContactMethod,
  } = req.body;

  if (!fullName || !phoneNumber || !email || !city || !requiredService || !projectDescription) {
    res.status(400).json({ error: 'Please fill in all mandatory fields.' });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }

  const db = getDb();
  const newInquiry: Inquiry = {
    id: `inq-${Date.now()}`,
    fullName: String(fullName).trim(),
    phoneNumber: String(phoneNumber).trim(),
    email: String(email).trim().toLowerCase(),
    city: String(city).trim(),
    requiredService: String(requiredService).trim(),
    projectDescription: String(projectDescription).trim(),
    preferredDate: preferredDate ? String(preferredDate) : 'Flexible',
    estimatedBudget: estimatedBudget ? String(estimatedBudget) : 'To Be Discussed',
    preferredContactMethod: preferredContactMethod || 'phone',
    status: 'New',
    internalNotes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.inquiries.unshift(newInquiry);
  saveDb(db);

  res.status(201).json({
    success: true,
    message: 'Thank you for contacting Shifa Productions. Your inquiry has been received. Our team will contact you shortly.',
    inquiry: newInquiry,
  });
});

router.get('/inquiries', requireAdmin, (req: Request, res: Response): void => {
  const db = getDb();
  let results = [...(db.inquiries || [])];

  const { status, search } = req.query;
  if (status && status !== 'all') {
    results = results.filter((i) => i.status.toLowerCase() === String(status).toLowerCase());
  }
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (i) =>
        i.fullName.toLowerCase().includes(q) ||
        i.phoneNumber.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.city.toLowerCase().includes(q) ||
        i.requiredService.toLowerCase().includes(q)
    );
  }

  res.json(results);
});

router.patch('/inquiries/:id', requireAdmin, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = getDb();
  const inq = db.inquiries.find((i) => i.id === id);
  if (!inq) {
    res.status(404).json({ error: 'Inquiry not found' });
    return;
  }

  if (req.body.status) inq.status = req.body.status;
  if (req.body.internalNotes !== undefined) inq.internalNotes = req.body.internalNotes;
  inq.updatedAt = new Date().toISOString();

  saveDb(db);
  res.json({ success: true, inquiry: inq });
});

router.delete('/inquiries/:id', requireAdmin, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = getDb();
  db.inquiries = db.inquiries.filter((i) => i.id !== id);
  saveDb(db);
  res.json({ success: true, message: 'Inquiry removed' });
});

// ----------------- SERVICES -----------------
router.get('/services', (_req: Request, res: Response): void => {
  const db = getDb();
  const sorted = [...db.services].sort((a, b) => a.displayOrder - b.displayOrder);
  res.json(sorted);
});

router.post('/services', requireAdmin, (req: Request, res: Response): void => {
  const db = getDb();
  const newService: ServiceItem = {
    id: `srv-${Date.now()}`,
    slug: req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: req.body.title,
    shortDesc: req.body.shortDesc,
    fullDesc: req.body.fullDesc,
    iconName: req.body.iconName || 'Clapperboard',
    image: req.body.image || '',
    features: req.body.features || [],
    deliverables: req.body.deliverables || [],
    startingPricePkr: req.body.startingPricePkr || '',
    turnaroundTime: req.body.turnaroundTime || '',
    displayOrder: db.services.length + 1,
  };
  db.services.push(newService);
  saveDb(db);
  res.status(201).json(newService);
});

router.put('/services/:id', requireAdmin, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = getDb();
  const idx = db.services.findIndex((s) => s.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }
  db.services[idx] = { ...db.services[idx], ...req.body, id };
  saveDb(db);
  res.json(db.services[idx]);
});

router.delete('/services/:id', requireAdmin, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = getDb();
  db.services = db.services.filter((s) => s.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// ----------------- PORTFOLIO -----------------
router.get('/portfolio', (_req: Request, res: Response): void => {
  const db = getDb();
  res.json(db.portfolio);
});

router.post('/portfolio', requireAdmin, (req: Request, res: Response): void => {
  const db = getDb();
  const newProject: PortfolioItem = {
    id: `port-${Date.now()}`,
    title: req.body.title,
    category: req.body.category || 'Commercials',
    client: req.body.client || '',
    location: req.body.location || 'Pakistan',
    description: req.body.description,
    image: req.body.image,
    videoUrl: req.body.videoUrl || '',
    year: req.body.year || new Date().getFullYear().toString(),
    gearUsed: req.body.gearUsed || '',
    deliverables: req.body.deliverables || [],
    isFeatured: !!req.body.isFeatured,
  };
  db.portfolio.unshift(newProject);
  saveDb(db);
  res.status(201).json(newProject);
});

router.put('/portfolio/:id', requireAdmin, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = getDb();
  const idx = db.portfolio.findIndex((p) => p.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Portfolio item not found' });
    return;
  }
  db.portfolio[idx] = { ...db.portfolio[idx], ...req.body, id };
  saveDb(db);
  res.json(db.portfolio[idx]);
});

router.delete('/portfolio/:id', requireAdmin, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = getDb();
  db.portfolio = db.portfolio.filter((p) => p.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// ----------------- PACKAGES -----------------
router.get('/packages', (_req: Request, res: Response): void => {
  const db = getDb();
  res.json(db.packages);
});

router.post('/packages', requireAdmin, (req: Request, res: Response): void => {
  const db = getDb();
  const newPkg: PackageItem = {
    id: `pkg-${Date.now()}`,
    name: req.body.name,
    tagline: req.body.tagline || '',
    pricePkr: req.body.pricePkr || 'Request a Quote',
    isCustomQuote: !!req.body.isCustomQuote,
    duration: req.body.duration || '',
    crewSize: req.body.crewSize || '',
    includedServices: req.body.includedServices || [],
    deliverables: req.body.deliverables || [],
    optionalAddons: req.body.optionalAddons || [],
    isPopular: !!req.body.isPopular,
  };
  db.packages.push(newPkg);
  saveDb(db);
  res.status(201).json(newPkg);
});

router.put('/packages/:id', requireAdmin, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = getDb();
  const idx = db.packages.findIndex((p) => p.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Package not found' });
    return;
  }
  db.packages[idx] = { ...db.packages[idx], ...req.body, id };
  saveDb(db);
  res.json(db.packages[idx]);
});

router.delete('/packages/:id', requireAdmin, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = getDb();
  db.packages = db.packages.filter((p) => p.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// ----------------- TESTIMONIALS -----------------
router.get('/testimonials', (_req: Request, res: Response): void => {
  const db = getDb();
  res.json(db.testimonials);
});

router.post('/testimonials', requireAdmin, (req: Request, res: Response): void => {
  const db = getDb();
  const newTestimonial: TestimonialItem = {
    id: `test-${Date.now()}`,
    clientName: req.body.clientName,
    roleOrBrand: req.body.roleOrBrand || '',
    city: req.body.city || '',
    rating: Number(req.body.rating) || 5,
    reviewText: req.body.reviewText,
    projectType: req.body.projectType || 'General Production',
    isVerifiedCustomer: req.body.isVerifiedCustomer !== false,
    date: req.body.date || 'Recent',
  };
  db.testimonials.push(newTestimonial);
  saveDb(db);
  res.status(201).json(newTestimonial);
});

router.put('/testimonials/:id', requireAdmin, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = getDb();
  const idx = db.testimonials.findIndex((t) => t.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Testimonial not found' });
    return;
  }
  db.testimonials[idx] = { ...db.testimonials[idx], ...req.body, id };
  saveDb(db);
  res.json(db.testimonials[idx]);
});

router.delete('/testimonials/:id', requireAdmin, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = getDb();
  db.testimonials = db.testimonials.filter((t) => t.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// ----------------- FAQS -----------------
router.get('/faqs', (_req: Request, res: Response): void => {
  const db = getDb();
  res.json(db.faqs);
});

router.post('/faqs', requireAdmin, (req: Request, res: Response): void => {
  const db = getDb();
  const newFaq: FaqItem = {
    id: `faq-${Date.now()}`,
    question: req.body.question,
    answer: req.body.answer,
    category: req.body.category || 'General',
  };
  db.faqs.push(newFaq);
  saveDb(db);
  res.status(201).json(newFaq);
});

router.put('/faqs/:id', requireAdmin, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = getDb();
  const idx = db.faqs.findIndex((f) => f.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'FAQ not found' });
    return;
  }
  db.faqs[idx] = { ...db.faqs[idx], ...req.body, id };
  saveDb(db);
  res.json(db.faqs[idx]);
});

router.delete('/faqs/:id', requireAdmin, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = getDb();
  db.faqs = db.faqs.filter((f) => f.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// ----------------- LEADERSHIP & TEAM MANAGEMENT -----------------
router.get('/team', (_req: Request, res: Response): void => {
  const db = getDb();
  const list = [...(db.team || [])].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  res.json(list);
});

router.post('/team', requireAdmin, (req: Request, res: Response): void => {
  const db = getDb();
  if (!db.team) db.team = [];

  const rawRole = req.body.roleType;
  const roleType: 'owner' | 'ceo' | 'team_member' =
    rawRole === 'owner' || rawRole === 'ceo' ? rawRole : 'team_member';

  const newMember: TeamMember = {
    id: `team-${Date.now()}`,
    name: req.body.name || 'Untitled Member',
    roleType,
    title: req.body.title || (roleType === 'owner' ? 'Studio Owner' : roleType === 'ceo' ? 'Chief Executive Officer' : 'Team Member'),
    bio: req.body.bio || '',
    photo: req.body.photo || '/images/hero_cinematic_production_1793180767552.jpg',
    email: req.body.email || '',
    phone: req.body.phone || '',
    instagram: req.body.instagram || '',
    linkedin: req.body.linkedin || '',
    displayOrder: typeof req.body.displayOrder === 'number' ? req.body.displayOrder : db.team.length + 1,
  };

  db.team.push(newMember);
  saveDb(db);
  res.status(201).json(newMember);
});

router.put('/team/:id', requireAdmin, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = getDb();
  if (!db.team) db.team = [];

  const idx = db.team.findIndex((m) => m.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'Team member not found' });
    return;
  }

  db.team[idx] = {
    ...db.team[idx],
    ...req.body,
    id,
  };
  saveDb(db);
  res.json(db.team[idx]);
});

router.delete('/team/:id', requireAdmin, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = getDb();
  if (!db.team) db.team = [];

  db.team = db.team.filter((m) => m.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// ----------------- MEDIA MANAGEMENT -----------------
router.post('/media/upload', requireAdmin, upload.single('mediaFile'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

router.get('/media', requireAdmin, (_req: Request, res: Response): void => {
  try {
    const files = fs.readdirSync(UPLOADS_DIR);
    const mediaList = files.map((filename) => {
      const filePath = path.join(UPLOADS_DIR, filename);
      const stat = fs.statSync(filePath);
      return {
        filename,
        url: `/uploads/${filename}`,
        size: stat.size,
        createdAt: stat.birthtime.toISOString(),
      };
    });
    res.json(mediaList);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read media library' });
  }
});

router.delete('/media/:filename', requireAdmin, (req: Request, res: Response): void => {
  const { filename } = req.params;
  const sanitized = path.basename(filename);
  const target = path.join(UPLOADS_DIR, sanitized);
  if (fs.existsSync(target)) {
    fs.unlinkSync(target);
    res.json({ success: true, message: 'Media file removed' });
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

export default router;
