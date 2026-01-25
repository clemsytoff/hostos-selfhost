import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { ordersApi } from '@/lib/api';
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
import { Pencil, Trash2, Search } from 'lucide-react';

interface Service {
  ID: number;
  Status: string;
  RecurentPrice: number;
  StartedAt: string;
  EndedAt: string;
  CustomerEmail: string;
  ProductName: string;
  CustomerID: number;
  ProductID: number;
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [filtered, setFiltered] = useState<Service[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editService, setEditService] = useState<Service | null>(null);
  const [deleteService, setDeleteService] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    price: '',
    endedAt: '',
  });

  const fetchServices = async () => {
    const { data } = await ordersApi.getActiveServices();
    if (data) {
      setServices(data);
      setFiltered(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      services.filter(
        (s) =>
          s.CustomerEmail.toLowerCase().includes(q) ||
          s.ProductName.toLowerCase().includes(q)
      )
    );
  }, [search, services]);

  const handleEdit = (service: Service) => {
    setEditService(service);
    setEditForm({
      status: service.Status,
      price: service.RecurentPrice.toString(),
      endedAt: service.EndedAt ? service.EndedAt.split(' ')[0] : '',
    });
  };

  const handleSave = async () => {
    if (!editService) return;
    setIsSaving(true);

    const updateData: Record<string, string | number> = {};
    if (editForm.status !== editService.Status) updateData.Status = editForm.status;
    if (parseFloat(editForm.price) !== editService.RecurentPrice)
      updateData.RecurentPrice = parseFloat(editForm.price);
    if (editForm.endedAt) updateData.EndedAt = editForm.endedAt;

    const { error } = await ordersApi.editService(editService.ID, updateData);
    setIsSaving(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Service modifié avec succès');
      setEditService(null);
      fetchServices();
    }
  };

  const handleDelete = async () => {
    if (!deleteService) return;
    setIsDeleting(true);

    const { error } = await ordersApi.terminateService(deleteService.ID);
    setIsDeleting(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Service terminé avec succès');
      setDeleteService(null);
      fetchServices();
    }
  };

  const columns = [
    { key: 'ID', header: 'ID', render: (item: Service) => `#${item.ID}` },
    { key: 'CustomerEmail', header: 'Client' },
    { key: 'ProductName', header: 'Produit' },
    {
      key: 'Status',
      header: 'Statut',
      render: (item: Service) => <StatusBadge status={item.Status} />,
    },
    {
      key: 'RecurentPrice',
      header: 'Prix récurrent',
      render: (item: Service) => `${item.RecurentPrice.toFixed(2)} €`,
    },
    {
      key: 'StartedAt',
      header: 'Début',
      render: (item: Service) =>
        format(new Date(item.StartedAt), 'dd MMM yyyy', { locale: fr }),
    },
    {
      key: 'EndedAt',
      header: 'Fin',
      render: (item: Service) =>
        item.EndedAt ? format(new Date(item.EndedAt), 'dd MMM yyyy', { locale: fr }) : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Service) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteService(item)}
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
        <div>
          <h1 className="text-3xl font-bold text-foreground">Services actifs</h1>
          <p className="mt-1 text-muted-foreground">Gérez les services en cours</p>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          emptyMessage="Aucun service actif"
          getRowKey={(item) => item.ID}
        />

        {/* Edit Dialog */}
        <Dialog open={!!editService} onOpenChange={() => setEditService(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Statut</Label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                >
                  <option value="Active">Actif</option>
                  <option value="Suspended">Suspendu</option>
                  <option value="Expired">Expiré</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Prix récurrent (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input
                  type="date"
                  value={editForm.endedAt}
                  onChange={(e) => setEditForm({ ...editForm, endedAt: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditService(null)}>
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={!!deleteService} onOpenChange={() => setDeleteService(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Terminer le service</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              Êtes-vous sûr de vouloir terminer le service{' '}
              <strong>{deleteService?.ProductName}</strong> pour{' '}
              <strong>{deleteService?.CustomerEmail}</strong> ? Le service sera archivé.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteService(null)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Termination...' : 'Terminer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
