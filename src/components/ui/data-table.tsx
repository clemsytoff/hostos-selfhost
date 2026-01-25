import { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  getRowKey?: (item: T, index: number) => string | number;
}

export function DataTable<T>({
  columns,
  data,
  emptyMessage = 'Aucune donnée',
  isLoading,
  onRowClick,
  getRowKey,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="p-8 text-center text-muted-foreground">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-r-transparent" />
          <p className="mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="p-8 text-center text-muted-foreground">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map((column) => (
              <TableHead key={column.key} className={cn('font-semibold', column.className)}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={getRowKey ? getRowKey(item, index) : index}
              onClick={() => onRowClick?.(item)}
              className={cn(onRowClick && 'cursor-pointer')}
            >
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.render
                    ? column.render(item)
                    : String((item as Record<string, unknown>)[column.key] ?? '-')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
