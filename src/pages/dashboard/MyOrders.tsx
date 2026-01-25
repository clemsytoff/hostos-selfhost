import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { dashboardApi } from '@/lib/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Order {
  ID: number;
  Status: string;
  TotalAmount: number;
  OrderDate: string;
  ProductName: string;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await dashboardApi.getMyOrders();
      if (data) setOrders(data);
      setIsLoading(false);
    };

    fetchOrders();
  }, []);

  const columns = [
    { key: 'ID', header: 'N° Commande', render: (item: Order) => `#${item.ID}` },
    { key: 'ProductName', header: 'Produit' },
    {
      key: 'Status',
      header: 'Statut',
      render: (item: Order) => <StatusBadge status={item.Status} />,
    },
    {
      key: 'TotalAmount',
      header: 'Montant',
      render: (item: Order) => `${item.TotalAmount.toFixed(2)} €`,
    },
    {
      key: 'OrderDate',
      header: 'Date',
      render: (item: Order) =>
        format(new Date(item.OrderDate), 'dd MMM yyyy HH:mm', { locale: fr }),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mes Commandes</h1>
          <p className="mt-1 text-muted-foreground">Historique de toutes vos commandes</p>
        </div>

        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          emptyMessage="Aucune commande trouvée"
          getRowKey={(item) => item.ID}
        />
      </div>
    </DashboardLayout>
  );
}
