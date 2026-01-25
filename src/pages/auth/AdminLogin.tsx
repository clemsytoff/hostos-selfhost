import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    const { error } = await adminLogin(email, password);
    setIsLoading(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Connexion réussie !');
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-sidebar-foreground">Administration</h1>
          <p className="mt-2 text-sidebar-muted">Connectez-vous au panel admin</p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-elevated">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
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
                'Se connecter'
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Nouvel administrateur ?{' '}
              <Link to="/admin/register" className="text-primary font-medium hover:underline">
                Créer un compte admin
              </Link>
            </p>
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
