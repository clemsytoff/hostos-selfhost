import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

export function StatCard({ title, value, icon, trend, variant = 'default', className }: StatCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl p-6 shadow-card transition-all hover:shadow-elevated',
        variant === 'default' && 'bg-card',
        variant === 'primary' && 'gradient-primary text-primary-foreground',
        variant === 'success' && 'gradient-success text-success-foreground',
        variant === 'warning' && 'gradient-warning text-warning-foreground',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p
            className={cn(
              'text-sm font-medium',
              variant === 'default' ? 'text-muted-foreground' : 'opacity-90'
            )}
          >
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p
              className={cn(
                'text-sm font-medium flex items-center gap-1',
                variant === 'default'
                  ? trend.isPositive
                    ? 'text-success'
                    : 'text-destructive'
                  : 'opacity-90'
              )}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div
          className={cn(
            'h-12 w-12 rounded-lg flex items-center justify-center',
            variant === 'default' ? 'bg-primary/10 text-primary' : 'bg-white/20'
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
