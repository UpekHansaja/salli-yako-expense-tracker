'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSavingsGoals } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';

interface NewGoal {
  name: string;
  target_amount: string;
  target_date: string;
  color: string;
}

interface SavingsGoal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  color: string;
}

export default function GoalsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { goals, mutate: mutateGoals } = useSavingsGoals();
  const [newGoal, setNewGoal] = useState<NewGoal>({
    name: '',
    target_amount: '',
    target_date: '',
    color: '#10B981',
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [amountAdded, setAmountAdded] = useState<Record<number, string>>({});

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

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target_amount) return;

    setIsAdding(true);

    try {
      const response = await fetch('http://localhost:3001/api/savings-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          name: newGoal.name,
          target_amount: parseFloat(newGoal.target_amount),
          target_date: newGoal.target_date || null,
          color: newGoal.color,
        }),
      });

      if (response.ok) {
        setNewGoal({
          name: '',
          target_amount: '',
          target_date: '',
          color: '#10B981',
        });
        mutateGoals();
      }
    } catch (error) {
      console.error('Error adding goal:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddAmount = async (goal: SavingsGoal) => {
    const amount = parseFloat(amountAdded[goal.id] || '0');
    if (amount <= 0) return;

    try {
      const newAmount = parseFloat(goal.current_amount.toString()) + amount;
      const response = await fetch(`http://localhost:3001/api/savings-goals/${goal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: goal.name,
          target_amount: goal.target_amount,
          target_date: goal.target_date,
          current_amount: newAmount,
        }),
      });

      if (response.ok) {
        setAmountAdded({ ...amountAdded, [goal.id]: '' });
        mutateGoals();
      }
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/savings-goals/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        mutateGoals();
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Savings Goals</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Add Goal Form */}
        <Card className="p-6 bg-card/50 border-border/40">
          <h2 className="font-semibold text-foreground mb-4">Create New Savings Goal</h2>
          <form onSubmit={handleAddGoal} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Goal Name</label>
                <Input
                  type="text"
                  placeholder="e.g., Emergency Fund, Vacation"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Target Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newGoal.target_amount}
                  onChange={(e) => setNewGoal({ ...newGoal, target_amount: e.target.value })}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Target Date (Optional)</label>
                <Input
                  type="date"
                  value={newGoal.target_date}
                  onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Color</label>
                <div className="flex gap-2">
                  {['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewGoal({ ...newGoal, color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newGoal.color === color ? 'border-foreground' : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isAdding || !newGoal.name || !newGoal.target_amount}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Goal
            </Button>
          </form>
        </Card>

        {/* Goals List */}
        <div>
          <h2 className="font-semibold text-foreground mb-4">Your Savings Goals</h2>
          <div className="space-y-4">
            {goals.length > 0 ? (
              goals.map((goal: SavingsGoal) => {
                const progress = (goal.current_amount / goal.target_amount) * 100;
                const remaining = goal.target_amount - goal.current_amount;

                return (
                  <Card key={goal.id} className="p-6 bg-card/50 border-border/40">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: goal.color }}
                        >
                          <span className="text-xl">🎯</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{goal.name}</h3>
                          {goal.target_date && (
                            <p className="text-sm text-muted-foreground">By {goal.target_date}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 hover:bg-destructive/10 rounded transition-colors text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground font-medium">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-border/40 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all"
                          style={{
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor: goal.color,
                          }}
                        />
                      </div>
                    </div>

                    {/* Amount Info */}
                    <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-background/50 rounded">
                      <div>
                        <p className="text-xs text-muted-foreground">Saved</p>
                        <p className="text-lg font-semibold text-foreground">
                          ${goal.current_amount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Target</p>
                        <p className="text-lg font-semibold text-foreground">
                          ${goal.target_amount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Remaining</p>
                        <p className="text-lg font-semibold text-accent">
                          ${Math.max(remaining, 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {remaining > 0 && (
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Amount to add"
                          value={amountAdded[goal.id] || ''}
                          onChange={(e) => setAmountAdded({ ...amountAdded, [goal.id]: e.target.value })}
                          className="flex-1 bg-background border-border"
                        />
                        <Button
                          onClick={() => handleAddAmount(goal)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Add
                        </Button>
                      </div>
                    )}

                    {remaining <= 0 && (
                      <div className="p-3 bg-accent/10 border border-accent/20 rounded text-sm text-accent text-center">
                        Goal completed! 🎉
                      </div>
                    )}
                  </Card>
                );
              })
            ) : (
              <Card className="p-12 bg-card/50 border-border/40 text-center">
                <p className="text-muted-foreground mb-4">No savings goals yet</p>
                <p className="text-sm text-muted-foreground">Create your first goal above to get started</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
