import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { productsApi, ordersApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ShoppingCart, Package } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Product {
  ID: number;
  ProductName: string;
  Description: string;
  Price: number;
  StockQuantity: number;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderingId, setOrderingId] = useState<number | null>(null);
  const [confirmProduct, setConfirmProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await productsApi.getAll();
      if (data) setProducts(data);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  const handleConfirmOrder = async () => {
    if (!confirmProduct) return;
    
    setOrderingId(confirmProduct.ID);
    const { error } = await ordersApi.create(confirmProduct.ID);
    setOrderingId(null);
    setConfirmProduct(null);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Commande passée avec succès !');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Boutique</h1>
          <p className="mt-1 text-muted-foreground">
            Découvrez nos services et passez commande
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Aucun produit disponible</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.ID}
                className="group relative overflow-hidden rounded-xl bg-card shadow-card hover:shadow-elevated transition-all"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Package className="h-16 w-16 text-primary/50" />
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{product.ProductName}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {product.Description || 'Aucune description disponible'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{product.Price.toFixed(2)} €</p>
                      <p className="text-xs text-muted-foreground">
                        {product.StockQuantity > 0
                          ? `${product.StockQuantity} en stock`
                          : 'Rupture de stock'}
                      </p>
                    </div>
                    <Button
                      onClick={() => setConfirmProduct(product)}
                      disabled={orderingId === product.ID || product.StockQuantity === 0}
                      size="sm"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Commander
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AlertDialog open={!!confirmProduct} onOpenChange={(open) => !open && setConfirmProduct(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la commande</AlertDialogTitle>
              <AlertDialogDescription>
                Voulez-vous vraiment commander <strong>{confirmProduct?.ProductName}</strong> pour <strong>{confirmProduct?.Price.toFixed(2)} €</strong> ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={orderingId !== null}>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmOrder} disabled={orderingId !== null}>
                {orderingId !== null ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-r-transparent" />
                ) : (
                  'Confirmer'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
