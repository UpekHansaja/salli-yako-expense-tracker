'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useMonthlyIncome, useOtherIncome, useMonthlyIncomeTotal, useOtherIncomeTotal } from '@/hooks/useIncome';
import { MonthlyIncomeCard } from '@/components/MonthlyIncomeCard';
import { OtherIncomeCard } from '@/components/OtherIncomeCard';
import { AddMonthlyIncomeModal } from '@/components/AddMonthlyIncomeModal';
import { AddOtherIncomeModal } from '@/components/AddOtherIncomeModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { DollarSign, Gift, Briefcase, TrendingUp } from 'lucide-react';

export default function IncomePage() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    router.push('/login');
    return null;
  }

  const { monthlyIncomes, isLoading: monthlyLoading, mutate: mutateMonthly } = useMonthlyIncome(user.id.toString());
  const { otherIncomes, isLoading: otherLoading, mutate: mutateOther } = useOtherIncome(user.id.toString());
  const { total: monthlyTotal } = useMonthlyIncomeTotal(user.id.toString());
  const { total: otherTotal } = useOtherIncomeTotal(user.id.toString());

  const isLoading = monthlyLoading || otherLoading;
  const totalIncome = monthlyTotal + otherTotal;

  const handleRefresh = () => {
    mutateMonthly();
    mutateOther();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <DollarSign className="w-8 h-8 text-accent" />
                Income Management
              </h1>
              <p className="text-muted-foreground mt-2">Track your monthly and other income sources</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Monthly Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">${monthlyTotal.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{monthlyIncomes.length} source(s)</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Gift className="w-4 h-4 text-primary" />
                Other Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">${otherTotal.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{otherIncomes.length} transaction(s)</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-green-500" />
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">${totalIncome.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">All income sources</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Income Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Recurring Monthly Income</h2>
              <p className="text-muted-foreground mt-1">Income that auto-renews every month</p>
            </div>
            <AddMonthlyIncomeModal userId={user.id.toString()} onSuccess={handleRefresh} />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : monthlyIncomes.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">No monthly income set up yet</p>
                <AddMonthlyIncomeModal userId={user.id.toString()} onSuccess={handleRefresh} />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {monthlyIncomes.map((income: any) => (
                <MonthlyIncomeCard
                  key={income.id}
                  income={income}
                  onUpdate={handleRefresh}
                />
              ))}
            </div>
          )}
        </section>

        {/* Other Income Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Other Income</h2>
              <p className="text-muted-foreground mt-1">Gifts, projects, bonuses, and other sources</p>
            </div>
            <AddOtherIncomeModal userId={user.id.toString()} onSuccess={handleRefresh} />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : otherIncomes.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">No other income recorded yet</p>
                <AddOtherIncomeModal userId={user.id.toString()} onSuccess={handleRefresh} />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {otherIncomes.map((income: any) => (
                <OtherIncomeCard
                  key={income.id}
                  income={income}
                  onUpdate={handleRefresh}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
