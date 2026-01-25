import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Package, Users } from 'lucide-react';
import { config } from '@/config';
import { Footer } from '@/components/layouts/Footer';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <nav className="relative z-10 container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">{config.appName}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Créer un compte</Link>
            </Button>
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
            Gérez vos services avec{' '}
            <span className="text-primary">simplicité</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            Une plateforme moderne pour gérer vos clients, commandes et services en toute simplicité.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/register">
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Déjà inscrit ?</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-16">
            Tout ce dont vous avez besoin
          </h2>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <div className="bg-card rounded-xl p-8 shadow-card">
              <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-6">
                <Package className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Catalogue produits</h3>
              <p className="text-muted-foreground">
                Gérez vos produits et services avec des options de stock et de tarification flexibles.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-card">
              <div className="h-14 w-14 rounded-xl gradient-success flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-success-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Gestion clients</h3>
              <p className="text-muted-foreground">
                Suivez vos clients, leurs commandes et leurs services actifs en temps réel.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-card">
              <div className="h-14 w-14 rounded-xl gradient-warning flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-warning-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Panel Admin</h3>
              <p className="text-muted-foreground">
                Interface d'administration puissante pour gérer l'ensemble de votre activité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-2xl gradient-primary p-12 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Prêt à démarrer ?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Créez votre compte gratuitement et commencez à gérer vos services dès aujourd'hui.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">
                Créer un compte
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
