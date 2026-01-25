import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { DataTable } from '@/components/ui/data-table';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Pencil, Trash2, Search, Plus } from 'lucide-react';

interface Customer {
  ID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  CreatedAt: string;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const fetchCustomers = async () => {
    const { data } = await adminApi.getCustomers();
    if (data) {
      setCustomers(data);
      setFiltered(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      customers.filter(
        (c) =>
          c.FirstName.toLowerCase().includes(q) ||
          c.LastName.toLowerCase().includes(q) ||
          c.Email.toLowerCase().includes(q)
      )
    );
  }, [search, customers]);

  const resetCreateForm = () => {
    setCreateForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
  };

  const handleCreate = async () => {
    if (!createForm.firstName || !createForm.lastName || !createForm.email || !createForm.phone || !createForm.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (createForm.password !== createForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (createForm.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsCreating(true);
    const { error } = await adminApi.createCustomer({
      FirstName: createForm.firstName,
      LastName: createForm.lastName,
      Email: createForm.email,
      PhoneNumber: createForm.phone,
      Password: createForm.password,
    });

    setIsCreating(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Client créé avec succès');
      setShowCreate(false);
      resetCreateForm();
      fetchCustomers();
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditCustomer(customer);
    setEditForm({
      firstName: customer.FirstName,
      lastName: customer.LastName,
      email: customer.Email,
      phone: customer.PhoneNumber,
    });
  };

  const handleSave = async () => {
    if (!editCustomer) return;
    setIsSaving(true);

    const { error } = await adminApi.editCustomer(editCustomer.ID, {
      FirstName: editForm.firstName,
      LastName: editForm.lastName,
      Email: editForm.email,
      PhoneNumber: editForm.phone,
    });

    setIsSaving(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Client modifié avec succès');
      setEditCustomer(null);
      fetchCustomers();
    }
  };

  const handleDelete = async () => {
    if (!deleteCustomer) return;
    setIsDeleting(true);

    const { error } = await adminApi.deleteCustomer(deleteCustomer.ID);
    setIsDeleting(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Client supprimé avec succès');
      setDeleteCustomer(null);
      fetchCustomers();
    }
  };

  const columns = [
    { key: 'ID', header: 'ID', render: (item: Customer) => `#${item.ID}` },
    {
      key: 'name',
      header: 'Nom',
      render: (item: Customer) => `${item.FirstName} ${item.LastName}`,
    },
    { key: 'Email', header: 'Email' },
    { key: 'PhoneNumber', header: 'Téléphone' },
    {
      key: 'CreatedAt',
      header: 'Inscrit le',
      render: (item: Customer) =>
        format(new Date(item.CreatedAt), 'dd MMM yyyy', { locale: fr }),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Customer) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteCustomer(item)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clients</h1>
            <p className="mt-1 text-muted-foreground">Gérez tous les clients</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Créer un nouveau client
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          emptyMessage="Aucun client trouvé"
          getRowKey={(item) => item.ID}
        />

        {/* Create Dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau client</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input
                    value={createForm.firstName}
                    onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                    placeholder="Prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input
                    value={createForm.lastName}
                    onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                    placeholder="Nom"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  type="tel"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                  placeholder="0612345678"
                />
              </div>
              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <Input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label>Confirmer le mot de passe</Label>
                <Input
                  type="password"
                  value={createForm.confirmPassword}
                  onChange={(e) => setCreateForm({ ...createForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowCreate(false); resetCreateForm(); }}>
                Annuler
              </Button>
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? 'Création...' : 'Créer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editCustomer} onOpenChange={() => setEditCustomer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le client</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditCustomer(null)}>
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={!!deleteCustomer} onOpenChange={() => setDeleteCustomer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer le client{' '}
              <strong>
                {deleteCustomer?.FirstName} {deleteCustomer?.LastName}
              </strong>{' '}
              ? Cette action est irréversible.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteCustomer(null)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
