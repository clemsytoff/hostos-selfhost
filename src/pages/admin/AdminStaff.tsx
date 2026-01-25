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

interface Staff {
  ID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  RoleID: number;
  CreatedAt: string;
}

export default function AdminStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filtered, setFiltered] = useState<Staff[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [deleteStaff, setDeleteStaff] = useState<Staff | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: 1,
  });
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    roleId: 1,
  });

  const fetchStaff = async () => {
    const { data } = await adminApi.getStaff();
    if (data) {
      setStaff(data);
      setFiltered(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      staff.filter(
        (s) =>
          s.FirstName.toLowerCase().includes(q) ||
          s.LastName.toLowerCase().includes(q) ||
          s.Email.toLowerCase().includes(q)
      )
    );
  }, [search, staff]);

  const resetCreateForm = () => {
    setCreateForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      roleId: 1,
    });
  };

  const handleCreate = async () => {
    if (!createForm.firstName || !createForm.lastName || !createForm.email || !createForm.password) {
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
    const { error } = await adminApi.createStaff({
      FirstName: createForm.firstName,
      LastName: createForm.lastName,
      Email: createForm.email,
      Password: createForm.password,
      RoleID: createForm.roleId,
    });

    setIsCreating(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Staff créé avec succès');
      setShowCreate(false);
      resetCreateForm();
      fetchStaff();
    }
  };

  const handleEdit = (member: Staff) => {
    setEditStaff(member);
    setEditForm({
      firstName: member.FirstName,
      lastName: member.LastName,
      email: member.Email,
      roleId: member.RoleID,
    });
  };

  const handleSave = async () => {
    if (!editStaff) return;
    setIsSaving(true);

    const { error } = await adminApi.editStaff(editStaff.ID, {
      FirstName: editForm.firstName,
      LastName: editForm.lastName,
      Email: editForm.email,
      RoleID: editForm.roleId,
    });

    setIsSaving(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Staff modifié avec succès');
      setEditStaff(null);
      fetchStaff();
    }
  };

  const handleDelete = async () => {
    if (!deleteStaff) return;
    setIsDeleting(true);

    const { error } = await adminApi.deleteStaff(deleteStaff.ID);
    setIsDeleting(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Staff supprimé avec succès');
      setDeleteStaff(null);
      fetchStaff();
    }
  };

  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case 1:
        return 'Admin';
      case 2:
        return 'Modérateur';
      default:
        return 'Inconnu';
    }
  };

  const columns = [
    { key: 'ID', header: 'ID', render: (item: Staff) => `#${item.ID}` },
    {
      key: 'name',
      header: 'Nom',
      render: (item: Staff) => `${item.FirstName} ${item.LastName}`,
    },
    { key: 'Email', header: 'Email' },
    {
      key: 'RoleID',
      header: 'Rôle',
      render: (item: Staff) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {getRoleName(item.RoleID)}
        </span>
      ),
    },
    {
      key: 'CreatedAt',
      header: 'Créé le',
      render: (item: Staff) =>
        format(new Date(item.CreatedAt), 'dd MMM yyyy', { locale: fr }),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Staff) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteStaff(item)}
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
            <h1 className="text-3xl font-bold text-foreground">Staff</h1>
            <p className="mt-1 text-muted-foreground">Gérez les membres du staff</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Créer un nouveau staff
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un membre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          emptyMessage="Aucun membre du staff trouvé"
          getRowKey={(item) => item.ID}
        />

        {/* Create Dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau membre du staff</DialogTitle>
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
              <div className="space-y-2">
                <Label>Rôle</Label>
                <select
                  value={createForm.roleId}
                  onChange={(e) => setCreateForm({ ...createForm, roleId: parseInt(e.target.value) })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                >
                  <option value={1}>Admin</option>
                  <option value={2}>Modérateur</option>
                </select>
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
        <Dialog open={!!editStaff} onOpenChange={() => setEditStaff(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le membre du staff</DialogTitle>
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
                <Label>Rôle</Label>
                <select
                  value={editForm.roleId}
                  onChange={(e) => setEditForm({ ...editForm, roleId: parseInt(e.target.value) })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                >
                  <option value={1}>Admin</option>
                  <option value={2}>Modérateur</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditStaff(null)}>
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={!!deleteStaff} onOpenChange={() => setDeleteStaff(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer{' '}
              <strong>
                {deleteStaff?.FirstName} {deleteStaff?.LastName}
              </strong>{' '}
              du staff ? Cette action est irréversible.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteStaff(null)}>
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
