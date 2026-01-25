import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { dashboardApi } from '@/lib/api';
import { Package, Clock, Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface Stats {
  active_services: number;
  pending_orders: number;
  total_spent: number;
}

interface Service {
  ServiceID: number;
  ProductName: string;
  Status: 'Active' | 'Expired';
  DaysRemaining: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [statsRes, servicesRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getMyServices(),
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (servicesRes.data) setServices(servicesRes.data.slice(0, 5));
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const serviceColumns = [
    { key: 'ProductName', header: 'Service' },
    {
      key: 'Status',
      header: 'Statut',
      render: (item: Service) => <StatusBadge status={item.Status} />,
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
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bonjour, {user?.firstName} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Voici un aperçu de votre compte
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard
            title="Services actifs"
            value={stats?.active_services ?? '-'}
            icon={<Package className="h-6 w-6" />}
            variant="primary"
          />
          <StatCard
            title="Commandes en attente"
            value={stats?.pending_orders ?? '-'}
            icon={<Clock className="h-6 w-6" />}
            variant="warning"
          />
          <StatCard
            title="Total dépensé"
            value={stats ? `${stats.total_spent.toFixed(2)} €` : '-'}
            icon={<Wallet className="h-6 w-6" />}
            variant="success"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/dashboard/shop"
            className="group relative overflow-hidden rounded-xl bg-card p-6 shadow-card hover:shadow-elevated transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Découvrir nos services</h3>
                <p className="text-sm text-muted-foreground">Parcourez notre catalogue</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>

          <Link
            to="/dashboard/services"
            className="group relative overflow-hidden rounded-xl bg-card p-6 shadow-card hover:shadow-elevated transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Gérer mes services</h3>
                <p className="text-sm text-muted-foreground">Voir tous vos services actifs</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </div>

        {/* Recent Services */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Mes services récents</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/services">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <DataTable
            columns={serviceColumns}
            data={services}
            isLoading={isLoading}
            emptyMessage="Aucun service actif"
            getRowKey={(item) => item.ServiceID}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
