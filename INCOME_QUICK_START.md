# Income Management - Quick Start Guide

## What's New?

Salli Yako now has complete income tracking features that work seamlessly with expenses and savings goals.

## Two Types of Income

### 1. Monthly Income (Recurring)
Income that happens every month automatically.

**Examples:**
- Salary from job
- Pension payments  
- Rental income
- Regular freelance contract

**Key Feature:** Auto-renews on a date you choose (1-31 of each month)

### 2. Other Income (One-Time)
Income from irregular or special sources.

**Examples:**
- Gift from friend/family
- Freelance project payment
- Bonus at work
- Investment returns
- Side hustle earnings

**Key Feature:** You record it with the exact date received

---

## How to Use

### Setting Up Monthly Income (2 minutes)

#### Step 1: Go to Income Page
- From Dashboard, click the **"Income"** button in the top right
- Or navigate directly to `/income`

#### Step 2: Add Monthly Income
- Click the **"Add Monthly Income"** button
- Fill in three things:
  - **Amount**: How much you earn each month (e.g., 3000)
  - **Renewal Date**: What day each month (1-31)
    - 1 = 1st of month
    - 15 = 15th of month
    - 28 = 28th of month
  - **Description**: What is it? (e.g., "Salary", "Pension")

#### Step 3: Done!
Your income is set up and will show:
- On the Income page
- On the Dashboard in the income card
- In Analytics and Reports

---

### Adding Other Income (1 minute)

#### Step 1: Click "Add Other Income" Button
On the Income page, click the **"Add Other Income"** button

#### Step 2: Fill in the Form
- **Source**: What is the income from? (e.g., "Freelance Project")
- **Amount**: How much? (e.g., 500)
- **Category**: Which type?
  - Gift (friend/family)
  - Project (work/contract)
  - Bonus (job bonus)
  - Freelance (gig work)
  - Investment (returns)
  - Other
- **Date**: When did you receive it?
- **Description** (optional): Any extra details?

#### Step 3: Done!
Your income is recorded and shown in:
- Income page history
- Monthly totals
- Analytics dashboard

---

## Managing Your Income

### Edit Monthly Income
1. Find the monthly income card
2. Click the **Edit** icon (pencil)
3. Change amount, renewal date, or description
4. Click "Update Income"

**Why you'd do this:**
- Got a raise
- Pension amount changed
- Changed when you get paid

### Edit Other Income
1. Find the other income card
2. Click the **Edit** icon
3. Update any details
4. Click "Update Income"

### Delete Income
1. Find the income you want to remove
2. Click the **Delete** icon (trash)
3. Confirm when prompted
4. Income is removed

---

## Understanding the Dashboard

Your dashboard now shows:

### Income Card
- **Total Income**: All monthly + other income
- **Color**: Green (opposite of red expenses)
- **Updates**: Real-time as you add/edit income

### Income Breakdown
Three cards show:
1. Monthly Income total (e.g., $5,500)
2. Other Income total (e.g., $1,200)
3. Combined Total (e.g., $6,700)

---

## Analytics & Reports

### Analytics Page Now Shows
- Your total income for the month
- Income sources breakdown
- How income compares to spending
- Income trends over time

### Monthly Reports Include
- Total monthly income
- Monthly recurring income sources
- One-time income details
- Combined income totals

---

## Tips & Tricks

### Setting Up Renewal Dates

**Paid on 1st of month?**
→ Set renewal date to 1

**Paid on 15th and 30th?**
→ Create TWO monthly income entries (one for 15th, one for 30th)

**Paid on last day?**
→ Set renewal date to 28 (covers most months, adjust in Feb)

### Tracking Bonuses

**Annual Bonus?**
→ Use "Other Income" when you receive it

**Quarterly Bonus?**
→ Use "Other Income" and add it 4 times per year

### Side Income

**Regular freelance work?**
→ If consistent, use Monthly Income

**Random projects?**
→ Use Other Income each time

---

## Common Questions

### Q: What's the difference between Monthly and Other Income?
**A:** Monthly Income repeats automatically every month. Other Income is one-time that you record manually.

### Q: Can I change how much monthly income I get?
**A:** Yes! Click Edit on any monthly income card and update the amount.

### Q: Can I turn off income without deleting it?
**A:** Yes, monthly income has an Active/Inactive toggle.

### Q: Can I add income from the past?
**A:** Yes! Use Other Income with any date you choose.

### Q: Does my income affect my expenses?
**A:** No, they're separate. But together they show your complete financial picture.

### Q: Can I export income data?
**A:** Yes! Download reports from the Analytics page (includes income).

### Q: Is my income data private?
**A:** Yes! Each user only sees their own income.

### Q: Can I have multiple income sources?
**A:** Yes! Add as many as you need (multiple Monthly or Other Income entries).

---

## Visual Overview

```
┌─────────────────────────────────────┐
│         Dashboard                   │
├─────────────────────────────────────┤
│ Total Income: $6,700                │
│ Total Spent: $2,300                 │
│ Total Saved: $1,500                 │
├─────────────────────────────────────┤
│ > Income Page Button                │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│    Income Management Page (/income) │
├─────────────────────────────────────┤
│ Monthly Income: $5,500              │
│ Other Income: $1,200                │
│                                     │
│ ┌─ Salary               $5,500      │
│ │  Renews: 1st each month          │
│ │  Next: April 1st                 │
│ │                                   │
│ ├─ Freelance Project   $500         │
│ │  Category: Freelance             │
│ │  Date: March 20th                │
│ └─ Gift from Mom       $700         │
│    Category: Gift                  │
│    Date: March 15th                │
└─────────────────────────────────────┘
```

---

## Getting Help

### Check These Pages
- **Income Features**: `INCOME_FEATURES.md` (detailed guide)
- **Integration Guide**: `INTEGRATION_GUIDE.md` (how it works)
- **Architecture**: `ARCHITECTURE.md` (database schema)

### Look for
- Hover tooltips on form fields
- Help text in modals
- Examples in descriptions

---

## Next Steps

1. ✓ Go to `/income` page
2. ✓ Add your monthly income (salary, etc.)
3. ✓ Add any other income you've received
4. ✓ Check your Dashboard to see the totals
5. ✓ View Analytics to see trends
6. ✓ Download monthly reports including income

**That's it!** You now have complete income tracking in Salli Yako.

---

## Feature Summary

| Feature | Monthly Income | Other Income |
|---------|---|---|
| Add income | ✓ | ✓ |
| Edit amount | ✓ | ✓ |
| Set date | Auto (1-31) | Manual |
| Auto-renew | ✓ | ✗ |
| Delete | ✓ | ✓ |
| Toggle active | ✓ | ✗ |
| Show on dashboard | ✓ | ✓ |
| Include in reports | ✓ | ✓ |
| Analytics | ✓ | ✓ |

---

**Ready to track your income?** Head to `/income` now!
