'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { addOtherIncome } from '@/hooks/useIncome';
import { Plus } from 'lucide-react';

interface AddOtherIncomeModalProps {
  userId: string;
  onSuccess: () => void;
}

export function AddOtherIncomeModal({ userId, onSuccess }: AddOtherIncomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    description: '',
    income_date: new Date().toISOString().split('T')[0],
    category: 'other'
  });

  const handleSubmit = async () => {
    // Clear previous errors
    setError(null);

    if (!formData.amount || !formData.source) {
      setError('Please enter amount and source');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    if (formData.source.trim().length === 0) {
      setError('Please enter a valid source');
      return;
    }

    setIsLoading(true);
    try {
      await addOtherIncome(
        userId,
        amount,
        formData.source,
        formData.description,
        formData.income_date,
        formData.category
      );
      // Only close and reset on success
      setIsOpen(false);
      setFormData({
        amount: '',
        source: '',
        description: '',
        income_date: new Date().toISOString().split('T')[0],
        category: 'other'
      });
      onSuccess();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add income. Please try again.';
      setError(errorMsg);
      console.error('Error adding other income:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Other Income
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Other Income</DialogTitle>
          <DialogDescription>Record income from gifts, projects, bonuses, or other sources</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200 text-sm rounded-md border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
          <div>
            <label className="text-sm font-medium">Source</label>
            <Input
              placeholder="e.g., Freelance Project, Gift from Friend, Bonus"
              value={formData.source}
              onChange={(e) => setFormData({...formData, source: e.target.value})}
              className="mt-1"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g., 500"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="mt-1"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
              disabled={isLoading}
            >
              <option value="gift">Gift from Friend/Family</option>
              <option value="project">Project/Work</option>
              <option value="bonus">Bonus/Raise</option>
              <option value="freelance">Freelance/Gig</option>
              <option value="investment">Investment Return</option>
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
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description (Optional)</label>
            <Input
              placeholder="e.g., Web design project for XYZ company"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="mt-1"
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? 'Adding...' : 'Add Income'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
