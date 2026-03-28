'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useYearlyAnalytics, useMonthlyAnalytics, useMonthlyReport } from '@/hooks/useExpenses';
import { useIncomeSummary } from '@/hooks/useIncome';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, DollarSign } from 'lucide-react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4'];

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear] = useState(new Date().getFullYear());

  const { yearlyData } = useYearlyAnalytics();
  const { analytics } = useMonthlyAnalytics(currentMonth);
  const { report } = useMonthlyReport(currentMonth);
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

  const handleDownloadReport = () => {
    const reportData = {
      month: new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' }),
      totalSpent: report.total_spent,
      categories: report.summary,
      expenses: report.expenses,
      generatedAt: new Date().toLocaleString(),
    };

    const csv = [
      ['Monthly Expense Report'],
      [`Period: ${reportData.month}`],
      [`Generated: ${reportData.generatedAt}`],
      [''],
      ['Summary'],
      ['Category', 'Amount'],
      ...reportData.categories.map((cat: any) => [cat.name || 'Uncategorized', `$${parseFloat(cat.total).toFixed(2)}`]),
      ['TOTAL', `$${reportData.totalSpent.toFixed(2)}`],
      [''],
      ['Detailed Expenses'],
      ['Date', 'Category', 'Description', 'Amount'],
      ...reportData.expenses.map((exp: any) => [
        exp.date,
        exp.category || 'Uncategorized',
        exp.description || '',
        `$${parseFloat(exp.amount).toFixed(2)}`,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salli-yako-report-${currentYear}-${String(currentMonth).padStart(2, '0')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const yearlyChartData = Array.from({ length: 12 }, (_, i) => {
    const monthData = yearlyData.find((d: any) => parseInt(d.month) === i + 1);
    return {
      month: new Date(currentYear, i).toLocaleString('default', { month: 'short' }),
      spending: monthData ? parseFloat(monthData.total) : 0,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          </div>
          <Button
            onClick={handleDownloadReport}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Controls */}
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium text-foreground">View Month:</label>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-card/50 border-border/40">
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Income
            </p>
            <p className="text-3xl font-bold text-green-500">${(incomeSummary?.total_income || 0).toFixed(2)}</p>
          </Card>

          <Card className="p-6 bg-card/50 border-border/40">
            <p className="text-sm text-muted-foreground mb-2">Total Spent (This Month)</p>
            <p className="text-3xl font-bold text-foreground">${analytics.total?.toFixed(2) || '0.00'}</p>
          </Card>

          <Card className="p-6 bg-card/50 border-border/40">
            <p className="text-sm text-muted-foreground mb-2">Total Transactions</p>
            <p className="text-3xl font-bold text-foreground">{report.expenses?.length || 0}</p>
          </Card>

          <Card className="p-6 bg-card/50 border-border/40">
            <p className="text-sm text-muted-foreground mb-2">Categories Used</p>
            <p className="text-3xl font-bold text-foreground">{report.summary?.length || 0}</p>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Yearly Spending Trend */}
          <Card className="p-6 bg-card/50 border-border/40">
            <h2 className="font-semibold text-foreground mb-6 text-lg">Yearly Spending Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                  }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Line
                  type="monotone"
                  dataKey="spending"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--primary)', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Monthly Category Breakdown */}
          <Card className="p-6 bg-card/50 border-border/40">
            <h2 className="font-semibold text-foreground mb-6 text-lg">Category Breakdown</h2>
            {analytics.categories && analytics.categories.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.categories}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {analytics.categories.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                    }}
                    labelStyle={{ color: 'var(--foreground)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No data for this month
              </div>
            )}
          </Card>

          {/* Category Details */}
          <Card className="p-6 bg-card/50 border-border/40 lg:col-span-2">
            <h2 className="font-semibold text-foreground mb-6 text-lg">Category Details</h2>
            {report.summary && report.summary.length > 0 ? (
              <div className="space-y-3">
                {report.summary.map((cat: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-background/50 rounded border border-border/20"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span className="font-medium text-foreground">{cat.name || 'Uncategorized'}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${parseFloat(cat.total).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {((parseFloat(cat.total) / (analytics.total || 1)) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">No data available</p>
            )}
          </Card>

          {/* Recent Transactions */}
          <Card className="p-6 bg-card/50 border-border/40 lg:col-span-2">
            <h2 className="font-semibold text-foreground mb-6 text-lg">Recent Transactions</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {report.expenses && report.expenses.length > 0 ? (
                report.expenses.map((exp: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-background/50 rounded border border-border/20 hover:bg-background/70 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">{exp.category || 'Uncategorized'}</p>
                      <p className="text-xs text-muted-foreground">{exp.date}</p>
                      {exp.description && (
                        <p className="text-xs text-muted-foreground">{exp.description}</p>
                      )}
                    </div>
                    <p className="font-semibold text-foreground">${parseFloat(exp.amount).toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-6">No transactions</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
