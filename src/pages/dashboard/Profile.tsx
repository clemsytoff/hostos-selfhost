import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { User, Sparkles, Calendar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Profile() {
  return (
    <DashboardLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center animate-fade-in">
        <div className="max-w-2xl w-full px-4">
          {/* Main Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-card/80 border-2 border-primary/20 shadow-2xl">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-72 h-72 bg-primary rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <div className="relative z-10 p-8 md:p-12 text-center space-y-8">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative bg-gradient-to-br from-primary to-primary/80 p-6 rounded-full shadow-lg">
                    <User className="h-12 w-12 text-primary-foreground" />
                  </div>
                </div>
              </div>

              {/* Sparkles Icon */}
              <div className="flex justify-center">
                <Sparkles className="h-8 w-8 text-primary animate-bounce" />
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Fonctionnalité à Venir
                </h1>
                <p className="text-xl text-muted-foreground font-medium">
                  Bientôt disponible
                </p>
              </div>

              {/* Description */}
              <div className="space-y-4 text-muted-foreground max-w-md mx-auto">
                <p className="text-lg">
                  Nous travaillons actuellement sur une page de profil complète qui vous permettra de gérer vos informations personnelles.
                </p>
                <p>
                  Cette fonctionnalité sera disponible très prochainement. Restez connecté !
                </p>
              </div>

              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 border border-border/50">
                  <User className="h-6 w-6 text-primary mb-2" />
                  <p className="text-sm font-semibold text-foreground">Informations</p>
                  <p className="text-xs text-muted-foreground text-center">Gérez vos données</p>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 border border-border/50">
                  <Calendar className="h-6 w-6 text-primary mb-2" />
                  <p className="text-sm font-semibold text-foreground">Historique</p>
                  <p className="text-xs text-muted-foreground text-center">Consultez vos activités</p>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 border border-border/50">
                  <Zap className="h-6 w-6 text-primary mb-2" />
                  <p className="text-sm font-semibold text-foreground">Paramètres</p>
                  <p className="text-xs text-muted-foreground text-center">Personnalisez votre compte</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-6">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => window.history.back()}
                >
                  Retour au tableau de bord
                </Button>
              </div>

              {/* Progress Indicator */}
              <div className="pt-8">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>En cours de développement</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

