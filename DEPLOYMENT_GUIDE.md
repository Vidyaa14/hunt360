# Hunt360 Vercel Deployment Guide

## Overview
This guide covers deploying the Hunt360 full-stack application to Vercel. The application consists of:
- **Frontend**: React app (in `client/` directory)
- **Backend**: Express.js API (in root directory)

## Prerequisites
- Vercel account
- Vercel CLI installed (`npm i -g vercel`)
- All environment variables configured

## Environment Variables Setup

### Frontend Variables (set in Vercel dashboard)
```
VITE_API_BASE_URL=https://your-domain.vercel.app/api
```

### Backend Variables (set in Vercel dashboard)
```
DATABASE_URL=your_mysql_connection_string
SESSION_SECRET=your_secure_session_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

## Deployment Steps

### Option 1: Using Vercel CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

### Option 2: GitHub Integration
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Root Directory: `hunt360`
   - Build Command: (auto-detected)
   - Output Directory: `client/dist`
3. Add all environment variables in Vercel dashboard

### Option 3: Manual Deployment
1. Build frontend: `cd client && npm run build`
2. Deploy: Drag and drop the `client/dist` folder to Vercel

## Project Structure for Vercel
```
hunt360/
├── vercel.json          # Root configuration
├── client/
│   ├── vercel.json      # Frontend configuration
│   └── dist/            # Built frontend files
└── api/
    └── vercel.json      # API configuration
```

## API Routes
All API endpoints are available under `/api/` path:
- `/api/auth/*` - Authentication routes
- `/api/campus/*` - Campus recruitment routes
- `/api/corporate/*` - Corporate routes
- `/api/email-service/*` - Email services
- `/api/linkedin/*` - LinkedIn integration
- `/api/hrhunt/*` - HR hunting routes

## Troubleshooting

### Common Issues
1. **Build failures**: Check Node.js version compatibility
2. **API routes not working**: Verify environment variables
3. **CORS errors**: Check allowed origins in backend code
4. **Database connection**: Verify DATABASE_URL format

### Build Configuration
- Frontend uses Vite build system
- Backend uses Node.js runtime
- Both are configured for optimal Vercel deployment

## Performance Optimizations
- Static assets are cached for 1 year
- Security headers are configured
- API routes have 30-second timeout
- Proper CORS configuration for production

## Monitoring
- Check Vercel dashboard for deployment status
- Monitor function execution times
- Review build logs for any issues
