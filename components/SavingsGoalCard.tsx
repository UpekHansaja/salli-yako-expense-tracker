import { Card } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface SavingsGoal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  icon?: string;
  color?: string;
}

interface SavingsGoalCardProps {
  goal: SavingsGoal;
}

export function SavingsGoalCard({ goal }: SavingsGoalCardProps) {
  const progress = (goal.current_amount / goal.target_amount) * 100;
  const remaining = goal.target_amount - goal.current_amount;

  return (
    <Card className="p-6 bg-card/50 border-border/40 col-span-full md:col-span-1 row-span-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg`} style={{ backgroundColor: goal.color || '#10B981' }}>
            <Target className="w-5 h-5" style={{ color: 'white' }} />
          </div>
          <h3 className="font-semibold text-foreground text-sm">{goal.name}</h3>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground font-medium">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-border/40 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: goal.color || '#10B981',
              }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-xs pt-2 border-t border-border/40">
          <div>
            <p className="text-muted-foreground">Saved</p>
            <p className="text-foreground font-medium">${goal.current_amount.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Target</p>
            <p className="text-foreground font-medium">${goal.target_amount.toFixed(2)}</p>
          </div>
        </div>

        {remaining > 0 && (
          <div className="text-xs text-accent">
            ${remaining.toFixed(2)} to go
          </div>
        )}
      </div>
    </Card>
  );
}
