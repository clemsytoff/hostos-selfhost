import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, UserPlus, ArrowLeft, Shield, Lock, KeyRound } from 'lucide-react';

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { adminRegister } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);
    const { error } = await adminRegister({
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Email: formData.email,
      Password: formData.password,
    });
    setIsLoading(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Compte administrateur créé avec succès ! Vous pouvez maintenant vous connecter.');
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10 max-w-lg text-center text-primary-foreground">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center mb-8 border border-primary-foreground/20">
            <Shield className="h-10 w-10 text-primary-foreground" />
          </div>
          <h2 className="text-4xl font-bold mb-6">Rejoignez l'équipe d'administration</h2>
          <p className="text-lg opacity-90 mb-8">
            Créez votre compte administrateur et accédez au panel de gestion complet de HostOS.
          </p>
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-start gap-3 p-4 bg-primary-foreground/10 rounded-lg backdrop-blur-sm border border-primary-foreground/20">
              <Lock className="h-5 w-5 text-primary-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Accès complet</p>
                <p className="text-sm opacity-80">Gérez clients, services, commandes et plus encore</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-primary-foreground/10 rounded-lg backdrop-blur-sm border border-primary-foreground/20">
              <KeyRound className="h-5 w-5 text-primary-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Sécurité renforcée</p>
                <p className="text-sm opacity-80">Interface sécurisée avec authentification avancée</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Créer un compte administrateur</h1>
            <p className="mt-2 text-muted-foreground">Inscrivez-vous pour accéder au panel d'administration</p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-elevated border border-border">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="h-11 pr-12"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Minimum 8 caractères</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="h-11 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base mt-6" disabled={isLoading}>
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-r-transparent" />
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Créer mon compte admin
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Déjà un compte administrateur ?{' '}
              <Link to="/admin/login" className="text-primary font-medium hover:underline">
                Se connecter
              </Link>
            </p>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l'espace client
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
