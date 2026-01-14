/**
 * PharmaComparer Backend Server
 * Express API for Clinical Trial Indirect Treatment Comparison
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import analysisRoutes from './routes/analysis.js';

const app = express();
const PORT = process.env.PORT || 8547;

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses

// CORS configuration - support multiple origins
const allowedOrigins = [
  'http://localhost:5928',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  'https://rainbow-macaron-c288b6.netlify.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(null, true); // Allow anyway in production for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/analysis', analysisRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'PharmaComparer API',
    version: '1.0.0',
    description: 'Professional Clinical Trial Indirect Treatment Comparison Analysis Platform',
    endpoints: {
      health: '/api/analysis/health',
      compare: 'POST /api/analysis/compare',
      validate: 'POST /api/analysis/validate',
      report: 'POST /api/analysis/report'
    },
    documentation: 'https://github.com/your-repo/pharma-comparer'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║     PharmaComparer Backend Server Started     ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📊 API endpoints: http://localhost:${PORT}/api/analysis`);
  console.log(`💊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  console.log('Available endpoints:');
  console.log(`  - GET  /api/analysis/health`);
  console.log(`  - POST /api/analysis/compare`);
  console.log(`  - POST /api/analysis/validate`);
  console.log(`  - POST /api/analysis/report`);
  console.log(`  - POST /api/analysis/extract (AI text extraction)`);
  console.log(`  - POST /api/analysis/extract-pdf (AI PDF extraction)`);
  console.log(`  - POST /api/analysis/extract-batch (AI batch)`);
  console.log('');
  console.log(`✨ Gemini AI: ${process.env.GEMINI_API_KEY ? 'Configured' : 'NOT configured'}`);
  console.log('');
});

export default app;
