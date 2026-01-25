/**
 * Configuration centralisée de l'application
 * Les valeurs par défaut sont chargées depuis config.json au runtime
 * Vous pouvez modifier public/config.json après la compilation
 */

// Valeurs par défaut (utilisées si config.json n'est pas disponible)
const defaultConfig = {
  appName: 'DEMO - HostOS',
  appDescription: 'HostOS Application - A CMS for Hosts',
  apiUrl: import.meta.env.VITE_API_URL || 'https://hostosapi.ionagroup.fr',
  allowAdminRegister: 1, // 0 = désactivé, 1 = activé
  Maintenance_mode: 0, // 0 = désactivé, 1 = activé
  faviconUrl: 'https://ionagroup.fr/img/logo/logov1.png',
  discordUrl: 'https://discord.gg/694D9FAE99',
  version: 'V1.1.7.1',
};

// Configuration mutable qui sera mise à jour après le chargement du JSON
export const config: typeof defaultConfig = { ...defaultConfig };

// Interface pour le fichier JSON
interface ConfigJson {
  appName?: string;
  appDescription?: string;
  apiUrl?: string;
  allowAdminRegister?: number; // 0 = désactivé, 1 = activé
  Maintenance_mode?: number; // 0 = désactivé, 1 = activé
  faviconUrl?: string;
  discordUrl?: string;
  version?: string;
}

/**
 * Charge la configuration depuis config.json
 * Cette fonction est appelée au démarrage de l'application
 */
export async function loadConfig(): Promise<void> {
  try {
    const response = await fetch('/config.json');
    if (response.ok) {
      const jsonConfig: ConfigJson = await response.json();
      
      // Fusionner les valeurs du JSON avec les valeurs par défaut
      if (jsonConfig.appName !== undefined) config.appName = jsonConfig.appName;
      if (jsonConfig.appDescription !== undefined) config.appDescription = jsonConfig.appDescription;
      if (jsonConfig.apiUrl !== undefined) config.apiUrl = jsonConfig.apiUrl;
      if (jsonConfig.allowAdminRegister !== undefined) config.allowAdminRegister = jsonConfig.allowAdminRegister;
      if (jsonConfig.Maintenance_mode !== undefined) config.Maintenance_mode = jsonConfig.Maintenance_mode;
      if (jsonConfig.faviconUrl !== undefined) config.faviconUrl = jsonConfig.faviconUrl;
      if (jsonConfig.discordUrl !== undefined) config.discordUrl = jsonConfig.discordUrl;
      if (jsonConfig.version !== undefined) config.version = jsonConfig.version;
      
      console.log('Configuration chargée depuis config.json');
    } else {
      console.warn('Impossible de charger config.json, utilisation des valeurs par défaut');
    }
  } catch (error) {
    console.warn('Erreur lors du chargement de config.json, utilisation des valeurs par défaut:', error);
  }
}

