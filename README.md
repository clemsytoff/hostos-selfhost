# 🚀 HostOS — CMS d'Hébergement de Nouvelle Génération

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg) 
![Status](https://img.shields.io/badge/status-stable-green.svg)
![License](https://img.shields.io/badge/license-GPL%20v3-blue.svg)

**HostOS** est un CMS d'hébergement open source moderne pour les hébergeurs. Profitez de la puissance d'un front-end **React** entièrement self-hosted et personnalisable.

---
👉 **[Discord communautaire & support]([https://hostos.ionagroup.fr/](https://discord.gg/694D9FAE99))**

### 🛡️ L'Architecture HostOS
HostOS est un CMS moderne entièrement self-hosted et open source :
* **Front-end React** : Interface moderne, fluide et ultra-rapide déployée sur votre infrastructure.
* **Back-end Python Flask** : API REST complète incluse dans le projet, également open source.
* **Base de données** : Template de schéma de base de données inclus pour faciliter la configuration.
* **100% Open Source** : Tout le code source (front-end, back-end, base de données) est librement accessible et modifiable selon vos besoins.
* **Personnalisable** : Contrôle total sur le design, les fonctionnalités et l'expérience utilisateur.

⚠️ **Important** : Vous devez configurer et connecter tous les composants vous-même (front-end, API Flask, base de données). Tout est fourni dans le projet, mais la configuration et le déploiement sont de votre responsabilité.

---

### 🛠️ Fonctionnalités du CMS

#### 👤 Espace Client & Expérience Utilisateur
* **Dashboard Intuitif** : Vue d'ensemble des services actifs et des dernières activités.
* **Historique des Commandes** : Affichage complet des achats avec synchronisation en temps réel (Patch v1.1.7).
* **Sécurité Panier** : Message de confirmation lors de la commande pour éviter les achats involontaires (v1.1.6).
* **Authentification Fluide** : Système de connexion sécurisé avec gestion des erreurs de redirection (Hotfix v1.1.7.1).
* **Édition de Profil** : Page de gestion de compte utilisateur (Work In Progress).

#### 👑 Administration & Staff
* **Panel Admin Puissant** : Interface dédiée pour piloter l'ensemble de l'activité.
* **Gestion du Staff** : Outils de création et d'administration des comptes membres d'équipe (v1.1.3).
* **Commandes Manuelles** : Possibilité pour le staff de créer des services directement pour les clients (v1.1.4).
* **Gestion des Clients** : Création manuelle et suivi des comptes clients.

#### ⚙️ Système & Maintenance
* **Centre d'Updates** : Page dédiée listant l'historique complet des versions et correctifs (v1.1.5).
* **Smart Update Alert** : Icône et notification automatique si votre interface n'est pas à jour (v2.0.1). Les requêtes de mise à jour sont effectuées vers l'API publique pour vous tenir informé des dernières versions disponibles.
* **Architecture React** : Interface compilée pour une fluidité maximale et des temps de chargement réduits (v2.2.0).
* **Personnalisation Totale** : Contrôle des textes (Hero, Features, CTA) via une base de données sécurisée (Work In Progress).
* **Mode maintenance** : Page qui indique que le site est en maintenance, rendant toutes les autres pages inaccessibles (v2.2.1).
---

### 📜 Licence

**Ce projet est sous licence GPL v3 (GNU General Public License version 3).**

#### 🔓 Droits accordés par la GPL v3

La licence GPL v3 vous accorde les libertés suivantes :

* ✅ **Liberté d'utilisation** : Vous pouvez utiliser HostOS pour n'importe quel usage, commercial ou non.
* ✅ **Liberté d'étude** : Vous avez accès au code source complet pour comprendre comment fonctionne le CMS.
* ✅ **Liberté de modification** : Vous pouvez modifier le code selon vos besoins.
* ✅ **Liberté de distribution** : Vous pouvez partager le code original ou modifié.

#### 📋 Obligations de la GPL v3

En contrepartie, la GPL v3 vous impose certaines obligations :

* 📄 **Conservation de la licence** : Si vous distribuez HostOS (original ou modifié), vous devez conserver la licence GPL v3.
* 📄 **Publication du code source** : Si vous distribuez une version modifiée, vous devez rendre le code source disponible sous la même licence GPL v3.
* 📄 **Mention de la licence** : Vous devez inclure une copie de la licence GPL v3 avec toute distribution.

#### 🙏 Demande personnelle de l'auteur

Bien que la GPL v3 ne l'exige pas, **je vous demande respectueusement de conserver le lien vers l'auteur dans le footer** par respect pour le travail fourni. C'est la meilleure façon de soutenir le projet et de montrer votre appréciation.

Le footer par défaut contient :
```
© 2026 HostOS — Développé par Clément Buchweiller — Open Source sur GitHub
```

Vous pouvez personnaliser ce footer, mais je vous serais reconnaissant de conserver au minimum une mention de l'auteur original.

#### 📚 En savoir plus sur la GPL v3

Pour plus d'informations sur la licence GPL v3, consultez :
* [Le texte complet de la licence GPL v3](https://www.gnu.org/licenses/gpl-3.0.html)
* [La FAQ de la Free Software Foundation](https://www.gnu.org/licenses/gpl-faq.html)

👉 **[Voir le code source sur GitHub](https://github.com/clemsytoff/hostos-cms)** | **[Voir la démo en ligne](https://hostos.ionagroup.fr/)** | **[Discord communautaire & support]([https://hostos.ionagroup.fr/](https://discord.gg/694D9FAE99))**
---

### 🚀 Démarrage Rapide

1. **Récupérer le projet**  
   - Téléchargez ou clonez le repository complet.
   - Le projet contient :
     - Le front-end React (dossier `public/` et `src/`)
     - L'API Python Flask (dossier `backend/`)
     - Le template de base de données (dossier `backend/`)

2. **Configurer la base de données**  
   - Importez le template de base de données fourni dans votre système de gestion de base de données (MySQL, PostgreSQL, etc.).
   - Configurez les identifiants de connexion dans votre API Flask.

3. **Configurer l'API Flask**  
   - Installez les dépendances Python nécessaires :
     ```bash
     pip install -r requirements.txt
     ```
   - Configurez les variables d'environnement (connexion à la base de données, clés secrètes, etc.).
   - Démarrez l'API Flask :
     ```bash
     python app.py
     ```
   - Assurez-vous que l'API est accessible et fonctionne correctement.

4. **Configurer le front-end**  
   - Ouvrez `public/config.json` à la racine du projet pour personnaliser votre installation.
   
   #### 📋 Configuration du `config.json`
   
   Le fichier `config.json` permet de personnaliser votre instance HostOS sans recompiler le code. Voici les paramètres disponibles :
   
   | Paramètre | Description | Exemple |
   | :--- | :--- | :--- |
   | `appName` | Nom de l'application affiché dans l'interface | `"Mon HostOS"` |
   | `appDescription` | Description de l'application (métadonnées) | `"HostOS Application - An Open Source CMS for Hosts"` |
   | `apiUrl` | URL de votre API backend | `"https://api.votre-domaine.com"` |
   | `allowAdminRegister` | Autoriser l'inscription admin (`1` = activé, `0` = désactivé) | `0` |
   | `Maintenance_mode` | Mode maintenance (`1` = activé, `0` = désactivé) | `0` |
   | `faviconUrl` | URL du favicon | `"https://votre-domaine.com/favicon.ico"` |
   | `discordUrl` | Lien Discord pour le support | `"https://discord.gg/..."` |
   | `version` | Version de l'application (ne pas modifier) | `"V3.0.0"` |
   
   ⚠️ **Important** : 
   - Les requêtes de mise à jour vers l'API publique (`https://api.ionagroup.fr/hostos/updates`) permettent au panel d'administration de vous informer des dernières versions disponibles. Il est recommandé de laisser ces requêtes actives pour rester informé des mises à jour.
   - Pour sécuriser votre installation, mettez `allowAdminRegister` à `0` après avoir créé votre premier compte administrateur.
   
   Exemple de `config.json` configuré :  
   ```json
   {
     "appName": "Mon HostOS",
     "appDescription": "HostOS Application - An Open Source CMS for Hosts",
     "apiUrl": "https://api.votre-domaine.com",
     "allowAdminRegister": 0,
     "Maintenance_mode": 0,
     "faviconUrl": "https://votre-domaine.com/favicon.ico",
     "discordUrl": "https://discord.gg/694D9FAE99",
     "version": "V2.2.1"
   }
   ```

5. **Lancer l'application**  
   - Assurez-vous que votre API Flask est démarrée et accessible.
   - Ouvrez simplement `index.html` avec un serveur web.
   - Pour un test rapide en local, vous pouvez utiliser :  
     ```bash
     npx serve .
     ```
   - L'application sera accessible sur `http://localhost:3000` (ou le port indiqué)
   - ⚠️ **Important** : Vérifiez que l'`apiUrl` dans `config.json` pointe vers votre API Flask.

6. **Déployer en production**  
   - **Base de données** : Déployez votre base de données sur votre serveur de production.
   - **API Flask** : Déployez votre API Flask (avec Gunicorn, uWSGI, ou autre serveur WSGI).
   - **Front-end** : Déployez tous les fichiers du front-end sur votre serveur web (Apache, Nginx, etc.)
   - Assurez-vous que `config.json` contient vos vraies valeurs (`apiUrl` pointant vers votre API en production, etc.)
   - Configurez votre serveur web pour servir `index.html` pour toutes les routes (SPA)
   - Configurez CORS dans votre API Flask pour autoriser les requêtes depuis votre domaine front-end.

6.1 **Déployer sur Netlify (Recommandé pour le front-end)**  
   - Le projet contient un dossier **Netlify** avec la **version compilée du front-end**, prête à être déployée.
   - Cette version compilée est **plus simple à déployer** car elle ne nécessite pas de compilation.
   - Importez simplement le contenu du dossier Netlify sur Netlify.
   - Assurez-vous que votre API Flask est déployée et accessible publiquement.
   - Assurez-vous que `config.json` dans le dossier Netlify contient l'URL de votre API en production.
   - Netlify configurera automatiquement le déploiement.

7. **C'est prêt !**  
   - L'application chargera automatiquement les paramètres depuis `config.json`.  
   - Toute modification de ce fichier sera prise en compte **sans recompiler**.
   - Rafraîchissez simplement la page dans votre navigateur pour voir les changements.
   - Vérifiez que toutes les connexions fonctionnent : front-end → API → base de données.
