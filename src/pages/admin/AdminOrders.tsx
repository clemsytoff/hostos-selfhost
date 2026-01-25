import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { ordersApi, adminApi, productsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
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
import { Plus } from 'lucide-react';

interface Order {
  ID: number;
  Status: string;
  TotalAmount: number;
  OrderDate: string;
  CustomerEmail: string;
  ProductName: string;
}

interface Customer {
  ID: number;
  FirstName: string;
  LastName: string;
  Email: string;
}

interface Product {
  ID: number;
  ProductName: string;
  Price: number;
  StockQuantity: number;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    customerId: '',
    productId: '',
  });

    const fetchOrders = async () => {
      const { data } = await ordersApi.getAll();
      if (data) setOrders(data);
      setIsLoading(false);
    };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (showCreate) {
      const loadData = async () => {
        const [customersRes, productsRes] = await Promise.all([
          adminApi.getCustomers(),
          productsApi.getAll(),
        ]);
        if (customersRes.data) setCustomers(customersRes.data);
        if (productsRes.data) setProducts(productsRes.data);
      };
      loadData();
    }
  }, [showCreate]);

  const handleCreate = async () => {
    if (!createForm.customerId || !createForm.productId) {
      toast.error('Veuillez sélectionner un client et un produit');
      return;
    }

    setIsCreating(true);
    const { error } = await ordersApi.create(
      parseInt(createForm.productId),
      parseInt(createForm.customerId)
    );
    setIsCreating(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Commande créée avec succès');
      setShowCreate(false);
      setCreateForm({ customerId: '', productId: '' });
      fetchOrders();
    }
  };

  const columns = [
    { key: 'ID', header: 'N° Commande', render: (item: Order) => `#${item.ID}` },
    { key: 'CustomerEmail', header: 'Client' },
    { key: 'ProductName', header: 'Produit' },
    {
      key: 'Status',
      header: 'Statut',
      render: (item: Order) => <StatusBadge status={item.Status} />,
    },
    {
      key: 'TotalAmount',
      header: 'Montant',
      render: (item: Order) => `${item.TotalAmount.toFixed(2)} €`,
    },
    {
      key: 'OrderDate',
      header: 'Date',
      render: (item: Order) =>
        format(new Date(item.OrderDate), 'dd MMM yyyy HH:mm', { locale: fr }),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Toutes les commandes</h1>
          <p className="mt-1 text-muted-foreground">Historique complet des commandes</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Créer une commande
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          emptyMessage="Aucune commande trouvée"
          getRowKey={(item) => item.ID}
        />

        {/* Create Dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une commande manuellement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Client</Label>
                <select
                  value={createForm.customerId}
                  onChange={(e) => setCreateForm({ ...createForm, customerId: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                >
                  <option value="">Sélectionner un client</option>
                  {customers.map((customer) => (
                    <option key={customer.ID} value={customer.ID}>
                      {customer.FirstName} {customer.LastName} ({customer.Email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Produit</Label>
                <select
                  value={createForm.productId}
                  onChange={(e) => setCreateForm({ ...createForm, productId: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                >
                  <option value="">Sélectionner un produit</option>
                  {products.map((product) => (
                    <option key={product.ID} value={product.ID}>
                      {product.ProductName} - {product.Price.toFixed(2)} €
                      {product.StockQuantity === 0 && ' (Rupture de stock)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowCreate(false); setCreateForm({ customerId: '', productId: '' }); }}>
                Annuler
              </Button>
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? 'Création...' : 'Créer la commande'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
