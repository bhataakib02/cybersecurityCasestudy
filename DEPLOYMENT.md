# SecurePass Deployment Guide

## 🚀 Quick Start

### Development (Local)
```bash
# Install dependencies
npm install

# Start both API server and frontend
npm run dev:full

# Or start separately:
# Terminal 1: npm run mock-api
# Terminal 2: npm run dev
```

### Production Deployment

#### 1. Build the Application
```bash
npm run build:prod
```

#### 2. Deploy API Server
- Upload `mock-server.js` to your server
- Install dependencies: `npm install express cors socket.io`
- Set environment variables
- Start server: `node mock-server.js`

#### 3. Deploy Frontend
- Upload `dist/` folder to your web server (Nginx, Apache, etc.)
- Configure environment variables
- Set up proper CORS and WebSocket support

## 🌐 Environment Configuration

### Development
Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:4000
```

### Production
Create `.env.production` file:
```
VITE_API_BASE_URL=https://your-api-domain.com
```

## 🔧 Server Requirements

### API Server
- Node.js 18+
- Port 4000 (or configure as needed)
- WebSocket support
- CORS enabled

### Frontend
- Any static file server
- SPA routing support (fallback to index.html)
- HTTPS recommended for production

## 📱 Platform-Specific Deployment

### Vercel
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically

### Netlify
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variables

### Railway
1. Connect repository
2. Add start script: `"start": "node mock-server.js"`
3. Set environment variables

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["node", "mock-server.js"]
```

## 🔒 Security Considerations

- Use HTTPS in production
- Configure proper CORS origins
- Set up rate limiting
- Use environment variables for secrets
- Enable WebSocket security features

## 🐛 Troubleshooting

### WebSocket Connection Issues
- Check if port 4000 is open
- Verify CORS configuration
- Check browser console for errors
- Ensure WebSocket support on server

### Build Issues
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify all environment variables are set

### Real-time Updates Not Working
- Check WebSocket connection status
- Verify API server is running
- Check browser network tab
- Look for console errors



