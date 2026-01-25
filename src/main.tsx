import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { config, loadConfig } from "./config";

// Mettre à jour les métadonnées de la page avec la configuration
const updatePageMetadata = () => {
  // Favicon
  const faviconLink = document.getElementById('favicon-link') as HTMLLinkElement;
  if (faviconLink) {
    faviconLink.href = config.faviconUrl;
  }

  // Title
  const title = document.getElementById('page-title');
  if (title) {
    title.textContent = config.appName;
    document.title = config.appName;
  }

  // Description
  const description = document.getElementById('page-description');
  if (description) {
    description.setAttribute('content', config.appDescription);
  }

  // OG Title
  const ogTitle = document.getElementById('og-title');
  if (ogTitle) {
    ogTitle.setAttribute('content', config.appName);
  }

  // OG Description
  const ogDescription = document.getElementById('og-description');
  if (ogDescription) {
    ogDescription.setAttribute('content', config.appDescription);
  }
};

// Charger la configuration et démarrer l'application
async function init() {
  // Charger la configuration depuis config.json
  await loadConfig();
  
  // Mettre à jour les métadonnées avec la configuration chargée
  updatePageMetadata();
  
  // Démarrer l'application React
  createRoot(document.getElementById("root")!).render(<App />);
}

// Initialiser l'application
init();
