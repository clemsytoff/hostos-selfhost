import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { config } from '@/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, AlertCircle, ExternalLink, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Update {
  version: string;
  name: string;
  description: string;
  status: string;
  published_at: string;
}

const DISCORD_SUPPORT_URL = 'https://discord.gg/KuCnYvqNzV';

export default function AdminUpdates() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentVersion = config.version.replace('V', '');

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch('https://api.ionagroup.fr/hostos/updates');
        if (!response.ok) throw new Error('Erreur lors de la récupération des mises à jour');
        const data: Update[] = await response.json();
        setUpdates(data);
        if (data.length > 0) {
          setSelectedUpdate(data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  const latestVersion = updates.length > 0 ? updates[0].version : null;

  const compareVersions = (v1: string, v2: string): number => {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      if (p1 > p2) return 1;
      if (p1 < p2) return -1;
    }
    return 0;
  };

  const isUpToDate = latestVersion ? compareVersions(currentVersion, latestVersion) >= 0 : true;

  const formatDate = (dateString: string) => {
    try {
      // Parse la date sans conversion de fuseau horaire
      const [datePart, timePart] = dateString.split(' ');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hours, minutes] = timePart ? timePart.split(':').map(Number) : [0, 0];
      const date = new Date(year, month - 1, day, hours, minutes);
      return format(date, 'dd MMMM yyyy à HH:mm', { locale: fr });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-muted animate-pulse rounded-xl" />
            <div className="h-64 bg-muted animate-pulse rounded-xl" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Mises à jour</h1>
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header avec statut */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mises à jour</h1>
            <p className="mt-1 text-muted-foreground">
              Gérez les mises à jour de votre application
            </p>
          </div>
        </div>

        {/* Bandeau de statut */}
        <Card className={isUpToDate ? 'border-success/50 bg-success/5' : 'border-warning/50 bg-warning/5'}>
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {isUpToDate ? (
                  <CheckCircle className="h-6 w-6 text-success" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-warning" />
                )}
                <div>
                  <p className="font-medium text-foreground">
                    {isUpToDate ? 'Votre application est à jour' : 'Une mise à jour est disponible'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Version actuelle: <span className="font-mono font-semibold">{currentVersion}</span>
                    {latestVersion && (
                      <> • Dernière version: <span className="font-mono font-semibold">{latestVersion}</span></>
                    )}
                  </p>
                </div>
              </div>
              {!isUpToDate && (
                <Button asChild className="gap-2">
                  <a href={DISCORD_SUPPORT_URL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Demander la mise à jour
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contenu principal */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Détails de la mise à jour sélectionnée */}
          <div className="lg:col-span-2">
            {selectedUpdate ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl">{selectedUpdate.name}</CardTitle>
                      <CardDescription className="mt-2 flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <Tag className="h-4 w-4" />
                          Version {selectedUpdate.version}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {formatDate(selectedUpdate.published_at)}
                        </span>
                        <Badge 
                          variant={selectedUpdate.status === 'published' ? 'default' : 'outline'}
                          className={selectedUpdate.status === 'published' ? 'bg-success text-success-foreground' : ''}
                        >
                          {selectedUpdate.status === 'published' ? 'Publiée' : selectedUpdate.status}
                        </Badge>
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={selectedUpdate.version === currentVersion ? 'default' : 'secondary'}
                    >
                      {selectedUpdate.version === currentVersion ? 'Installée' : 'Disponible'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {selectedUpdate.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Sélectionnez une mise à jour pour voir les détails
                </CardContent>
              </Card>
            )}
          </div>

          {/* Liste des mises à jour */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Historique des versions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="px-4 pb-4 space-y-2">
                  {updates.map((update) => (
                    <button
                      key={update.version}
                      onClick={() => setSelectedUpdate(update)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedUpdate?.version === update.version
                          ? 'bg-primary/10 border border-primary/30'
                          : 'hover:bg-muted border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-foreground">{update.name}</span>
                        <div className="flex items-center gap-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${update.status === 'published' ? 'border-success text-success' : ''}`}
                          >
                            {update.status === 'published' ? 'Publiée' : update.status}
                          </Badge>
                          {update.version === currentVersion && (
                            <Badge variant="outline" className="text-xs">Actuelle</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="font-mono">v{update.version}</span>
                        <span>•</span>
                        <span>{format(new Date(update.published_at), 'dd/MM/yyyy', { locale: fr })}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
