import { cn } from '@/lib/utils';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
}

const statusMap: Record<string, StatusType> = {
  Active: 'success',
  Delivered: 'success',
  Pending: 'warning',
  Cancelled: 'error',
  Expired: 'error',
  Suspended: 'warning',
};

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const statusType = type || statusMap[status] || 'default';

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusType === 'success' && 'bg-success/10 text-success',
        statusType === 'warning' && 'bg-warning/10 text-warning',
        statusType === 'error' && 'bg-destructive/10 text-destructive',
        statusType === 'info' && 'bg-primary/10 text-primary',
        statusType === 'default' && 'bg-muted text-muted-foreground',
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          statusType === 'success' && 'bg-success',
          statusType === 'warning' && 'bg-warning',
          statusType === 'error' && 'bg-destructive',
          statusType === 'info' && 'bg-primary',
          statusType === 'default' && 'bg-muted-foreground'
        )}
      />
      {status}
    </span>
  );
}
