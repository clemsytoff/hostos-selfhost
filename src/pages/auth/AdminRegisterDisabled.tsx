import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Lock, ArrowLeft } from 'lucide-react';

export default function AdminRegisterDisabled() {
  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-sidebar-foreground">Inscription désactivée</h1>
          <p className="mt-2 text-sidebar-muted">L'enregistrement administrateur n'est pas disponible</p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-elevated">
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <Shield className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Enregistrement administrateur désactivé
                </p>
                <p className="text-sm text-muted-foreground">
                  La création de nouveaux comptes administrateurs a été désactivée par l'administrateur système.
                  Veuillez contacter un administrateur existant pour obtenir un accès.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Vous avez déjà un compte administrateur ?
              </p>
              <Button asChild className="w-full h-11">
                <Link to="/admin/login">
                  Se connecter
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm text-sidebar-muted hover:text-sidebar-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'espace client
        </Link>
      </div>
    </div>
  );
}

