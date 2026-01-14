# PharmaComparer - Setup Guide

Complete step-by-step installation and setup instructions.

## System Requirements

### Minimum Requirements
- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: 4GB
- **Storage**: 500MB free space
- **CPU**: 2+ cores recommended

### Software Requirements
- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher (comes with Node.js)
- **Modern Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

## Step-by-Step Installation

### 1. Install Node.js

**Windows/macOS**:
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Choose the LTS (Long Term Support) version
3. Run the installer and follow the prompts
4. Verify installation:
   ```bash
   node --version  # Should show v18.0.0 or higher
   npm --version   # Should show v9.0.0 or higher
   ```

**Linux (Ubuntu/Debian)**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Download PharmaComparer

Navigate to the pharma-comparer directory in your terminal:
```bash
cd pharma-comparer
```

### 3. Install Dependencies

From the `pharma-comparer` directory:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root directory
cd ..
```

**Expected time**: 2-5 minutes depending on internet speed

### 4. Verify Installation

Check that all dependencies are installed:

```bash
# From root directory
npm list --depth=0
cd backend && npm list --depth=0
cd ../frontend && npm list --depth=0
cd ..
```

### 5. Configure Environment (Optional)

**Backend Configuration** (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend Configuration** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3001
```

*Note: The application works with default settings if you don't create these files.*

## Running the Application

### Development Mode (Recommended for First Use)

**Option 1: Run Both Services Together** (Easiest):
```bash
# From root directory
npm run dev
```

This starts both the backend API and frontend UI simultaneously.

**Option 2: Run Services Separately**:

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Access the Application

Once running, you'll see output like:
```
Backend Server Started
Server running on: http://localhost:8547

Frontend Development Server
Local: http://localhost:5928
```

**Open your browser** and navigate to: `http://localhost:5928`

## Testing the Installation

### 1. Load Example Data

1. Open the application in your browser
2. Click the "Load Example Data" button
3. You should see two JSON structures appear in the text areas

### 2. Run Sample Analysis

1. With example data loaded, click "Run Analysis"
2. Wait 2-3 seconds for processing
3. You should see comprehensive results including:
   - Key findings
   - Forest plot
   - Comparison tables
   - Homogeneity assessment

### 3. Generate PDF Report

1. On the results page, click "Download PDF Report"
2. A PDF file should download automatically
3. Open it to verify the report generation works

## Troubleshooting

### Issue: "Port already in use"

**Error**: `EADDRINUSE: address already in use :::8547`

**Solution**:
```bash
# Find process using port 8547
lsof -i :8547  # macOS/Linux
netstat -ano | findstr :8547  # Windows

# Kill the process and restart
```

Or change the port in `backend/.env`:
```env
PORT=8548
```

And update `frontend/.env`:
```env
VITE_API_URL=http://localhost:8548
```

### Issue: "Cannot find module"

**Error**: `Error: Cannot find module 'express'`

**Solution**:
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules
npm install
```

### Issue: Frontend won't connect to backend

**Symptoms**: API calls fail, "Network Error" in browser console

**Solution**:
1. Verify backend is running on port 8547
2. Check browser console for CORS errors
3. Verify `VITE_API_URL` in `frontend/.env` matches backend port (8547)

### Issue: PDF generation fails

**Error**: "Error generating PDF report"

**Solution**:
```bash
# Reinstall PDFKit and dependencies
cd backend
npm uninstall pdfkit chartjs-node-canvas
npm install pdfkit@0.14.0 chartjs-node-canvas@4.1.6
```

### Issue: Charts not displaying

**Symptoms**: Forest plot or safety charts are blank

**Solution**:
1. Clear browser cache
2. Verify Chart.js is installed:
   ```bash
   cd frontend
   npm list chart.js
   ```
3. Reinstall if needed:
   ```bash
   npm uninstall chart.js react-chartjs-2
   npm install chart.js@4.4.1 react-chartjs-2@5.2.0
   ```

## Building for Production

### Frontend Build

```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/` directory.

### Backend Production

```bash
cd backend
npm start
```

### Deployment

For production deployment, consider:
- **Frontend**: Deploy to Vercel, Netlify, or serve `dist/` folder
- **Backend**: Deploy to Heroku, AWS, DigitalOcean, or Railway
- **Environment Variables**: Configure production URLs

## Performance Optimization

### Development

The dev servers include:
- Hot Module Replacement (HMR) for instant updates
- Source maps for debugging
- Detailed error messages

### Production

For production builds:
- Frontend assets are minified and optimized
- Backend uses compression middleware
- Enable security headers with Helmet.js

## Updating the Application

```bash
# Pull latest changes (if using Git)
git pull origin main

# Update dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# Restart the application
npm run dev
```

## Uninstalling

To completely remove PharmaComparer:

```bash
# Remove the entire directory
rm -rf pharma-comparer

# If you want to keep your data, back up any custom JSON files first
```

## Getting Help

If you encounter issues not covered here:

1. **Check logs**: Look at terminal output for error messages
2. **Browser console**: Press F12 and check Console tab for frontend errors
3. **GitHub Issues**: Search existing issues or create a new one
4. **Documentation**: Read the full README.md

## Next Steps

After successful installation:

1. Read the [Usage Guide](README.md#usage) in README.md
2. Review the [Example Data](README.md#example-data)
3. Prepare your own trial data in JSON format
4. Run your first analysis!

## System Health Check

Run this command to verify everything is working:

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check backend dependencies
cd backend && npm list jstat express pdfkit

# Check frontend dependencies
cd ../frontend && npm list react chart.js

# Test backend API
cd ../backend
npm run dev &
sleep 3
curl http://localhost:8547/api/analysis/health
```

Expected output:
```json
{"success":true,"status":"healthy","timestamp":"..."}
```

---

**Last Updated**: January 2025

**Need Help?** Open an issue on GitHub or contact support@pharmacomparer.com
