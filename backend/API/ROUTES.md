# Documentation des Routes API

Ce document liste toutes les routes de l'API avec leurs entrées et sorties.

---

## 🔐 Authentification (`/auth`)

### POST `/auth/login`
**Description:** Connexion d'un client

**Entrées (JSON):**
- `Email` (string, requis): Email du client
- `Password` (string, requis): Mot de passe du client

**Sorties:**
- **200 OK:**
  ```json
  {
    "access_token": "string",
    "user": {
      "id": int,
      "firstName": "string",
      "lastName": "string"
    }
  }
  ```
- **400 Bad Request:** `{"error": "Veuillez remplir tous les champs"}`
- **401 Unauthorized:** `{"error": "Identifiants invalides"}`

**Authentification requise:** Non

---

### POST `/auth/logout`
**Description:** Déconnexion d'un utilisateur

**Entrées:** Aucune (token JWT dans le header)

**Sorties:**
- **200 OK:** `{"msg": "Déconnexion réussie"}`

**Authentification requise:** Oui (JWT)

---

### POST `/auth/register`
**Description:** Inscription d'un nouveau client

**Entrées (JSON):**
- `FirstName` (string, requis, 1-50 caractères): Prénom
- `LastName` (string, requis, 1-50 caractères): Nom
- `Email` (string, requis, 1-100 caractères): Email
- `PhoneNumber` (string, requis, 10-15 caractères): Numéro de téléphone
- `Password` (string, requis, 8-100 caractères): Mot de passe

**Sorties:**
- **200 OK:** `{"msg": "Utilisateur créé avec succès !"}`
- **400 Bad Request:** `{"error": "Veuillez remplir tous les champs"}` ou `{"error": "Longueur des champs invalide"}`
- **409 Conflict:** `{"error": "Utilisateur déjà existant"}`

**Authentification requise:** Non

---

### POST `/auth/admin/login`
**Description:** Connexion d'un administrateur

**Entrées (JSON):**
- `Email` (string, requis): Email de l'admin
- `Password` (string, requis): Mot de passe de l'admin

**Sorties:**
- **200 OK:**
  ```json
  {
    "access_token": "string",
    "user": {
      "id": int,
      "firstName": "string",
      "RoleID": 1
    }
  }
  ```
- **400 Bad Request:** `{"error": "Veuillez remplir tous les champs"}`
- **401 Unauthorized:** `{"error": "Identifiants invalides"}`
- **500 Internal Server Error:** `{"error": "Erreur lors de la vérification du compte"}`

**Authentification requise:** Non

---

### POST `/auth/admin/register`
**Description:** Inscription d'un nouvel administrateur

**Entrées (JSON):**
- `FirstName` (string, requis, 1-50 caractères): Prénom
- `LastName` (string, requis, 1-50 caractères): Nom
- `Email` (string, requis, 1-100 caractères): Email
- `Password` (string, requis, 8-100 caractères): Mot de passe

**Sorties:**
- **200 OK:** `{"msg": "Utilisateur créé avec succès !"}`
- **400 Bad Request:** `{"error": "Veuillez remplir tous les champs"}` ou `{"error": "Longueur des champs invalide"}`
- **409 Conflict:** `{"error": "Utilisateur déjà existant"}`

**Authentification requise:** Non

---

## 👥 Administration (`/admin`)

### GET `/admin/customers/list`
**Description:** Liste tous les clients (admin uniquement)

**Entrées:** Aucune (token JWT dans le header)

**Sorties:**
- **200 OK:**
  ```json
  [
    {
      "ID": int,
      "FirstName": "string",
      "LastName": "string",
      "Email": "string",
      "PhoneNumber": "string",
      "CreatedAt": "YYYY-MM-DD HH:MM:SS"
    }
  ]
  ```
- **403 Forbidden:** `{"error": "Accès réservé aux administrateurs"}`

**Authentification requise:** Oui (JWT - Admin)

---

### GET `/admin/admins/list`
**Description:** Liste tous les membres du staff (admin uniquement)

**Entrées:** Aucune (token JWT dans le header)

**Sorties:**
- **200 OK:**
  ```json
  [
    {
      "ID": int,
      "FirstName": "string",
      "LastName": "string",
      "Email": "string",
      "RoleID": int,
      "CreatedAt": "YYYY-MM-DD HH:MM:SS"
    }
  ]
  ```
- **403 Forbidden:** `{"error": "Accès réservé aux administrateurs"}`

**Authentification requise:** Oui (JWT - Admin)

---

### DELETE `/admin/staff/<staff_id>`
**Description:** Supprime un membre du staff (admin uniquement)

**Entrées:**
- `staff_id` (int, dans l'URL): ID du membre du staff à supprimer

**Sorties:**
- **200 OK:** `{"msg": "Membre du staff supprimé avec succès !"}`
- **400 Bad Request:** `{"error": "Action impossible : vous ne pouvez pas supprimer votre propre compte."}`
- **403 Forbidden:** `{"error": "Accès refusé. Administrateurs uniquement."}`
- **404 Not Found:** `{"error": "Membre du staff non trouvé"}`

**Authentification requise:** Oui (JWT - Admin)

---

### DELETE `/admin/customer/<customer_id>`
**Description:** Supprime un client (admin uniquement)

**Entrées:**
- `customer_id` (int, dans l'URL): ID du client à supprimer

**Sorties:**
- **200 OK:** `{"msg": "Client et ses services associés supprimés !"}`
- **403 Forbidden:** `{"error": "Accès refusé. Administrateurs uniquement."}`
- **404 Not Found:** `{"error": "Client non trouvé"}`

**Authentification requise:** Oui (JWT - Admin)

---

### PATCH `/admin/staff/edit/<id>`
**Description:** Modifie les informations d'un membre du staff (admin uniquement)

**Entrées:**
- `id` (int, dans l'URL): ID du membre du staff
- **JSON (tous optionnels):**
  - `FirstName` (string): Prénom
  - `LastName` (string): Nom
  - `Email` (string): Email
  - `RoleID` (int): ID du rôle
  - `Password` (string): Nouveau mot de passe

**Sorties:**
- **200 OK:** `{"msg": "Staff modifié avec succès !"}`
- **400 Bad Request:** `{"msg": "Aucune donnée à modifier"}`
- **403 Forbidden:** `{"error": "Admin uniquement"}`

**Authentification requise:** Oui (JWT - Admin)

---

### PATCH `/admin/customer/edit/<id>`
**Description:** Modifie les informations d'un client (admin ou propriétaire)

**Entrées:**
- `id` (int, dans l'URL): ID du client
- **JSON (tous optionnels):**
  - `FirstName` (string): Prénom
  - `LastName` (string): Nom
  - `Email` (string): Email
  - `PhoneNumber` (string): Numéro de téléphone
  - `Password` (string): Nouveau mot de passe

**Sorties:**
- **200 OK:** `{"msg": "Client modifié avec succès !"}`
- **400 Bad Request:** `{"msg": "Aucune donnée à modifier"}`
- **403 Forbidden:** `{"error": "Non autorisé à modifier ce profil"}`

**Authentification requise:** Oui (JWT - Admin ou propriétaire)

---

### GET `/admin/staff/infos/<id>`
**Description:** Récupère les informations détaillées d'un membre du staff (admin uniquement)

**Entrées:**
- `id` (int, dans l'URL): ID du membre du staff

**Sorties:**
- **200 OK:**
  ```json
  {
    "ID": int,
    "FirstName": "string",
    "LastName": "string",
    "Email": "string",
    "RoleID": int,
    "RoleName": "string",
    "CreatedAt": "YYYY-MM-DD HH:MM:SS"
  }
  ```
- **403 Forbidden:** `{"error": "Accès réservé aux administrateurs"}`
- **404 Not Found:** `{"error": "Membre du staff non trouvé"}`

**Authentification requise:** Oui (JWT - Admin)

---

## 👤 Clients (`/customers`)

### GET `/customers/customer/infos/<id>`
**Description:** Récupère les informations d'un client (admin ou propriétaire)

**Entrées:**
- `id` (int, dans l'URL): ID du client

**Sorties:**
- **200 OK:**
  ```json
  {
    "ID": int,
    "FirstName": "string",
    "LastName": "string",
    "Email": "string",
    "PhoneNumber": "string",
    "CreatedAt": "YYYY-MM-DD HH:MM:SS"
  }
  ```
- **403 Forbidden:** `{"error": "Accès non autorisé"}`
- **404 Not Found:** `{"error": "Client non trouvé"}`

**Authentification requise:** Oui (JWT - Admin ou propriétaire)

---

## 📦 Produits (`/products`)

### POST `/products/admin/create`
**Description:** Crée un nouveau produit (admin uniquement)

**Entrées (JSON):**
- `ProductName` (string, requis): Nom du produit
- `Description` (string, optionnel): Description du produit
- `Price` (float, requis, >= 0): Prix du produit
- `StockQuantity` (int, optionnel, défaut: 0, >= 0): Quantité en stock

**Sorties:**
- **201 Created:** `{"msg": "Produit ajouté au catalogue !"}`
- **400 Bad Request:** `{"error": "Nom et Prix sont obligatoires"}` ou `{"error": "Le Prix et la Quantité doivent être positifs"}`
- **403 Forbidden:** `{"error": "Accès réservé aux administrateurs"}`

**Authentification requise:** Oui (JWT - Admin)

---

### PATCH `/products/admin/edit/<id>`
**Description:** Modifie un produit existant (admin uniquement)

**Entrées:**
- `id` (int, dans l'URL): ID du produit
- **JSON (tous optionnels):**
  - `ProductName` (string): Nom du produit
  - `Description` (string): Description du produit
  - `Price` (float, >= 0): Prix du produit
  - `StockQuantity` (int, >= 0): Quantité en stock

**Sorties:**
- **200 OK:** `{"msg": "Produit mis à jour !"}`
- **400 Bad Request:** `{"msg": "Rien à modifier"}` ou `{"error": "Valeurs négatives interdites"}`
- **403 Forbidden:** `{"error": "Admin uniquement"}`

**Authentification requise:** Oui (JWT - Admin)

---

### DELETE `/products/admin/delete/<id>`
**Description:** Supprime un produit (admin uniquement)

**Entrées:**
- `id` (int, dans l'URL): ID du produit à supprimer

**Sorties:**
- **200 OK:** `{"msg": "Produit supprimé avec succès !"}`
- **400 Bad Request:** `{"error": "Impossible de supprimer : ce produit est lié à des commandes."}`
- **403 Forbidden:** `{"error": "Accès réservé aux administrateurs"}`
- **404 Not Found:** `{"error": "Produit non trouvé"}`

**Authentification requise:** Oui (JWT - Admin)

---

### GET `/products/list`
**Description:** Liste tous les produits disponibles

**Entrées:** Aucune (token JWT dans le header)

**Sorties:**
- **200 OK:**
  ```json
  [
    {
      "ID": int,
      "ProductName": "string",
      "Description": "string",
      "Price": float,
      "StockQuantity": int
    }
  ]
  ```

**Authentification requise:** Oui (JWT)

---

## 🛒 Commandes (`/orders`)

### POST `/orders/create`
**Description:** Crée une nouvelle commande (client ou admin)

**Entrées (JSON):**
- `ProductID` (int, requis): ID du produit à commander
- `CustomerID` (int, optionnel): ID du client (uniquement pour les admins, sinon utilise l'ID du token)

**Sorties:**
- **201 Created:** `{"msg": "Commande enregistrée."}`
- **400 Bad Request:** `{"error": "ProductID manquant"}`
- **404 Not Found:** `{"error": "Le client ID {customer_id} n'existe pas"}` ou `{"error": "Produit non trouvé"}`

**Authentification requise:** Oui (JWT)

---

### GET `/orders/list`
**Description:** Liste toutes les commandes (admin uniquement)

**Entrées:** Aucune (token JWT dans le header)

**Sorties:**
- **200 OK:**
  ```json
  [
    {
      "ID": int,
      "Status": "string",
      "TotalAmount": float,
      "OrderDate": "YYYY-MM-DD HH:MM:SS",
      "CustomerEmail": "string",
      "ProductName": "string"
    }
  ]
  ```
- **403 Forbidden:** `{"error": "Accès interdit"}`

**Authentification requise:** Oui (JWT - Admin)

---

### POST `/orders/validate/<order_id>`
**Description:** Valide et active un service pour une commande (admin uniquement)

**Entrées:**
- `order_id` (int, dans l'URL): ID de la commande
- **JSON:**
  - `Status` (string, requis): Nouveau statut ('Delivered' ou 'Cancelled')

**Sorties:**
- **200 OK:** `{"msg": "Statut mis à jour : {new_status}"}`
- **403 Forbidden:** `{"error": "Accès interdit"}`
- **404 Not Found:** `{"error": "Commande introuvable"}`
- **500 Internal Server Error:** `{"error": "string"}`

**Authentification requise:** Oui (JWT - Admin)

---

### GET `/orders/list/pending`
**Description:** Liste toutes les commandes en attente (admin uniquement)

**Entrées:** Aucune (token JWT dans le header)

**Sorties:**
- **200 OK:**
  ```json
  [
    {
      "ID": int,
      "Status": "Pending",
      "TotalAmount": float,
      "OrderDate": "YYYY-MM-DD HH:MM:SS",
      "CustomerEmail": "string",
      "ProductName": "string"
    }
  ]
  ```
- **403 Forbidden:** `{"error": "Accès interdit"}`

**Authentification requise:** Oui (JWT - Admin)

---

### GET `/orders/list/actual`
**Description:** Liste tous les services actifs (instances réelles) (admin uniquement)

**Entrées:** Aucune (token JWT dans le header)

**Sorties:**
- **200 OK:**
  ```json
  [
    {
      "ID": int,
      "Status": "string",
      "RecurentPrice": float,
      "StartedAt": "YYYY-MM-DD HH:MM:SS",
      "EndedAt": "YYYY-MM-DD HH:MM:SS",
      "CustomerEmail": "string",
      "ProductName": "string",
      "CustomerID": int,
      "ProductID": int
    }
  ]
  ```
- **403 Forbidden:** `{"error": "Accès interdit"}`

**Authentification requise:** Oui (JWT - Admin)

---

### PATCH `/orders/actual/edit/<service_id>`
**Description:** Modifie ou suspend un service actif (admin uniquement)

**Entrées:**
- `service_id` (int, dans l'URL): ID du service
- **JSON (tous optionnels):**
  - `Status` (string): Nouveau statut
  - `RecurentPrice` (float): Nouveau prix récurrent
  - `EndedAt` (string): Nouvelle date de fin

**Sorties:**
- **200 OK:** `{"msg": "Mis à jour"}`
- **400 Bad Request:** `{"error": "Rien à modifier"}`
- **403 Forbidden:** `{"error": "Interdit"}`

**Authentification requise:** Oui (JWT - Admin)

---

### DELETE `/orders/actual/terminate/<service_id>`
**Description:** Termine et supprime un service actif (admin uniquement)

**Entrées:**
- `service_id` (int, dans l'URL): ID du service à terminer

**Sorties:**
- **200 OK:** `{"msg": "Service terminé et archivé"}`
- **403 Forbidden:** `{"error": "Interdit"}`
- **404 Not Found:** `{"error": "Service non trouvé"}`

**Authentification requise:** Oui (JWT - Admin)

---

## 📊 Dashboard Client (`/me`)

### GET `/me/stats`
**Description:** Récupère les statistiques du dashboard client

**Entrées:** Aucune (token JWT dans le header)

**Sorties:**
- **200 OK:**
  ```json
  {
    "active_services": int,
    "pending_orders": int,
    "total_spent": float
  }
  ```

**Authentification requise:** Oui (JWT)

---

### GET `/me/my-services`
**Description:** Liste tous les services actifs du client

**Entrées:** Aucune (token JWT dans le header)

**Sorties:**
- **200 OK:**
  ```json
  [
    {
      "ServiceID": int,
      "StartedAt": "YYYY-MM-DD HH:MM:SS",
      "EndedAt": "YYYY-MM-DD HH:MM:SS",
      "ProductName": "string",
      "Description": "string",
      "Price": float,
      "DaysRemaining": int,
      "Status": "Active" | "Expired"
    }
  ]
  ```

**Authentification requise:** Oui (JWT)

---

### GET `/me/my-orders`
**Description:** Liste l'historique des commandes du client

**Entrées:** Aucune (token JWT dans le header)

**Sorties:**
- **200 OK:**
  ```json
  [
    {
      "ID": int,
      "Status": "string",
      "TotalAmount": float,
      "CreatedAt": "YYYY-MM-DD HH:MM:SS",
      "ProductName": "string"
    }
  ]
  ```

**Authentification requise:** Oui (JWT)

---

## Notes importantes

- **Authentification JWT:** La plupart des routes nécessitent un token JWT dans le header `Authorization: Bearer <token>`
- **Codes de statut HTTP:** Les réponses suivent les conventions REST standard
- **Format des dates:** Les dates sont retournées au format `YYYY-MM-DD HH:MM:SS`
- **Permissions:** Certaines routes sont réservées aux administrateurs (vérification via la table `staff`)

