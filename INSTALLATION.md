# Salli Yako - Installation Guide

## System Requirements

- **Node.js**: 18.0.0 or higher
- **npm/pnpm/yarn**: Latest version
- **RAM**: 512MB minimum
- **Disk Space**: 500MB minimum
- **Ports**: 3000 (frontend), 3001 (backend)

## Step-by-Step Installation

### Option 1: Quick Start (Recommended)

```bash
# 1. Clone/Download the project
cd /vercel/share/v0-project

# 2. Install dependencies
pnpm install

# 3. Start development servers
pnpm dev

# 4. Open http://localhost:3000 in your browser
```

### Option 2: Manual Installation

```bash
# 1. Navigate to project
cd /vercel/share/v0-project

# 2. Install frontend dependencies
pnpm add

# 3. Terminal 1: Start frontend
npm run dev:next

# 4. Terminal 2: Start backend
npm run server

# 5. Visit http://localhost:3000
```

### Option 3: Using npm

```bash
# If pnpm not installed
npm install -g pnpm

# Or use npm directly
npm install
npm run dev
```

## Installation Verification

After installation, verify everything works:

### Frontend Check
```bash
# Visit http://localhost:3000
# You should see login page
# Try to register a new account
```

### Backend Check
```bash
# Visit http://localhost:3001/api/health
# Should return { "status": "ok" }
```

### Database Check
```bash
# After first registration, verify files exist:
ls -la data/
# Should show: salli_yako.db and users.json
```

## Troubleshooting Installation

### Issue: Port 3000 or 3001 already in use

**Solution 1: Kill existing processes**
```bash
# macOS/Linux
lsof -i :3000  # Find process using port 3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Solution 2: Use different ports**
```bash
# Modify in next.config.mjs and server.js
# Change port 3000 to 3002
# Change port 3001 to 3002
```

### Issue: npm/pnpm not found

**Solution: Install Node.js**
```bash
# macOS
brew install node

# Windows
# Download from nodejs.org

# Linux
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Solution: Use nvm (Node Version Manager)**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Issue: Dependencies installation fails

**Solution 1: Clear cache**
```bash
# pnpm
pnpm store prune
pnpm install

# npm
npm cache clean --force
npm install
```

**Solution 2: Delete lock files and reinstall**
```bash
# pnpm
rm pnpm-lock.yaml
pnpm install

# npm
rm package-lock.json
npm install
```

### Issue: "Cannot find module" errors

**Solution 1: Reinstall all dependencies**
```bash
# pnpm
pnpm install --force

# npm
npm install --legacy-peer-deps
```

**Solution 2: Check for typos in imports**
```bash
# Verify all import paths use @ aliases
# Should be: import { Button } from '@/components/ui/button'
# Not: import { Button } from './components/ui/button'
```

### Issue: Database errors

**Solution: Reset database**
```bash
# Delete data folder
rm -rf data/

# Restart server (will recreate on first run)
npm run server
```

### Issue: "Can't find next/font/google"

**Solution: Install next fonts**
```bash
pnpm add next

# Or update Next.js
pnpm update next
```

## First-Time Setup Checklist

- [ ] Node.js installed (`node --version`)
- [ ] pnpm/npm installed (`pnpm --version` or `npm --version`)
- [ ] Project downloaded/cloned
- [ ] Dependencies installed (`pnpm install`)
- [ ] Frontend running on port 3000
- [ ] Backend running on port 3001
- [ ] Can register a new account
- [ ] Can login with account
- [ ] Database file created (`data/salli_yako.db`)
- [ ] User credentials stored (`data/users.json`)

## Post-Installation Setup

### Create Sample Data

1. **Register Account**
   - Go to http://localhost:3000/register
   - Create a test account
   - Note: Use strong password (recommended)

2. **Create Categories**
   - Go to Expenses page
   - Create at least 3 categories:
     - Food
     - Transportation
     - Entertainment

3. **Add Sample Expenses**
   - Add 5-10 sample expenses
   - Different categories and amounts
   - Various dates in the month

4. **Create Savings Goals**
   - Go to Goals page
   - Create 2-3 savings goals:
     - Emergency Fund ($5,000)
     - Vacation ($2,000)
     - Car Fund ($10,000)

5. **Review Analytics**
   - Go to Analytics page
   - View charts and trends
   - Download sample CSV report

## Development Workflow

### Starting Development
```bash
pnpm dev
# Both servers start automatically
```

### Making Changes
```bash
# Frontend changes: Auto-reload (HMR)
# Backend changes: Manual restart required

# Ctrl+C to stop
# npm run server to restart backend
```

### Stopping Servers
```bash
# Press Ctrl+C in terminal
# Or kill processes (see troubleshooting)
```

### Accessing Different Parts
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- API Health: http://localhost:3001/api/health

## Environment Configuration

### Optional: Create .env.local
```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local (all values have defaults)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Database Backup

### Before Major Changes
```bash
# Backup current database
cp data/salli_yako.db data/salli_yako.db.backup

# Backup user credentials
cp data/users.json data/users.json.backup
```

### Restore from Backup
```bash
# Restore database
cp data/salli_yako.db.backup data/salli_yako.db

# Restore credentials
cp data/users.json.backup data/users.json
```

## Next Steps

After successful installation:

1. **Read QUICKSTART.md** - Get started in 30 seconds
2. **Explore SETUP.md** - Full feature documentation
3. **Review ARCHITECTURE.md** - Understand the system design
4. **Read PROJECT_SUMMARY.md** - See what's implemented
5. **Start using the app** - Create your first expense!

## Getting Help

### Common Issues
- See Troubleshooting section above
- Check console for error messages
- Verify ports are available
- Ensure Node.js version is 18+

### Debugging
```bash
# Check Node version
node --version  # Should be v18.0.0+

# Check npm version
npm --version

# List running processes on port 3000/3001
lsof -i :3000
lsof -i :3001

# See what's installed
npm list
```

### Getting More Help
- Check error messages in console
- Review files in `data/` for issues
- Restart servers completely
- Try clearing cache and reinstalling

## Installing on Different Systems

### macOS (with Homebrew)
```bash
# Install Node.js
brew install node

# Install pnpm
npm install -g pnpm

# Clone and setup
git clone <repo>
cd salli-yako
pnpm install
pnpm dev
```

### Windows (with Chocolatey)
```bash
# Install Node.js
choco install nodejs

# Install pnpm
npm install -g pnpm

# Clone and setup
git clone <repo>
cd salli-yako
pnpm install
pnpm dev
```

### Linux (Ubuntu/Debian)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Clone and setup
git clone <repo>
cd salli-yako
pnpm install
pnpm dev
```

## Docker Installation (Optional)

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

EXPOSE 3000 3001

CMD ["pnpm", "dev"]
```

### Build and Run
```bash
docker build -t salli-yako .
docker run -p 3000:3000 -p 3001:3001 salli-yako
```

## Verification Complete ✅

Once you see this working:
- ✅ Login page loads
- ✅ Can create account
- ✅ Can login
- ✅ Can add expenses
- ✅ Can view dashboard

**Installation is successful and you're ready to use Salli Yako!**

---

**Need help?** Check QUICKSTART.md for immediate next steps!
