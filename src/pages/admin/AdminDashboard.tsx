import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { StatCard } from '@/components/ui/stat-card';
import { adminApi, ordersApi, productsApi } from '@/lib/api';
import { Users, UserCog, Package, Clock, Wallet, ClipboardList, ShieldOff, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { config } from '@/config';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [adminRegisterEnabled, setAdminRegisterEnabled] = useState(() => {
    return localStorage.getItem('admin_register_disabled') !== 'true';
  });
  const [stats, setStats] = useState({
    customers: 0,
    staff: 0,
    products: 0,
    pendingOrders: 0,
    activeServices: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState<{ available: boolean; latestVersion: string } | null>(null);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const response = await fetch('https://api.ionagroup.fr/hostos/updates');
        const updates = await response.json();
        if (updates && updates.length > 0) {
          const latestVersion = updates[0].version;
          const currentVersion = config.version.replace('V', '');
          setUpdateAvailable({
            available: latestVersion !== currentVersion,
            latestVersion,
          });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des mises à jour:', error);
      }
    };
    checkForUpdates();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const [customersRes, staffRes, productsRes, pendingRes, servicesRes] = await Promise.all([
        adminApi.getCustomers(),
        adminApi.getStaff(),
        productsApi.getAll(),
        ordersApi.getPending(),
        ordersApi.getActiveServices(),
      ]);

      setStats({
        customers: customersRes.data?.length || 0,
        staff: staffRes.data?.length || 0,
        products: productsRes.data?.length || 0,
        pendingOrders: pendingRes.data?.length || 0,
        activeServices: servicesRes.data?.length || 0,
        totalRevenue: servicesRes.data?.reduce((sum, s) => sum + s.RecurentPrice, 0) || 0,
      });
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  const toggleAdminRegister = () => {
    const newValue = !adminRegisterEnabled;
    setAdminRegisterEnabled(newValue);
    if (newValue) {
      localStorage.removeItem('admin_register_disabled');
      toast.success('Inscription admin activée');
    } else {
      localStorage.setItem('admin_register_disabled', 'true');
      toast.success('Inscription admin désactivée');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        {updateAvailable?.available && (
          <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="font-semibold">Mise à jour disponible !</AlertTitle>
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
              <span>
                Une nouvelle version ({updateAvailable.latestVersion}) est disponible. Vous utilisez actuellement la version {config.version}.
              </span>
              <Button asChild size="sm" variant="destructive" className="w-fit">
                <Link to="/admin/updates">Voir les mises à jour</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Dashboard Administrateur
            </h1>
            <p className="mt-1 text-muted-foreground">
              Bienvenue {user?.firstName}, voici un aperçu global
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
            {adminRegisterEnabled ? (
              <ShieldCheck className="h-5 w-5 text-success" />
            ) : (
              <ShieldOff className="h-5 w-5 text-destructive" />
            )}
            <Label htmlFor="admin-register" className="text-sm font-medium cursor-pointer">
              Inscription admin
            </Label>
            <Switch
              id="admin-register"
              checked={adminRegisterEnabled}
              onCheckedChange={toggleAdminRegister}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Clients"
              value={stats.customers}
              icon={<Users className="h-6 w-6" />}
              variant="primary"
            />
            <StatCard
              title="Staff"
              value={stats.staff}
              icon={<UserCog className="h-6 w-6" />}
            />
            <StatCard
              title="Produits"
              value={stats.products}
              icon={<Package className="h-6 w-6" />}
            />
            <StatCard
              title="Commandes en attente"
              value={stats.pendingOrders}
              icon={<Clock className="h-6 w-6" />}
              variant="warning"
            />
            <StatCard
              title="Services actifs"
              value={stats.activeServices}
              icon={<ClipboardList className="h-6 w-6" />}
              variant="success"
            />
            <StatCard
              title="Revenus récurrents"
              value={`${stats.totalRevenue.toFixed(2)} €`}
              icon={<Wallet className="h-6 w-6" />}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
