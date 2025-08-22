import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import multer from 'multer';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

// Import route files
import authRoutes from './routes/auth.routes.js';
import campusRoutes from './routes/campus.routes.js';
import corporateRoutes from './routes/corporate.routes.js';
import hrhuntRoutes from './routes/hrhunt.routes.js';
import emailRoutes from './routes/email.routes.js';
import linkedinRoutes from './routes/linkedin.routes.js';
import './utils/warmup.js';

dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Allowed Origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://hunt360.vercel.app',
  'https://hunt360.onrender.com',
];

// ✅ Enable CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session Middleware (MemoryStore is not good for prod, but works for dev)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'ashlokchaudhary',
    resave: false,
    saveUninitialized: false,
  })
);

// ✅ Swagger Docs (only if file exists)
const swaggerPath = path.join(__dirname, "docs", "endpoints.yaml");
if (fs.existsSync(swaggerPath)) {
  const swaggerDocument = YAML.load(swaggerPath);
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
} else {
  console.warn('⚠️ Swagger file not found, skipping API docs');
}

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/campus', campusRoutes);
app.use('/api/hrhunt', hrhuntRoutes);
app.use('/api/corporate', corporateRoutes);
app.use('/api/email-service', emailRoutes);
app.use('/api/linkedin', linkedinRoutes);

// ✅ Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;