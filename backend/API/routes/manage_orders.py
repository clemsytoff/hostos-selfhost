from flask import Blueprint, request, jsonify
import pymysql
from config import Config
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta

orders_bp = Blueprint("orders", __name__)

def get_connection():
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

# --- ROUTE : CRÉER UNE COMMANDE (CLIENT OU ADMIN) ---
@orders_bp.route("/create", methods=["POST"])
@jwt_required()
def create_order():
    user_id_from_token = int(get_jwt_identity())
    data = request.json
    
    product_id = data.get("ProductID")
    customer_id = data.get("CustomerID")
    
    # Sécurité : Seul un admin peut commander pour quelqu'un d'autre
    if not is_admin(user_id_from_token) or not customer_id:
        customer_id = user_id_from_token

    if not product_id:
        return jsonify({"error": "ProductID manquant"}), 400

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            # Vérification de l'existence du client (évite l'erreur 1452)
            cursor.execute("SELECT ID FROM Customers WHERE ID = %s", (customer_id,))
            if not cursor.fetchone():
                return jsonify({"error": f"Le client ID {customer_id} n'existe pas"}), 404

            # Récupération du prix
            cursor.execute("SELECT Price FROM Products WHERE ID=%s", (product_id,))
            product = cursor.fetchone()
            if not product:
                return jsonify({"error": "Produit non trouvé"}), 404

            sql = """
                INSERT INTO Orders (CustomerID, ProductID, Status, TotalAmount) 
                VALUES (%s, %s, 'Pending', %s)
            """
            cursor.execute(sql, (customer_id, product_id, product['Price']))
            conn.commit()
            return jsonify({"msg": "Commande enregistrée."}), 201
    finally:
        conn.close()

# --- ROUTE : LISTER TOUTES LES COMMANDES (HISTORIQUE GLOBAL) ---
@orders_bp.route("/list", methods=["GET"])
@jwt_required()
def list_all_orders():
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({"error": "Accès interdit"}), 403

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT o.ID, o.Status, o.TotalAmount, o.OrderDate, 
                       c.Email as CustomerEmail, p.ProductName
                FROM Orders o
                JOIN Customers c ON o.CustomerID = c.ID
                JOIN Products p ON o.ProductID = p.ID
                ORDER BY o.OrderDate DESC
            """
            cursor.execute(sql)
            orders = cursor.fetchall()
            
            for o in orders:
                if o['OrderDate']:
                    o['OrderDate'] = o['OrderDate'].strftime('%Y-%m-%d %H:%M:%S')
                o['TotalAmount'] = float(o['TotalAmount'])
                
            return jsonify(orders), 200
    finally:
        conn.close()

# --- ROUTE : VALIDER ET ACTIVER LE SERVICE ---
@orders_bp.route("/validate/<int:order_id>", methods=["POST"])
@jwt_required()
def validate_order(order_id):
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({"error": "Accès interdit"}), 403

    data = request.json
    new_status = data.get("Status") # 'Delivered' ou 'Cancelled'

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT o.CustomerID, o.ProductID, p.Price 
                FROM Orders o 
                JOIN Products p ON o.ProductID = p.ID 
                WHERE o.ID=%s
            """, (order_id,))
            order = cursor.fetchone()

            if not order:
                return jsonify({"error": "Commande introuvable"}), 404

            # 1. Mise à jour Orders
            cursor.execute("UPDATE Orders SET Status=%s WHERE ID=%s", (new_status, order_id))

            # 2. Si livré, on crée l'instance réelle
            if new_status == "Delivered":
                started_at = datetime.now()
                ended_at = started_at + timedelta(days=30)

                sql_actual = """
                    INSERT INTO ActualOrders (CustomerID, ProductID, Status, RecurentPrice, StartedAt, EndedAt)
                    VALUES (%s, %s, 'Delivered', %s, %s, %s)
                """
                cursor.execute(sql_actual, (
                    order['CustomerID'], order['ProductID'], 
                    float(order['Price']), started_at, ended_at
                ))

            conn.commit()
            return jsonify({"msg": f"Statut mis à jour : {new_status}"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# --- ROUTE : COMMANDES EN ATTENTE ---
@orders_bp.route("/list/pending", methods=["GET"])
@jwt_required()
def list_pending_orders():
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({"error": "Accès interdit"}), 403

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT o.ID, o.Status, o.TotalAmount, o.OrderDate, 
                       c.Email as CustomerEmail, p.ProductName
                FROM Orders o
                JOIN Customers c ON o.CustomerID = c.ID
                JOIN Products p ON o.ProductID = p.ID
                WHERE o.Status = 'Pending'
                ORDER BY o.OrderDate ASC
            """
            cursor.execute(sql)
            orders = cursor.fetchall()
            for o in orders:
                if o['OrderDate']: o['OrderDate'] = o['OrderDate'].strftime('%Y-%m-%d %H:%M:%S')
                o['TotalAmount'] = float(o['TotalAmount'])
            return jsonify(orders), 200
    finally:
        conn.close()

# --- ROUTE : SERVICES ACTIFS (INSTANCES RÉELLES) ---
@orders_bp.route("/list/actual", methods=["GET"])
@jwt_required()
def list_actual_services():
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({"error": "Accès interdit"}), 403

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT ao.ID, ao.Status, ao.RecurentPrice, ao.StartedAt, ao.EndedAt, 
                       c.Email as CustomerEmail, p.ProductName, ao.CustomerID, ao.ProductID
                FROM ActualOrders ao
                JOIN Customers c ON ao.CustomerID = c.ID
                JOIN Products p ON ao.ProductID = p.ID
                ORDER BY ao.EndedAt ASC
            """
            cursor.execute(sql)
            services = cursor.fetchall()
            for s in services:
                s['RecurentPrice'] = float(s['RecurentPrice'])
                if s['StartedAt']: s['StartedAt'] = s['StartedAt'].strftime('%Y-%m-%d %H:%M:%S')
                if s['EndedAt']: s['EndedAt'] = s['EndedAt'].strftime('%Y-%m-%d %H:%M:%S')
            return jsonify(services), 200
    finally:
        conn.close()

# --- ROUTE : MODIFIER / SUSPENDRE ---
@orders_bp.route("/actual/edit/<int:service_id>", methods=["PATCH"])
@jwt_required()
def edit_actual_service(service_id):
    user_id = int(get_jwt_identity())
    if not is_admin(user_id): return jsonify({"error": "Interdit"}), 403

    data = request.json
    updates = []
    params = []
    
    for key in ['Status', 'RecurentPrice', 'EndedAt']:
        if key in data:
            updates.append(f"{key} = %s")
            params.append(data[key])

    if not updates: return jsonify({"error": "Rien à modifier"}), 400

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            params.append(service_id)
            sql = f"UPDATE ActualOrders SET {', '.join(updates)} WHERE ID = %s"
            cursor.execute(sql, tuple(params))
            conn.commit()
            return jsonify({"msg": "Mis à jour"}), 200
    finally:
        conn.close()

# --- ROUTE : SUPPRIMER / TERMINER UN SERVICE ---
@orders_bp.route("/actual/terminate/<int:service_id>", methods=["DELETE"])
@jwt_required()
def terminate_service(service_id):
    user_id = int(get_jwt_identity())
    if not is_admin(user_id): return jsonify({"error": "Interdit"}), 403

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            # Récupérer infos pour archiver
            cursor.execute("SELECT CustomerID, ProductID FROM ActualOrders WHERE ID = %s", (service_id,))
            service = cursor.fetchone()
            if not service: return jsonify({"error": "Service non trouvé"}), 404

            # 1. Supprimer l'instance
            cursor.execute("DELETE FROM ActualOrders WHERE ID = %s", (service_id,))
            
            # 2. Marquer comme Terminé dans l'historique Orders
            cursor.execute("""
                UPDATE Orders SET Status = 'Finished' 
                WHERE CustomerID = %s AND ProductID = %s AND Status = 'Delivered'
                LIMIT 1
            """, (service['CustomerID'], service['ProductID']))

            conn.commit()
            return jsonify({"msg": "Service terminé et archivé"}), 200
    finally:
        conn.close()