'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { updateOtherIncome, deleteOtherIncome } from '@/hooks/useIncome';
import { Edit2, Trash2 } from 'lucide-react';

interface OtherIncome {
  id: number;
  user_id: number;
  amount: number;
  source: string;
  description: string;
  income_date: string;
  category: string;
  created_at: string;
}

interface OtherIncomeCardProps {
  income: OtherIncome;
  onUpdate: () => void;
}

const sourceColors: Record<string, string> = {
  'gift': 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  'project': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  'bonus': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  'freelance': 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  'investment': 'bg-green-500/10 text-green-600 dark:text-green-400',
  'other': 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
};

export function OtherIncomeCard({ income, onUpdate }: OtherIncomeCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: income.amount,
    source: income.source,
    description: income.description,
    income_date: income.income_date,
    category: income.category
  });

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateOtherIncome(
        income.id.toString(),
        formData.amount,
        formData.source,
        formData.description,
        formData.income_date,
        formData.category
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
    if (confirm('Are you sure you want to delete this income?')) {
      setIsLoading(true);
      try {
        await deleteOtherIncome(income.id.toString());
        onUpdate();
      } catch (error) {
        console.error('Error deleting income:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const bgColor = sourceColors[income.category] || sourceColors['other'];

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base">{income.source}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${bgColor}`}>
                {income.category}
              </span>
            </div>
            {income.description && (
              <p className="text-sm text-muted-foreground">{income.description}</p>
            )}
            <p className="text-xs text-muted-foreground">{new Date(income.income_date).toLocaleDateString()}</p>
          </div>
          <div className="text-right space-y-2">
            <p className="text-xl font-bold text-accent">${income.amount.toFixed(2)}</p>
            <div className="flex gap-1">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Other Income</DialogTitle>
                    <DialogDescription>Update your income details</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Source</label>
                      <Input
                        value={formData.source}
                        onChange={(e) => setFormData({...formData, source: e.target.value})}
                        placeholder="e.g., Project Name"
                        className="mt-1"
                      />
                    </div>
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
                      <label className="text-sm font-medium">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
                      >
                        <option value="gift">Gift</option>
                        <option value="project">Project</option>
                        <option value="bonus">Bonus</option>
                        <option value="freelance">Freelance</option>
                        <option value="investment">Investment</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <Input
                        type="date"
                        value={formData.income_date}
                        onChange={(e) => setFormData({...formData, income_date: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Optional notes"
                        className="mt-1"
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
        </div>
      </CardContent>
    </Card>
  );
}
