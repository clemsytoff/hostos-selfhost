import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
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
    const { error } = await register({
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Email: formData.email,
      PhoneNumber: formData.phone,
      Password: formData.password,
    });
    setIsLoading(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-12">
        <div className="max-w-lg text-center text-primary-foreground">
          <h2 className="text-4xl font-bold mb-6">Rejoignez-nous dès aujourd'hui</h2>
          <p className="text-lg opacity-90">
            Créez votre compte et accédez à tous nos services premium en quelques clics.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Créer un compte</h1>
            <p className="mt-2 text-muted-foreground">Inscrivez-vous pour commencer</p>
          </div>

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
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="exemple@email.com"
                value={formData.email}
                onChange={handleChange}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="0612345678"
                value={formData.phone}
                onChange={handleChange}
                className="h-11"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="h-11"
              />
            </div>

            <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-r-transparent" />
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Créer mon compte
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
