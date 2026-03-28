# Salli Yako - Architecture & Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / Mobile                         │
│                   (React 19.2 App)                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    HTTP / JSON API
                           │
┌──────────────────────────▼──────────────────────────────────┐
│            Express.js Backend Server (Port 3001)            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Routes (RESTful)                              │   │
│  │  - Auth: /api/auth/*                              │   │
│  │  - Expenses: /api/expenses/*                       │   │
│  │  - Categories: /api/categories/*                   │   │
│  │  - Goals: /api/savings-goals/*                     │   │
│  │  - Analytics: /api/analytics/*                     │   │
│  │  - Reports: /api/reports/*                         │   │
│  └────────────┬────────────────────────────────────────┘   │
│               │                                             │
│  ┌────────────▼────────────────────────────────────────┐   │
│  │  SQLite Database (data/salli_yako.db)              │   │
│  │  ├── users                                         │   │
│  │  ├── categories                                    │   │
│  │  ├── expenses                                      │   │
│  │  ├── savings_goals                                 │   │
│  │  └── budgets                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  User Credentials (data/users.json)                │   │
│  │  - Usernames with bcryptjs hashed passwords        │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Pages (App Router)
- `/login` - Authentication entry point
- `/register` - User registration
- `/dashboard` - Main dashboard with bento grid
- `/expenses` - Expense management CRUD
- `/goals` - Savings goals management
- `/analytics` - Analytics and reports

### Context & State Management

```
AuthContext
├── user: User | null
├── loading: boolean
├── login(username, password)
├── register(username, email, password)
└── logout()

localStorage
├── user: JSON stringified user object
└── Persisted across sessions
```

### Data Fetching (SWR)

```
useExpenses(month?)
├── GET /api/expenses/:userId
├── GET /api/expenses/:userId/month/:month
└── Returns: { expenses, loading, error, mutate }

useSavingsGoals()
├── GET /api/savings-goals/:userId
└── Returns: { goals, loading, error, mutate }

useCategories()
├── GET /api/categories/:userId
└── Returns: { categories, loading, error, mutate }

useMonthlyAnalytics(month)
├── GET /api/analytics/:userId/monthly/:month
└── Returns: { analytics, loading, error }

useYearlyAnalytics()
├── GET /api/analytics/:userId/yearly
└── Returns: { yearlyData, loading, error }

useMonthlyReport(month)
├── GET /api/reports/:userId/monthly/:month
└── Returns: { report, loading, error }
```

### UI Components

**Pages (Full-page components)**
- LoginPage
- RegisterPage
- DashboardPage
- ExpensesPage
- GoalsPage
- AnalyticsPage

**Reusable Components**
- ExpenseSummaryCard - Display total spending
- SavingsGoalCard - Progress visualization
- shadcn/ui components - Button, Input, Card, etc.

**Charts**
- PieChart (Recharts) - Category breakdown
- LineChart (Recharts) - Yearly trends
- BarChart (Recharts) - Category spending

## Backend Architecture

### Express Server (server.js)

```
server.js
├── Middleware
│   ├── express.json()
│   └── cors()
│
├── Database Setup
│   ├── SQLite connection
│   └── Table creation (auto)
│
├── Auth Routes
│   ├── POST /api/auth/register
│   └── POST /api/auth/login
│
├── Expense Routes
│   ├── GET /api/expenses/:userId
│   ├── GET /api/expenses/:userId/month/:month
│   ├── POST /api/expenses
│   ├── PUT /api/expenses/:id
│   └── DELETE /api/expenses/:id
│
├── Category Routes
│   ├── GET /api/categories/:userId
│   └── POST /api/categories
│
├── Savings Goals Routes
│   ├── GET /api/savings-goals/:userId
│   ├── POST /api/savings-goals
│   ├── PUT /api/savings-goals/:id
│   └── DELETE /api/savings-goals/:id
│
├── Analytics Routes
│   ├── GET /api/analytics/:userId/monthly/:month
│   └── GET /api/analytics/:userId/yearly
│
└── Reports Routes
    └── GET /api/reports/:userId/monthly/:month
```

### Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Expenses Table
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(category_id) REFERENCES categories(id)
);

-- Savings Goals Table
CREATE TABLE savings_goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0,
  target_date DATE,
  icon TEXT,
  color TEXT DEFAULT '#10B981',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Budgets Table (Extensible)
CREATE TABLE budgets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  month_year TEXT NOT NULL,
  budget_amount DECIMAL(10, 2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(category_id) REFERENCES categories(id)
);
```

## Authentication Flow

```
Registration:
1. User submits username, email, password
2. Server validates input
3. Password hashed with bcryptjs
4. User created in SQLite (users table)
5. Credentials stored in users.json
6. User logged in automatically
7. User object stored in localStorage

Login:
1. User submits username, password
2. Server verifies password against users.json
3. User loaded from SQLite
4. Sent back to client
5. Client stores in localStorage
6. Session persists across page reloads

Logout:
1. Client clears localStorage
2. User redirected to /login
```

## Data Flow Example: Adding Expense

```
User Input (ExpensesPage)
        ↓
Form Validation
        ↓
POST /api/expenses with {user_id, category_id, amount, date}
        ↓
Backend validates & inserts to expenses table
        ↓
Returns {id, user_id, ...}
        ↓
SWR mutate() refreshes expenses list
        ↓
UI updates with new expense
```

## Design Token System

```
Theme Colors (CSS Variables):
├── --background: Main background
├── --foreground: Main text color
├── --card: Card backgrounds
├── --primary: Brand color (purple #6366F1)
├── --accent: Highlight color (green #10B981)
├── --destructive: Error color (red)
├── --border: Border color
├── --chart-1-5: Chart colors
└── --radius: Border radius

Light Mode: Light backgrounds, dark text
Dark Mode: Dark backgrounds (default), light text

Tailwind Integration:
├── All colors use CSS variables
├── No hardcoded colors
├── Theme tokens in globals.css
├── Responsive design with Tailwind
└── Mobile-first approach
```

## Performance Considerations

### Frontend
- **Lazy Loading**: Pages code-split by Next.js
- **Caching**: SWR handles data caching + deduplication
- **Revalidation**: Auto-revalidate on focus, interval
- **Component Memoization**: Heavy charts use Recharts' memoization

### Backend
- **Query Efficiency**: Indexed user_id, category_id, date
- **Pagination**: Can add LIMIT/OFFSET for expense lists
- **Aggregation**: SQL GROUP BY for analytics
- **Connection Pooling**: SQLite handles single connection

### Database
- **File-based**: Suitable for < 50K transactions
- **Indexes**: Consider adding on frequently filtered columns
- **Backup**: Simple file copy for data safety

## Scalability Path

### Phase 1 (Current)
- SQLite - local file-based database
- Single Node.js server
- Direct API calls from frontend
- localStorage for sessions

### Phase 2 (Scaling)
- PostgreSQL - production-grade database
- Connection pooling
- JWT token authentication
- Redis for caching
- Docker containerization

### Phase 3 (Enterprise)
- Kubernetes orchestration
- Separate read replicas
- Elasticsearch for analytics
- Event streaming (Kafka)
- Microservices architecture

## Security Architecture

### Current Implementation
```
Request → CORS Check
       ↓
   Express Middleware
       ↓
   Route Handler
       ↓
   SQL Query (parameterized)
       ↓
   SQLite Database
       ↓
   JSON Response
```

### Authentication Token (Future)
```
Request → JWT Verification
       ↓
   User Extraction from Token
       ↓
   Route Handler (with user context)
```

## Error Handling

### Frontend
- Try-catch blocks in async operations
- Error state in hooks
- User-facing error messages
- Fallback UI components

### Backend
- HTTP status codes (400, 401, 404, 500)
- JSON error responses
- Database constraint validation
- Input validation before queries

## Monitoring & Logging (Future)

```
Events to log:
├── User registration/login
├── Expense creation/deletion
├── API errors
├── Database errors
└── Performance metrics

Tools:
├── Console logging (development)
├── Winston/Pino (production)
├── Sentry (error tracking)
├── DataDog (performance monitoring)
```

## Deployment

### Development
```bash
pnpm dev  # Runs both Next.js & Express
```

### Production
```bash
pnpm build
pnpm start  # Next.js server
npm run server  # Express in separate process/container
```

### Cloud Deployment
- Vercel (frontend)
- Heroku/Railway/Render (backend)
- MongoDB Atlas or similar (database)

---

This architecture is designed to be simple for MVP while allowing for scalability as needs grow.
