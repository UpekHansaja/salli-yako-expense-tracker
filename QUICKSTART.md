# Salli Yako - Quick Start Guide

## 30-Second Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start both frontend and backend
pnpm dev

# 3. Open your browser
# Frontend: http://localhost:3000
# API: http://localhost:3001/api
```

## First Steps

1. **Register Account**
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Create an account with username, email, password

2. **Add Categories**
   - Go to Expenses page
   - Add your first category (e.g., "Food", "Transport", "Entertainment")

3. **Log Your First Expense**
   - Click "Add Expense" on dashboard or go to Expenses page
   - Select a category, enter amount, date, and optional description
   - Click "Add Expense"

4. **Create Savings Goals**
   - Go to "Savings Goals" 
   - Enter goal name, target amount, optional date
   - Track progress by adding money to the goal

5. **View Analytics**
   - Click "Analytics" on dashboard
   - See spending trends and category breakdown
   - Download monthly reports as CSV

## Key Features at a Glance

| Feature | Location | Purpose |
|---------|----------|---------|
| Dashboard | `/dashboard` | Overview of all finances |
| Expenses | `/expenses` | Track and manage transactions |
| Savings Goals | `/goals` | Set and track savings targets |
| Analytics | `/analytics` | Visualize spending patterns |
| Reports | `/analytics` | Download detailed CSVs |

## Common Tasks

### Add a New Expense
1. Go to Expenses page
2. Select category from dropdown
3. Enter amount and date
4. (Optional) Add description
5. Click "Add Expense"

### Track a Savings Goal
1. Go to Savings Goals
2. Click "Create New Savings Goal"
3. Enter name and target amount
4. Set target date (optional)
5. Click "Create Goal"
6. Add money as you save

### Export Monthly Report
1. Go to Analytics
2. Select month from dropdown
3. Click "Download Report" button
4. Opens as CSV file

### Delete Expense
1. Go to Expenses page
2. Find expense in list
3. Click trash icon on the right
4. Confirm deletion

## Dashboard Widgets

- **Total Spent**: Monthly spending amount
- **Total Saved**: Cumulative savings goals progress
- **Spending by Category**: Pie chart breakdown
- **Savings Goals**: Progress bars for active goals
- **Recent Expenses**: Last 5 transactions

## Tips & Tricks

1. **Monthly View**: Use the month selector on dashboard to review past months
2. **Quick Add**: Always go to Expenses page first to create categories
3. **Goal Progress**: Add money frequently to track motivation
4. **Reports**: Download reports monthly for financial planning
5. **Categories**: Create meaningful categories for better insights

## Troubleshooting

**Can't login after registration?**
- Make sure you're using the exact username you registered with
- Password is case-sensitive

**Expense not showing up?**
- Make sure you selected a category (required)
- Check if you're viewing the correct month

**Server won't start?**
- Check if ports 3000 and 3001 are available
- Kill any existing Node processes: `pkill -f node`

**Want to reset everything?**
- Delete the `data/` folder and restart the server
- This will remove all data and recreate fresh database

## Commands

```bash
# Start development (both frontend & backend)
pnpm dev

# Start only frontend
npm run next dev

# Start only backend
npm run server

# Build for production
pnpm build

# Start production server
pnpm start
```

## What's Next?

After getting comfortable with basic tracking:
1. Create a monthly budget
2. Review analytics monthly
3. Adjust spending based on insights
4. Plan savings goals for next quarter
5. Export reports for tax preparation

Enjoy building your financial resilience with Salli Yako!
