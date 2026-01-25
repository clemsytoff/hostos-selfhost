import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminRegister from "./pages/auth/AdminRegister";
import AdminRegisterDisabled from "./pages/auth/AdminRegisterDisabled";
import MaintenancePage from "./pages/MaintenancePage";
import { config } from "./config";

// Dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import Shop from "./pages/dashboard/Shop";
import MyServices from "./pages/dashboard/MyServices";
import MyOrders from "./pages/dashboard/MyOrders";
import Profile from "./pages/dashboard/Profile";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminPendingOrders from "./pages/admin/AdminPendingOrders";
import AdminServices from "./pages/admin/AdminServices";
import AdminUpdates from "./pages/admin/AdminUpdates";

const queryClient = new QueryClient();

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={requireAdmin ? "/admin/login" : "/login"} replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!requireAdmin && user.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={user.isAdmin ? "/admin" : "/dashboard"} replace />;
  }

  return <>{children}</>;
}

function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  // Si le mode maintenance est activé, afficher la page de maintenance
  if (config.Maintenance_mode === 1) {
    return <MaintenancePage />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      
      {/* Auth routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
      <Route 
        path="/admin/register" 
        element={
          <PublicRoute>
            {config.allowAdminRegister === 1 ? <AdminRegister /> : <AdminRegisterDisabled />}
          </PublicRoute>
        } 
      />

      {/* Client dashboard routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
      <Route path="/dashboard/services" element={<ProtectedRoute><MyServices /></ProtectedRoute>} />
      <Route path="/dashboard/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/customers" element={<ProtectedRoute requireAdmin><AdminCustomers /></ProtectedRoute>} />
      <Route path="/admin/staff" element={<ProtectedRoute requireAdmin><AdminStaff /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute requireAdmin><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute requireAdmin><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/orders/pending" element={<ProtectedRoute requireAdmin><AdminPendingOrders /></ProtectedRoute>} />
      <Route path="/admin/services" element={<ProtectedRoute requireAdmin><AdminServices /></ProtectedRoute>} />
      <Route path="/admin/updates" element={<ProtectedRoute requireAdmin><AdminUpdates /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MaintenanceGuard>
            <AppRoutes />
          </MaintenanceGuard>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
