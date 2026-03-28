# Income Management Features - Salli Yako

## Overview

The Salli Yako application now includes comprehensive income tracking features that complement the expense management system. Users can track both recurring monthly income and one-time income from various sources.

## Features

### 1. Monthly Income Management

**Purpose:** Track recurring monthly income that automatically renews each month.

**Key Features:**
- Set recurring monthly income with auto-renewal functionality
- Customize renewal date (1-31) for each income source
- Track monthly salary, pension, or any regular income
- View next renewal date and last renewal date
- Enable/disable income sources without deleting them
- Update amount and renewal date anytime

**Use Cases:**
- Salary from primary employment
- Pension payments
- Rental income
- Subscription refunds or recurring payments

**Database Schema:**
```sql
CREATE TABLE monthly_income (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  renewal_date INTEGER NOT NULL DEFAULT 1,
  last_renewal_date DATE,
  next_renewal_date DATE,
  description TEXT,
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 2. Other Income Management

**Purpose:** Record one-time or irregular income from various sources.

**Key Features:**
- Add income from gifts, projects, bonuses, freelance work, investments
- Categorize income by source type
- Record income date for accurate tracking
- Add optional descriptions for reference
- View income history with filtering options
- Edit or delete recorded income

**Supported Categories:**
- Gift (from friend/family)
- Project (work/contract project)
- Bonus (salary bonus, raise)
- Freelance (gig work, side projects)
- Investment (returns, dividends)
- Other (miscellaneous)

**Database Schema:**
```sql
CREATE TABLE other_income (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  source TEXT NOT NULL,
  description TEXT,
  income_date DATE NOT NULL,
  category TEXT DEFAULT 'other',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## API Endpoints

### Monthly Income Endpoints

#### GET `/api/monthly-income/:userId`
Retrieve all monthly income records for a user.

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "amount": 3000,
    "renewal_date": 1,
    "last_renewal_date": "2024-03-01",
    "next_renewal_date": "2024-04-01",
    "description": "Salary",
    "active": 1,
    "created_at": "2024-03-15T10:30:00Z"
  }
]
```

#### POST `/api/monthly-income`
Add a new monthly income record.

**Request Body:**
```json
{
  "user_id": 1,
  "amount": 3000,
  "renewal_date": 1,
  "description": "Salary"
}
```

#### PUT `/api/monthly-income/:id`
Update an existing monthly income record.

**Request Body:**
```json
{
  "amount": 3200,
  "renewal_date": 15,
  "description": "Salary (Increased)",
  "active": 1
}
```

#### DELETE `/api/monthly-income/:id`
Delete a monthly income record.

#### GET `/api/monthly-income/:userId/total`
Get total active monthly income for a user.

**Response:**
```json
{
  "total": 5500
}
```

### Other Income Endpoints

#### GET `/api/other-income/:userId`
Retrieve all other income records for a user.

#### GET `/api/other-income/:userId/month/:month`
Retrieve other income records for a specific month.

#### POST `/api/other-income`
Add a new other income record.

**Request Body:**
```json
{
  "user_id": 1,
  "amount": 500,
  "source": "Freelance Project",
  "description": "Website design for ABC Company",
  "income_date": "2024-03-20",
  "category": "freelance"
}
```

#### PUT `/api/other-income/:id`
Update an other income record.

#### DELETE `/api/other-income/:id`
Delete an other income record.

#### GET `/api/other-income/:userId/total`
Get total other income for a user.

### Combined Income Endpoints

#### GET `/api/income/:userId/monthly/:month`
Get combined income summary for a specific month.

**Response:**
```json
{
  "month": "03",
  "year": 2024,
  "monthly_income": 5500,
  "other_income": 1200,
  "total_income": 6700
}
```

## Frontend Components

### MonthlyIncomeCard
Displays a monthly income record with edit and delete functionality.

**Props:**
```typescript
interface MonthlyIncomeCardProps {
  income: MonthlyIncome;
  onUpdate: () => void;
}
```

**Features:**
- Shows amount, renewal date, and next renewal date
- Edit button to update income details
- Delete button with confirmation
- Active/Inactive status indicator
- Days until next renewal counter

### AddMonthlyIncomeModal
Modal dialog for adding a new monthly income.

**Features:**
- Input fields for amount, renewal date, and description
- Dropdown helper text explaining renewal dates
- Submit button with loading state
- Auto-closes on successful submission

### OtherIncomeCard
Displays an other income record with edit and delete functionality.

**Props:**
```typescript
interface OtherIncomeCardProps {
  income: OtherIncome;
  onUpdate: () => void;
}
```

**Features:**
- Shows source, amount, and date
- Category badge with color coding
- Edit and delete functionality
- Description display

### AddOtherIncomeModal
Modal dialog for adding new other income.

**Features:**
- Input fields for source, amount, category, date, and description
- Category dropdown with predefined options
- Support for optional description
- Date picker for income date

## Hooks

### useMonthlyIncome
Fetch all monthly income records for a user.

```typescript
const { monthlyIncomes, isLoading, error, mutate } = useMonthlyIncome(userId);
```

### useOtherIncome
Fetch all other income records for a user.

```typescript
const { otherIncomes, isLoading, error, mutate } = useOtherIncome(userId);
```

### useOtherIncomeByMonth
Fetch other income records for a specific month.

```typescript
const { otherIncomes, isLoading, error, mutate } = useOtherIncomeByMonth(userId, month);
```

### useMonthlyIncomeTotal
Get total monthly income for a user.

```typescript
const { total, isLoading, error, mutate } = useMonthlyIncomeTotal(userId);
```

### useOtherIncomeTotal
Get total other income for a user.

```typescript
const { total, isLoading, error, mutate } = useOtherIncomeTotal(userId);
```

### useIncomeSummary
Get combined income summary for a specific month.

```typescript
const { summary, isLoading, error, mutate } = useIncomeSummary(userId, month);
```

## Pages

### Income Management Page (`/income`)

**Features:**
- Summary cards showing:
  - Monthly income total
  - Other income total
  - Combined total income
- Monthly income section with:
  - List of all recurring income sources
  - Add monthly income button
  - Edit/delete functionality
- Other income section with:
  - List of all one-time income records
  - Add other income button
  - Edit/delete functionality
- Empty states with helpful messages

**Layout:**
- Responsive bento grid design
- Mobile-first approach
- Dark theme support

## Integration

### Dashboard Integration
The dashboard now displays:
- Total income card showing combined monthly and other income
- Income in the summary metrics
- Link to income management page

### Analytics Integration
Analytics page includes:
- Total income summary card
- Income trends analysis
- Income breakdown by source

### Reports Integration
Monthly reports now include income data:
- Monthly income summary
- Other income breakdown
- Total income figures

## Workflow Examples

### Adding Monthly Income
1. Navigate to `/income` page
2. Click "Add Monthly Income" button
3. Enter income amount (e.g., 3000)
4. Set renewal date (e.g., 1 for 1st of month)
5. Add description (e.g., "Salary")
6. Click "Add Monthly Income"
7. Income appears in monthly income list
8. Next renewal date is automatically calculated

### Recording Other Income
1. Navigate to `/income` page
2. Click "Add Other Income" button
3. Enter source (e.g., "Freelance Project")
4. Enter amount (e.g., 500)
5. Select category (e.g., "Freelance")
6. Pick income date
7. Add optional description
8. Click "Add Income"
9. Income appears in other income list

### Updating Monthly Income
1. On income management page, find monthly income
2. Click edit button on the card
3. Update amount or renewal date
4. Click "Update Income"
5. Changes reflected immediately
6. Next renewal date recalculated if date changed

### Tracking Monthly Summary
1. Dashboard shows total income in summary cards
2. Income management page shows breakdown
3. Analytics page displays income trends
4. Monthly reports include income data

## Technical Details

### Auto-Renewal Logic
- Next renewal date is calculated based on:
  - Current date
  - Specified renewal date (1-31)
  - Current or next month based on comparison
- Dates are stored in ISO 8601 format (YYYY-MM-DD)

### Data Validation
- Amount must be positive decimal
- Renewal date must be 1-31
- Source and income_date are required fields
- User ID must exist in users table

### Security
- All endpoints require valid user_id
- Foreign key constraints enforce user data isolation
- Input validation on both client and server
- SQL injection prevention through parameterized queries

### Performance
- SWR hooks provide automatic caching
- Efficient database queries with proper indexing
- Revalidation on mutations for real-time updates
- Pagination ready for large datasets

## Future Enhancements

Potential features for future iterations:
- Recurring other income (e.g., monthly freelance contract)
- Income goals and targets
- Income forecasting
- Tax planning features
- Multiple currency support
- Income budgeting
- Income source categorization improvements
- Automated income reminders

## Troubleshooting

### Income not showing on dashboard
- Ensure monthly income is set to active
- Check user_id is correct
- Verify income date is in current month

### Renewal date calculation issues
- Renewal date must be between 1-31
- Invalid dates (like Feb 30) should be handled gracefully
- Check that dates are in ISO format

### Sync issues between pages
- Click refresh or navigate away and back
- Check browser console for API errors
- Verify backend server is running

## Examples

### Creating Monthly Income Entry
```typescript
const handleAddSalary = async () => {
  await addMonthlyIncome(
    userId,
    3000,           // amount
    1,              // renewal_date (1st of month)
    'Salary'        // description
  );
};
```

### Creating Other Income Entry
```typescript
const handleAddFreelance = async () => {
  await addOtherIncome(
    userId,
    500,                          // amount
    'Client Project',             // source
    'Web design project',         // description
    '2024-03-20',                // income_date
    'freelance'                  // category
  );
};
```

### Getting Monthly Summary
```typescript
const { summary } = useIncomeSummary(userId, 3);
console.log(`Total income for March: $${summary.total_income}`);
```
