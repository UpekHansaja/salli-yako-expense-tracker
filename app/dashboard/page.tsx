'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useExpenses, useSavingsGoals, useMonthlyAnalytics } from '@/hooks/useExpenses';
import { useIncomeSummary } from '@/hooks/useIncome';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExpenseSummaryCard } from '@/components/ExpenseSummaryCard';
import { SavingsGoalCard } from '@/components/SavingsGoalCard';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LogOut, Plus, TrendingUp, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  const { expenses } = useExpenses(currentMonth);
  const { goals } = useSavingsGoals();
  const { analytics } = useMonthlyAnalytics(currentMonth);
  const { summary: incomeSummary } = useIncomeSummary(user?.id.toString() || null, currentMonth);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const totalSaved = goals.reduce((sum, goal) => sum + parseFloat(goal.current_amount), 0);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Salli Yako</h1>
            <p className="text-sm text-muted-foreground mt-1">Welcome back, {user.username}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2 border-border text-foreground hover:bg-card"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium text-foreground">Month:</label>
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
              className="px-3 py-2 bg-card border border-border rounded-md text-foreground text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(i);
                return (
                  <option key={i + 1} value={i + 1}>
                    {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex gap-2">
            <Link href="/income">
              <Button variant="outline" className="gap-2 border-border text-foreground hover:bg-card">
                <DollarSign className="w-4 h-4" />
                Income
              </Button>
            </Link>
            <Link href="/expenses">
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4" />
                Add Expense
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" className="gap-2 border-border text-foreground hover:bg-card">
                <TrendingUp className="w-4 h-4" />
                Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-max">
          {/* Total Income - Large */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Card className="p-6 bg-card/50 border-border/40">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Income</p>
                  <h3 className="text-3xl font-bold text-green-500">
                    LKR {(incomeSummary?.total_income || 0).toFixed(2)}
                  </h3>
                </div>
              </div>
            </Card>
          </div>

          {/* Total Spent - Large */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <ExpenseSummaryCard total={totalSpent} period={`Month ${currentMonth}`} />
          </div>

          {/* Total Saved - Large */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Card className="p-6 bg-card/50 border-border/40">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Saved</p>
                  <h3 className="text-3xl font-bold text-accent">
                    LKR {totalSaved.toFixed(2)}
                  </h3>
                </div>
              </div>
            </Card>
          </div>

          {/* Spending by Category - Chart */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1">
            <Card className="p-6 bg-card/50 border-border/40 h-full">
              <h3 className="font-semibold text-foreground mb-4 text-sm">Spending by Category</h3>
              {analytics.categories && analytics.categories.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analytics.categories}
                      dataKey="total"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {[
                        '#6366F1',
                        '#8B5CF6',
                        '#EC4899',
                        '#F59E0B',
                        '#10B981',
                        '#06B6D4',
                      ].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-sm text-muted-foreground h-64 flex items-center justify-center">
                  No data available
                </div>
              )}
            </Card>
          </div>

          {/* Savings Goals - Stack */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-4">
            {goals.slice(0, 3).map((goal) => (
              <SavingsGoalCard key={goal.id} goal={goal} />
            ))}
            {goals.length === 0 && (
              <Card className="p-6 bg-card/50 border-border/40 text-center text-muted-foreground text-sm">
                No savings goals yet. <Link href="/goals" className="text-primary hover:underline">Create one</Link>
              </Card>
            )}
          </div>

          {/* Recent Expenses */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <Card className="p-6 bg-card/50 border-border/40">
              <h3 className="font-semibold text-foreground mb-4 text-sm">Recent Expenses</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center p-3 bg-background/50 rounded border border-border/20">
                    <div>
                      <p className="text-sm font-medium text-foreground">{expense.category_name || 'Uncategorized'}</p>
                      <p className="text-xs text-muted-foreground">{expense.date}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">LKR {parseFloat(expense.amount).toFixed(2)}</span>
                  </div>
                ))}
                {expenses.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No expenses yet</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
