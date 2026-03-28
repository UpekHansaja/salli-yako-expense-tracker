import { Card } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface ExpenseSummaryProps {
  total: number;
  change?: number;
  period: string;
}

export function ExpenseSummaryCard({ total, change, period }: ExpenseSummaryProps) {
  return (
    <Card className="p-6 bg-card/50 border-border/40 col-span-full md:col-span-1 row-span-1">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{period} Spending</p>
          <h3 className="text-3xl font-bold text-foreground">
            ${total.toFixed(2)}
          </h3>
        </div>
        <div className="text-right">
          {change !== undefined && (
            <div className={`flex items-center gap-1 ${change > 0 ? 'text-destructive' : 'text-accent'}`}>
              {change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span className="text-sm font-medium">{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
