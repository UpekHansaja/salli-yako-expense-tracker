'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useExpenses, useCategories } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface NewExpense {
  category_id: number;
  amount: string;
  description: string;
  date: string;
}

export default function ExpensesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { expenses, mutate: mutateExpenses } = useExpenses();
  const { categories, mutate: mutateCategories } = useCategories();
  const [newExpense, setNewExpense] = useState<NewExpense>({
    category_id: 0,
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

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

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const response = await fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          name: newCategoryName,
        }),
      });

      if (response.ok) {
        setNewCategoryName('');
        mutateCategories();
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.category_id || !newExpense.amount || !newExpense.date) return;

    setIsAdding(true);

    try {
      const response = await fetch('http://localhost:3001/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          category_id: newExpense.category_id,
          amount: parseFloat(newExpense.amount),
          description: newExpense.description,
          date: newExpense.date,
        }),
      });

      if (response.ok) {
        setNewExpense({
          category_id: 0,
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
        });
        mutateExpenses();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        mutateExpenses();
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
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
          <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Add Category */}
        {categories.length === 0 && (
          <Card className="p-6 bg-card/50 border-border/40">
            <h2 className="font-semibold text-foreground mb-4">Add a Category First</h2>
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g., Food, Transportation, Entertainment"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 bg-background border-border"
              />
              <Button
                type="submit"
                disabled={isAddingCategory}
                className="bg-primary hover:bg-primary/90"
              >
                Create Category
              </Button>
            </form>
          </Card>
        )}

        {categories.length > 0 && (
          <>
            {/* Add Expense Form */}
            <Card className="p-6 bg-card/50 border-border/40">
              <h2 className="font-semibold text-foreground mb-4">Add New Expense</h2>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Category</label>
                    <select
                      value={newExpense.category_id}
                      onChange={(e) => setNewExpense({ ...newExpense, category_id: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm"
                    >
                      <option value={0}>Select a category</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Amount</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Date</label>
                    <Input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Description (Optional)</label>
                    <Input
                      type="text"
                      placeholder="Add notes..."
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isAdding || !newExpense.category_id || !newExpense.amount}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Expense
                </Button>
              </form>
            </Card>

            {/* Expenses List */}
            <div>
              <h2 className="font-semibold text-foreground mb-4">All Expenses</h2>
              <div className="space-y-2">
                {expenses.length > 0 ? (
                  expenses.map((expense: any) => (
                    <Card key={expense.id} className="p-4 bg-card/50 border-border/40 flex justify-between items-center hover:bg-card/70 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{expense.category_name}</p>
                        <p className="text-sm text-muted-foreground">{expense.description || 'No description'}</p>
                        <p className="text-xs text-muted-foreground mt-1">{expense.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-foreground text-lg">${parseFloat(expense.amount).toFixed(2)}</span>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-2 hover:bg-destructive/10 rounded transition-colors text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-6 bg-card/50 border-border/40 text-center text-muted-foreground">
                    No expenses yet
                  </Card>
                )}
              </div>
            </div>

            {/* Add Category Form */}
            <Card className="p-6 bg-card/50 border-border/40">
              <h2 className="font-semibold text-foreground mb-4">Add New Category</h2>
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g., Food, Transportation, Entertainment"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 bg-background border-border"
                />
                <Button
                  type="submit"
                  disabled={isAddingCategory}
                  className="bg-primary hover:bg-primary/90"
                >
                  Add
                </Button>
              </form>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
