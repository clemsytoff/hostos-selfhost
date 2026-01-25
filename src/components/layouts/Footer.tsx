import { config } from '@/config';

export function Footer() {
  return (
    <footer className="bg-muted/50 py-8">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>
          © 2026 HostOS — Développé par{' '}
          <a 
            href="https://clement.ionagroup.fr/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Clément Buchweiller
          </a>
          {' '}— Open Source sur{' '}
          <a 
            href="https://github.com/clemsytoff/hostos-cms" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            GitHub
          </a>
        </p>
        <p className="mt-2 text-sm">
          HostOS {config.version}
        </p>
      </div>
    </footer>
  );
}

