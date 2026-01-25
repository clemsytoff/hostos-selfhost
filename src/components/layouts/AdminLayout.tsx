import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { config } from '@/config';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Package,
  ClipboardList,
  Clock,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Shield,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Footer } from './Footer';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Clients', href: '/admin/customers', icon: <Users className="h-5 w-5" /> },
  { label: 'Staff', href: '/admin/staff', icon: <UserCog className="h-5 w-5" /> },
  { label: 'Produits', href: '/admin/products', icon: <Package className="h-5 w-5" /> },
  { label: 'Commandes', href: '/admin/orders', icon: <ClipboardList className="h-5 w-5" /> },
  { label: 'Commandes en attente', href: '/admin/orders/pending', icon: <Clock className="h-5 w-5" /> },
  { label: 'Services actifs', href: '/admin/services', icon: <SettingsIcon className="h-5 w-5" /> },
  { label: 'Mises à jour', href: '/admin/updates', icon: <RefreshCw className="h-5 w-5" /> },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const response = await fetch('https://api.ionagroup.fr/hostos/updates');
        const updates = await response.json();
        if (updates && updates.length > 0) {
          const latestVersion = updates[0].version;
          const currentVersion = config.version.replace('V', '');
          setHasUpdate(latestVersion !== currentVersion);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des mises à jour:', error);
      }
    };
    checkForUpdates();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-sidebar border-b border-sidebar-border px-4 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2 text-xl font-bold text-sidebar-foreground">
          <Shield className="h-6 w-6 text-primary" />
          Admin
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
            <Link to="/admin" className="flex items-center gap-2 text-xl font-bold text-sidebar-foreground">
              <Shield className="h-6 w-6 text-primary" />
              Admin Panel
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative',
                  location.pathname === item.href
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                {item.icon}
                {item.label}
                {item.href === '/admin/updates' && hasUpdate && (
                  <span className="absolute right-2 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t border-sidebar-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors">
                  <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                    {user?.firstName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-sidebar-foreground">{user?.firstName}</p>
                    <p className="text-xs text-sidebar-muted">Administrateur</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-sidebar-muted" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen flex flex-col">
        <div className="p-6 lg:p-8 flex-1">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
