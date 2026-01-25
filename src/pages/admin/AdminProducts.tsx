import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { DataTable } from '@/components/ui/data-table';
import { productsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';

interface Product {
  ID: number;
  ProductName: string;
  Description: string;
  Price: number;
  StockQuantity: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });

  const fetchProducts = async () => {
    const { data } = await productsApi.getAll();
    if (data) {
      setProducts(data);
      setFiltered(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      products.filter((p) => p.ProductName.toLowerCase().includes(q))
    );
  }, [search, products]);

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', stock: '' });
  };

  const handleCreate = async () => {
    if (!form.name || !form.price) {
      toast.error('Nom et prix sont obligatoires');
      return;
    }

    setIsSaving(true);
    const { error } = await productsApi.create({
      ProductName: form.name,
      Description: form.description,
      Price: parseFloat(form.price),
      StockQuantity: form.stock ? parseInt(form.stock) : 0,
    });

    setIsSaving(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Produit créé avec succès');
      setShowCreate(false);
      resetForm();
      fetchProducts();
    }
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setForm({
      name: product.ProductName,
      description: product.Description || '',
      price: product.Price.toString(),
      stock: product.StockQuantity.toString(),
    });
  };

  const handleSave = async () => {
    if (!editProduct) return;
    setIsSaving(true);

    const { error } = await productsApi.edit(editProduct.ID, {
      ProductName: form.name,
      Description: form.description,
      Price: parseFloat(form.price),
      StockQuantity: parseInt(form.stock) || 0,
    });

    setIsSaving(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Produit modifié avec succès');
      setEditProduct(null);
      resetForm();
      fetchProducts();
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    setIsDeleting(true);

    const { error } = await productsApi.delete(deleteProduct.ID);
    setIsDeleting(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Produit supprimé avec succès');
      setDeleteProduct(null);
      fetchProducts();
    }
  };

  const columns = [
    { key: 'ID', header: 'ID', render: (item: Product) => `#${item.ID}` },
    {
      key: 'ProductName',
      header: 'Produit',
      render: (item: Product) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <span className="font-medium">{item.ProductName}</span>
        </div>
      ),
    },
    {
      key: 'Price',
      header: 'Prix',
      render: (item: Product) => `${item.Price.toFixed(2)} €`,
    },
    {
      key: 'StockQuantity',
      header: 'Stock',
      render: (item: Product) => (
        <span
          className={
            item.StockQuantity === 0
              ? 'text-destructive font-medium'
              : item.StockQuantity <= 5
              ? 'text-warning font-medium'
              : ''
          }
        >
          {item.StockQuantity}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Product) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteProduct(item)}
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
            <h1 className="text-3xl font-bold text-foreground">Produits</h1>
            <p className="mt-1 text-muted-foreground">Gérez votre catalogue</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau produit
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          emptyMessage="Aucun produit trouvé"
          getRowKey={(item) => item.ID}
        />

        {/* Create Dialog */}
        <Dialog open={showCreate} onOpenChange={(open) => { setShowCreate(open); if (!open) resetForm(); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau produit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nom du produit *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Service Premium"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description du produit..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prix (€) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowCreate(false); resetForm(); }}>
                Annuler
              </Button>
              <Button onClick={handleCreate} disabled={isSaving}>
                {isSaving ? 'Création...' : 'Créer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editProduct} onOpenChange={() => { setEditProduct(null); resetForm(); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le produit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nom du produit</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prix (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setEditProduct(null); resetForm(); }}>
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer <strong>{deleteProduct?.ProductName}</strong> ?
              Cette action est irréversible.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteProduct(null)}>
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
