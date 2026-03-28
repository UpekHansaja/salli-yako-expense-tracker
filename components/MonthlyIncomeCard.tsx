'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { updateMonthlyIncome, deleteMonthlyIncome } from '@/hooks/useIncome';
import { Edit2, Trash2, DollarSign, Calendar } from 'lucide-react';

interface MonthlyIncome {
  id: number;
  user_id: number;
  amount: number;
  renewal_date: number;
  last_renewal_date: string;
  next_renewal_date: string;
  description: string;
  active: number;
  created_at: string;
  updated_at: string;
}

interface MonthlyIncomeCardProps {
  income: MonthlyIncome;
  onUpdate: () => void;
}

export function MonthlyIncomeCard({ income, onUpdate }: MonthlyIncomeCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: income.amount,
    renewal_date: income.renewal_date,
    description: income.description
  });

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateMonthlyIncome(
        income.id.toString(),
        formData.amount,
        formData.renewal_date,
        formData.description,
        income.active
      );
      setIsOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating income:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this monthly income?')) {
      setIsLoading(true);
      try {
        await deleteMonthlyIncome(income.id.toString());
        onUpdate();
      } catch (error) {
        console.error('Error deleting income:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const nextDate = new Date(income.next_renewal_date);
  const today = new Date();
  const daysUntilRenewal = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="w-4 h-4 text-accent" />
              {income.description || 'Monthly Income'}
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Renews on day {income.renewal_date} of each month
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Edit2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Monthly Income</DialogTitle>
                  <DialogDescription>Update your monthly income details</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Amount</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Renewal Date (1-31)</label>
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      value={formData.renewal_date}
                      onChange={(e) => setFormData({...formData, renewal_date: parseInt(e.target.value)})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="mt-1"
                      placeholder="e.g., Salary"
                    />
                  </div>
                  <Button onClick={handleUpdate} disabled={isLoading} className="w-full">
                    {isLoading ? 'Updating...' : 'Update Income'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isLoading}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Amount</span>
          <span className="text-2xl font-bold text-accent">${income.amount.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Next Renewal</span>
          <span>{new Date(income.next_renewal_date).toLocaleDateString()} ({daysUntilRenewal > 0 ? `in ${daysUntilRenewal} days` : 'Today'})</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Last Renewal</span>
          <span>{new Date(income.last_renewal_date).toLocaleDateString()}</span>
        </div>
        <div className="inline-block px-2 py-1 rounded text-xs font-medium bg-accent/10 text-accent">
          {income.active ? 'Active' : 'Inactive'}
        </div>
      </CardContent>
    </Card>
  );
}
