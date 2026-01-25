import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { customerApi, adminApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User, Mail, Phone, Calendar, Save, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UserInfo {
  ID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  CreatedAt: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await customerApi.getInfo(user.id);
      if (data) {
        setUserInfo(data);
        setFormData({
          firstName: data.FirstName,
          lastName: data.LastName,
          email: data.Email,
          phone: data.PhoneNumber,
          password: '',
        });
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    const updateData: Record<string, string> = {};
    
    if (formData.firstName !== userInfo?.FirstName) updateData.FirstName = formData.firstName;
    if (formData.lastName !== userInfo?.LastName) updateData.LastName = formData.lastName;
    if (formData.email !== userInfo?.Email) updateData.Email = formData.email;
    if (formData.phone !== userInfo?.PhoneNumber) updateData.PhoneNumber = formData.phone;
    if (formData.password) updateData.Password = formData.password;

    if (Object.keys(updateData).length === 0) {
      toast.info('Aucune modification détectée');
      setIsSaving(false);
      return;
    }

    const { error } = await adminApi.editCustomer(user.id, updateData);
    setIsSaving(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Profil mis à jour avec succès');
      setFormData((prev) => ({ ...prev, password: '' }));
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mon Profil</h1>
          <p className="mt-1 text-muted-foreground">Gérez vos informations personnelles</p>
        </div>

        {/* Profile Header */}
        <div className="rounded-xl bg-card p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
              {userInfo?.FirstName?.charAt(0)}{userInfo?.LastName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {userInfo?.FirstName} {userInfo?.LastName}
              </h2>
              <p className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Membre depuis{' '}
                {userInfo?.CreatedAt &&
                  format(new Date(userInfo.CreatedAt), 'MMMM yyyy', { locale: fr })}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="rounded-xl bg-card p-6 shadow-card space-y-6">
          <h3 className="text-lg font-semibold text-foreground">Modifier mes informations</h3>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Prénom
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nom
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Téléphone
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe (optionnel)</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Laisser vide pour ne pas modifier"
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

          <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
            {isSaving ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-r-transparent" />
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer les modifications
              </>
            )}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
