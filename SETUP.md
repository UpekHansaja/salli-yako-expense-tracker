# Salli Yako - Expense Tracking Application

A modern, minimal cross-platform expense tracking application built with Next.js, React, Express, and SQLite. Track your expenses, set savings goals, and build financial resilience.

## Tech Stack

### Frontend (Web)
- **Framework**: Next.js 16 with React 19.2
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 4.2 with custom theme design tokens
- **Charts & Visualizations**: Recharts
- **State Management**: SWR for data fetching, React Context for auth
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Server**: Express.js 4.18
- **Database**: SQLite 5.1 (local file-based)
- **Authentication**: bcryptjs password hashing + JSON file storage
- **CORS**: Enabled for local development
- **API Style**: RESTful with JSON payloads

### Database Schema
- **users**: User accounts (username, email)
- **categories**: Expense categories per user
- **expenses**: Transaction records with date, amount, category
- **savings_goals**: User savings targets with progress tracking
- **budgets**: Monthly budget allocations per category (extensible)

### Design
- **Theme**: Modern minimal dark theme with purple primary color
- **Layout**: Bento grid responsive design (mobile-first)
- **Color Palette**: 5 total colors (primary, accent, 3 neutrals)
- **Typography**: Single font family (Geist) for consistency

## Features

### MVP Features Implemented
1. **Authentication**
   - User registration with email validation
   - Login with username/password
   - Secure password hashing with bcryptjs
   - Session persistence with localStorage

2. **Expense Tracking**
   - Add, edit, delete expenses
   - Category management
   - Filter by date and month
   - Bulk transaction view
   - Export transactions to CSV

3. **Savings Goals**
   - Create savings targets with custom colors
   - Track progress with visual progress bars
   - Add money to goals incrementally
   - Target date planning
   - Goal completion tracking

4. **Analytics & Reports**
   - Monthly spending summary by category
   - Yearly spending trends visualization
   - Pie charts for category breakdown
   - Line charts for trend analysis
   - Detailed transaction reports
   - CSV export functionality

5. **Dashboard**
   - Bento grid layout with multiple widgets
   - Summary cards (total spent, total saved)
   - Recent transactions feed
   - Quick navigation to key features
   - Month selector for historical data

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation & Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   # or npm install
   ```

2. **Start Development Server**
   ```bash
   pnpm dev
   # Runs both Next.js (port 3000) and Express server (port 3001)
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001/api

### First Time Usage

1. Visit http://localhost:3000
2. Click "Sign Up" to create a new account
3. Enter username, email, and password
4. Log in with your credentials
5. Create expense categories (required before adding expenses)
6. Start tracking your expenses!

### Database
- SQLite database is auto-created at `data/salli_yako.db`
- User credentials stored in `data/users.json` (auto-created with bcryptjs hashing)
- Delete `data/` folder to reset everything

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home redirect
│   ├── login/page.tsx       # Login page
│   ├── register/page.tsx    # Registration page
│   ├── dashboard/page.tsx   # Main dashboard
│   ├── expenses/page.tsx    # Expense management
│   ├── goals/page.tsx       # Savings goals
│   ├── analytics/page.tsx   # Analytics & reports
│   └── globals.css          # Global styles + design tokens
│
├── components/
│   ├── ExpenseSummaryCard.tsx
│   ├── SavingsGoalCard.tsx
│   └── ui/                  # shadcn/ui components
│
├── context/
│   └── AuthContext.tsx      # Authentication context
│
├── hooks/
│   └── useExpenses.ts       # Data fetching hooks with SWR
│
├── server.js                # Express backend server
├── package.json             # Dependencies & scripts
└── SETUP.md                 # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - User login

### Expenses
- `GET /api/expenses/:userId` - Get all expenses
- `GET /api/expenses/:userId/month/:month` - Get monthly expenses
- `POST /api/expenses` - Add expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Categories
- `GET /api/categories/:userId` - Get user categories
- `POST /api/categories` - Create category

### Savings Goals
- `GET /api/savings-goals/:userId` - Get goals
- `POST /api/savings-goals` - Create goal
- `PUT /api/savings-goals/:id` - Update goal progress
- `DELETE /api/savings-goals/:id` - Delete goal

### Analytics
- `GET /api/analytics/:userId/monthly/:month` - Monthly summary
- `GET /api/analytics/:userId/yearly` - Yearly trends

### Reports
- `GET /api/reports/:userId/monthly/:month` - Detailed monthly report

## Future Enhancements

### Phase 2
- React Native mobile app with Expo
- Offline-first functionality with local caching
- Dark/Light theme toggle
- Budget alerts and notifications
- Recurring expense templates

### Phase 3
- Cloud sync (AWS S3 or similar)
- Multi-currency support
- Collaborative budgets
- Advanced forecasting
- Bill reminders
- Integration with banks (via Plaid)

## Development Notes

### Environment Variables
Currently using hardcoded localhost URLs. For production:
- Set `API_URL` environment variable
- Update CORS settings in `server.js`
- Use environment-specific configurations

### Database Backup
```bash
# SQLite database file location
cp data/salli_yako.db data/salli_yako.db.backup
```

### Scaling Considerations
- Replace SQLite with PostgreSQL/MySQL for production
- Use proper session management (JWT or secure cookies)
- Implement rate limiting
- Add input validation middleware
- Enable HTTPS

## Security Notes

### Current Implementation
- Passwords hashed with bcryptjs (10 rounds)
- No CSRF protection (add for production)
- localStorage used for session (use HTTP-only cookies)
- No API authentication tokens (add JWT)

### Production Checklist
- Implement JWT tokens instead of localStorage
- Use secure HTTP-only cookies
- Add CORS whitelist
- Implement rate limiting
- Add request validation
- Use environment variables for secrets
- Enable HTTPS
- Add input sanitization

## License

MIT

## Support

For issues or questions, refer to the code documentation or create an issue.
