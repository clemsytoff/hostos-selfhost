import { useEffect, useState } from 'react';
import { config, loadConfig } from '@/config';
import AdminRegister from '@/pages/auth/AdminRegister';
import AdminRegisterDisabled from '@/pages/auth/AdminRegisterDisabled';

export default function AdminRegisterRoute() {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConfig = async () => {
      // S'assurer que la config est chargée
      await loadConfig();
      setIsEnabled(config.allowAdminRegister === 1);
    };
    
    checkConfig();
  }, []);

  // Afficher un loader pendant le chargement
  if (isEnabled === null) {
    return (
      <div className="min-h-screen bg-sidebar flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  // Afficher la page appropriée selon la config
  return isEnabled ? <AdminRegister /> : <AdminRegisterDisabled />;
}

