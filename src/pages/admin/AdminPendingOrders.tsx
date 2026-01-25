import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { ordersApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, X } from 'lucide-react';

interface Order {
  ID: number;
  Status: string;
  TotalAmount: number;
  OrderDate: string;
  CustomerEmail: string;
  ProductName: string;
}

export default function AdminPendingOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    const { data } = await ordersApi.getPending();
    if (data) setOrders(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleValidate = async (orderId: number, status: 'Delivered' | 'Cancelled') => {
    setProcessingId(orderId);
    const { error } = await ordersApi.validate(orderId, status);
    setProcessingId(null);

    if (error) {
      toast.error(error);
    } else {
      toast.success(status === 'Delivered' ? 'Commande validée et service activé' : 'Commande annulée');
      fetchOrders();
    }
  };

  const columns = [
    { key: 'ID', header: 'N° Commande', render: (item: Order) => `#${item.ID}` },
    { key: 'CustomerEmail', header: 'Client' },
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
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Order) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="default"
            className="bg-success hover:bg-success/90"
            onClick={() => handleValidate(item.ID, 'Delivered')}
            disabled={processingId === item.ID}
          >
            <Check className="h-4 w-4 mr-1" />
            Valider
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleValidate(item.ID, 'Cancelled')}
            disabled={processingId === item.ID}
          >
            <X className="h-4 w-4 mr-1" />
            Refuser
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Commandes en attente</h1>
          <p className="mt-1 text-muted-foreground">Validez ou refusez les commandes en attente</p>
        </div>

        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          emptyMessage="Aucune commande en attente"
          getRowKey={(item) => item.ID}
        />
      </div>
    </AdminLayout>
  );
}
