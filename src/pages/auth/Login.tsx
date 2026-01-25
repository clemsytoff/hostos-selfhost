import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    const { error } = await login(email, password);
    setIsLoading(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Bienvenue</h1>
            <p className="mt-2 text-muted-foreground">
              Connectez-vous à votre espace client
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-r-transparent" />
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Se connecter
                </>
              )}
            </Button>
          </form>

          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Créer un compte
              </Link>
            </p>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            <Link
              to="/admin/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Accéder au panel administrateur
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-12">
        <div className="max-w-lg text-center text-primary-foreground">
          <h2 className="text-4xl font-bold mb-6">Gérez vos services en toute simplicité</h2>
          <p className="text-lg opacity-90">
            Accédez à votre espace personnel pour suivre vos commandes, gérer vos services et
            découvrir nos offres.
          </p>
        </div>
      </div>
    </div>
  );
}
