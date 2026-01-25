import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { dashboardApi } from '@/lib/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Service {
  ServiceID: number;
  StartedAt: string;
  EndedAt: string;
  ProductName: string;
  Description: string;
  Price: number;
  DaysRemaining: number;
  Status: 'Active' | 'Expired';
}

export default function MyServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await dashboardApi.getMyServices();
      if (data) setServices(data);
      setIsLoading(false);
    };

    fetchServices();
  }, []);

  const columns = [
    { key: 'ProductName', header: 'Service' },
    {
      key: 'Status',
      header: 'Statut',
      render: (item: Service) => <StatusBadge status={item.Status} />,
    },
    {
      key: 'StartedAt',
      header: 'Date de début',
      render: (item: Service) =>
        format(new Date(item.StartedAt), 'dd MMM yyyy', { locale: fr }),
    },
    {
      key: 'EndedAt',
      header: "Date d'expiration",
      render: (item: Service) =>
        format(new Date(item.EndedAt), 'dd MMM yyyy', { locale: fr }),
    },
    {
      key: 'DaysRemaining',
      header: 'Jours restants',
      render: (item: Service) => (
        <span className={item.DaysRemaining <= 7 ? 'text-warning font-medium' : ''}>
          {item.DaysRemaining > 0 ? `${item.DaysRemaining} jours` : 'Expiré'}
        </span>
      ),
    },
    {
      key: 'Price',
      header: 'Prix',
      render: (item: Service) => `${item.Price.toFixed(2)} €`,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mes Services</h1>
          <p className="mt-1 text-muted-foreground">Gérez vos services actifs et leur renouvellement</p>
        </div>

        <DataTable
          columns={columns}
          data={services}
          isLoading={isLoading}
          emptyMessage="Vous n'avez aucun service actif"
          getRowKey={(item) => item.ServiceID}
        />
      </div>
    </DashboardLayout>
  );
}
