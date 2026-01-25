# 🚀 HostOS — CMS d'Hébergement de Nouvelle Génération

![Version](https://img.shields.io/badge/version-2.2.1-blue.svg) 
![Status](https://img.shields.io/badge/status-stable-green.svg)
![License](https://img.shields.io/badge/license-proprietary-red.svg)

**HostOS** est une solution hybride révolutionnaire pour les hébergeurs. Profitez de la puissance d'un front-end **React** moderne en Self-Hosted tout en bénéficiant de la sécurité d'un **Back-end managé** par IonaGroup.

---

### 🛡️ L'Architecture HostOS
Contrairement aux CMS classiques, HostOS sépare l'interface du moteur :
* **Front-end (Vous)** : Déployé sur votre infrastructure, 100% fluide, ultra-rapide (React).
* **Back-end (Nous)** : Centralisé et maintenu par IonaGroup pour garantir une sécurité maximale et des mises à jour automatiques du cœur système sans aucune intervention de votre part.

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
* **Smart Update Alert** : Icône et notification automatique si votre interface n'est pas à jour (v2.0.1).
* **Architecture React** : Interface compilée pour une fluidité maximale et des temps de chargement réduits (v2.2.0).
* **Personnalisation Totale** : Contrôle des textes (Hero, Features, CTA) via une base de données sécurisée (Work In Progress).
- **Mode maintenance** : Page qui indique que le site est en maintenance, rendant toutes les autres pages inaccessibles (v2.2.1).
---

### 🌐 Nos Offres

| Option | Description |
| :--- | :--- |
| **Self-Hosted** | Vous hébergez l'interface sur votre serveur pour un contrôle total du domaine et du style. |
| **On-Host (Managed)** | On s'occupe de TOUT. Hébergement du front et du back pour un lancement en 5 minutes. |

---

### ⚠️ Licence & Conditions d'Utilisation
**Copyright © 2026 IonaGroup - HostOS. Tous droits réservés.**

L'utilisation de **HostOS** est régie par une licence propriétaire stricte. Bien que le code de l'interface soit accessible pour le déploiement, il ne s'agit pas d'un logiciel libre (Open Source).

#### 🛡️ Protection de la Propriété Intellectuelle
* **Exclusivité** : IonaGroup reste l'unique détenteur des droits intellectuels sur le code source, le design et l'architecture du CMS.
* **Interdiction de Revente** : Il est strictement interdit de vendre, louer ou sous-licencier HostOS, que ce soit sous sa forme originale ou après modification.
* **Non-Redistribution** : Vous n'êtes pas autorisé à redistribuer ou partager le code source à des tiers sans un accord écrit préalable.

#### 🔑 Système de Licence & Validation
* **Modèle Freemium** : La licence d'exploitation est **gratuite pour un usage personnel et professionnel**, sous réserve d'un enregistrement valide.
* **Clé d'Activation** : Une clé de licence unique est obligatoire pour lier votre interface locale (Self-Hosted) au cœur du système (Back-end managé).

#### ☁️ Architecture Hybride & Dépendances
* **Services Managés** : Pour garantir une sécurité maximale et des mises à jour fluides, le Back-end (API Core) est exclusivement hébergé et maintenu par IonaGroup.
* **Continuité de Service** : L'utilisation de ce CMS implique l'acceptation que les fonctionnalités vitales dépendent de la connectivité avec les serveurs officiels de IonaGroup.

👉 **[Voir la démo en ligne](https://hostos.ionagroup.fr/)** | **[Demander une licence gratuite sur Discord](https://discord.gg/694D9FAE99)**
---

### 🚀 Démarrage Rapide

1. **Récupérer le projet**  
   - Téléchargez ou clonez le dossier compilé.

2. **Configurer l'application**  
   - Ouvrez `config.json` à la racine du projet pour personnaliser :  
     - `appName` : Nom de l'application  
     - `appDescription` : Description de l'application
     - `apiUrl` : URL de l'API backend (fournie avec votre licence)
     - `license_key` : Votre clé de licence (obligatoire)
     - `site_url` : URL de votre site (obligatoire)
     - `allowAdminRegister` : Autoriser l'inscription admin (`1` pour activer, `0` pour désactiver)
     - `faviconUrl` : URL du favicon
     - `discordUrl` : Lien Discord  
     - `version` : Version de l'application (ne pas modifier)  
   - Exemple de `config.json` configuré :  
     ```json
     {
       "appName": "Mon HostOS",
       "appDescription": "HostOS Application - A CMS for Hosts",
       "apiUrl": "https://hostosapi.ionagroup.fr",
       "license_key": "votre_cle_de_licence",
       "site_url": "https://votre-site.com",
       "allowAdminRegister": 0,
       "faviconUrl": "https://ionagroup.fr/img/logo/logov1.png",
       "discordUrl": "https://discord.gg/694D9FAE99",
       "version": "V2.1.1"
     }
     ```
   - 💡 **Note** : Pour désactiver l'inscription admin et sécuriser votre installation, mettez `allowAdminRegister` à `0`.

3. **Lancer l'application**  
   - Ouvrez simplement `index.html` avec un serveur web.
   - Pour un test rapide en local, vous pouvez utiliser :  
     ```bash
     npx serve .
     ```
   - L'application sera accessible sur `http://localhost:3000` (ou le port indiqué)

4. **Déployer en production**  
   - Déployez tous les fichiers sur votre serveur web (Apache, Nginx, etc.)
   - Assurez-vous que `config.json` contient vos vraies valeurs (`license_key`, `site_url`, `apiUrl`)
   - Configurez votre serveur pour servir `index.html` pour toutes les routes (SPA)

4.1 **Déployer sur Nestlify**  
   - Assurez-vous que `config.json` contient vos vraies valeurs (`license_key`, `site_url`, `apiUrl`)
   - Importez le code sur Nestlify, tout se fera automatiquement

5. **C'est prêt !**  
   - L'application chargera automatiquement les paramètres depuis `config.json`.  
   - Toute modification de ce fichier sera prise en compte **sans recompiler**.
   - Rafraîchissez simplement la page dans votre navigateur pour voir les changements.
