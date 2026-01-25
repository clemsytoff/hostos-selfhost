from flask import Blueprint, request, jsonify
import pymysql
from config import Config
from flask_jwt_extended import jwt_required, get_jwt_identity

products_bp = Blueprint("products", __name__)

def get_connection():
    """Crée une connexion MySQL"""
    return pymysql.connect(
        host=Config.DB_HOST,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )

def is_admin(user_id):
    """Vérifie si l'ID appartient à la table Staff"""
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT ID FROM Staff WHERE ID = %s", (user_id,))
            return cursor.fetchone() is not None
    finally:
        conn.close()

# --- ROUTE 1 : AJOUTER UN PRODUIT (ADMIN) ---
@products_bp.route("/admin/create", methods=["POST"])
@jwt_required()
def add_product():
    # Conversion de l'ID du token
    user_id = int(get_jwt_identity())
    
    # Vérification du rôle en base de données
    if not is_admin(user_id):
        return jsonify({"error": "Accès réservé aux administrateurs"}), 403

    data = request.json
    name = data.get("ProductName")
    description = data.get("Description")
    price = data.get("Price")
    stock = data.get("StockQuantity", 0)

    if not name or price is None:
        return jsonify({"error": "Nom et Prix sont obligatoires"}), 400
    
    if float(price) < 0 or int(stock) < 0:
        return jsonify({"error": "Le Prix et la Quantité doivent être positifs"}), 400
    
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = "INSERT INTO Products (ProductName, Description, Price, StockQuantity) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (name, description, price, stock))
            conn.commit()
    finally:
        conn.close()

    return jsonify({"msg": "Produit ajouté au catalogue !"}), 201

# --- ROUTE 2 : ÉDITER UN PRODUIT (ADMIN) ---
@products_bp.route("/admin/edit/<int:id>", methods=["PATCH"])
@jwt_required()
def edit_product(id):
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({"error": "Admin uniquement"}), 403

    data = request.json
    updates = []
    params = []

    fields = ["ProductName", "Description", "Price", "StockQuantity"]
    for field in fields:
        if field in data:
            updates.append(f"{field}=%s")
            params.append(data[field])

    if not updates:
        return jsonify({"msg": "Rien à modifier"}), 400
    
    # Validation basique des nombres
    if float(data.get("Price", 0)) < 0 or int(data.get("StockQuantity", 0)) < 0:
        return jsonify({"error": "Valeurs négatives interdites"}), 400

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            params.append(id)
            sql = f"UPDATE Products SET {', '.join(updates)} WHERE ID=%s"
            cursor.execute(sql, tuple(params))
            conn.commit()
    finally:
        conn.close()

    return jsonify({"msg": "Produit mis à jour !"})

# --- ROUTE 3 : SUPPRIMER UN PRODUIT (ADMIN) ---
@products_bp.route("/admin/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_product(id):
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({"error": "Accès réservé aux administrateurs"}), 403

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT ID FROM Products WHERE ID=%s", (id,))
            if not cursor.fetchone():
                return jsonify({"error": "Produit non trouvé"}), 404

            try:
                cursor.execute("DELETE FROM Products WHERE ID=%s", (id,))
                conn.commit()
            except pymysql.err.IntegrityError:
                return jsonify({"error": "Impossible de supprimer : ce produit est lié à des commandes."}), 400
    finally:
        conn.close()

    return jsonify({"msg": "Produit supprimé avec succès !"})

# --- ROUTE 4 : LISTER LES PRODUITS (PUBLIC/CLIENT) ---
@products_bp.route("/list", methods=["GET"])
@jwt_required()
def list_products():
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Products")
            products = cursor.fetchall()
            for p in products:
                p['Price'] = float(p['Price'])
    finally:
        conn.close()
    return jsonify(products)