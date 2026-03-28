'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { addMonthlyIncome } from '@/hooks/useIncome';
import { Plus } from 'lucide-react';

interface AddMonthlyIncomeModalProps {
  userId: string;
  onSuccess: () => void;
}

export function AddMonthlyIncomeModal({ userId, onSuccess }: AddMonthlyIncomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    renewal_date: 1,
    description: 'Salary'
  });

  const handleSubmit = async () => {
    if (!formData.amount) {
      alert('Please enter an amount');
      return;
    }

    setIsLoading(true);
    try {
      await addMonthlyIncome(
        userId,
        parseFloat(formData.amount),
        formData.renewal_date,
        formData.description
      );
      setIsOpen(false);
      setFormData({ amount: '', renewal_date: 1, description: 'Salary' });
      onSuccess();
    } catch (error) {
      console.error('Error adding monthly income:', error);
      alert('Failed to add monthly income');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Monthly Income
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Monthly Income</DialogTitle>
          <DialogDescription>Set up a recurring monthly income that auto-renews</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Income Amount</label>
            <Input
              type="number"
              step="0.01"
              placeholder="e.g., 3000"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
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
            <p className="text-xs text-muted-foreground mt-1">
              Income will be renewed on this date every month (e.g., 1 for 1st of month, 15 for 15th)
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              placeholder="e.g., Salary, Pension, etc."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="mt-1"
            />
          </div>
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
            {isLoading ? 'Adding...' : 'Add Monthly Income'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
