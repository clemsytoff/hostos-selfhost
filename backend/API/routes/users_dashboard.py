from flask import Blueprint, jsonify
import pymysql
from config import Config
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

client_dashboard_bp = Blueprint("client_dashboard", __name__)

def get_connection():
    """Crée une connexion MySQL"""
    return pymysql.connect(
        host=Config.DB_HOST,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )

# --- ROUTE : RÉSUMÉ DU DASHBOARD (STATISTIQUES) ---
@client_dashboard_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_dashboard_stats():
    # On force la conversion en entier pour éviter les erreurs SQL/422
    customer_id = int(get_jwt_identity()) 

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            # 1. Services actifs (Statut 'Delivered' et non expiré)
            cursor.execute("""
                SELECT COUNT(*) as active_count 
                FROM ActualOrders 
                WHERE CustomerID = %s AND EndedAt > NOW()
            """, (customer_id,))
            active_services = cursor.fetchone()['active_count']

            # 2. Commandes en attente (Status 'Pending' ou 'Processing')
            cursor.execute("""
                SELECT COUNT(*) as pending_count 
                FROM Orders 
                WHERE CustomerID = %s AND Status IN ('Pending', 'Processing')
            """, (customer_id,))
            pending_orders = cursor.fetchone()['pending_count']

            # 3. Total dépensé (Uniquement les commandes livrées ou finies)
            cursor.execute("""
                SELECT SUM(TotalAmount) as total_spent 
                FROM Orders 
                WHERE CustomerID = %s AND Status IN ('Delivered', 'Finished')
            """, (customer_id,))
            total_spent = cursor.fetchone()['total_spent'] or 0

            return jsonify({
                "active_services": active_services,
                "pending_orders": pending_orders,
                "total_spent": float(total_spent)
            }), 200
    finally:
        conn.close()

# --- ROUTE : LISTE DÉTAILLÉE DES SERVICES ACTIFS ---
@client_dashboard_bp.route("/my-services", methods=["GET"])
@jwt_required()
def get_my_services():
    customer_id = int(get_jwt_identity())

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT ao.ID as ServiceID, ao.StartedAt, ao.EndedAt, 
                       p.ProductName, p.Description, p.Price
                FROM ActualOrders ao
                JOIN Products p ON ao.ProductID = p.ID
                WHERE ao.CustomerID = %s
                ORDER BY ao.EndedAt ASC
            """
            cursor.execute(sql, (customer_id,))
            services = cursor.fetchall()

            now = datetime.now()
            
            for s in services:
                # Calcul du temps restant
                remaining = s['EndedAt'] - now
                
                # Formatage propre des dates
                s['StartedAt'] = s['StartedAt'].strftime('%Y-%m-%d %H:%M:%S') if s['StartedAt'] else None
                s['EndedAt'] = s['EndedAt'].strftime('%Y-%m-%d %H:%M:%S') if s['EndedAt'] else None
                s['Price'] = float(s['Price'])
                
                # Détermination du statut dynamique
                if remaining.total_seconds() > 0:
                    s['DaysRemaining'] = remaining.days
                    s['Status'] = "Active"
                else:
                    s['DaysRemaining'] = 0
                    s['Status'] = "Expired"

            return jsonify(services), 200
    finally:
        conn.close()

# --- ROUTE : HISTORIQUE DES COMMANDES DU CLIENT ---
@client_dashboard_bp.route("/my-orders", methods=["GET"])
@jwt_required()
def get_my_orders():
    customer_id = int(get_jwt_identity())

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            # On récupère toutes les commandes peu importe l'état
            sql = """
                SELECT o.ID, o.Status, o.TotalAmount, o.OrderDate, p.ProductName
                FROM Orders o
                JOIN Products p ON o.ProductID = p.ID
                WHERE o.CustomerID = %s
                ORDER BY o.OrderDate DESC
            """
            cursor.execute(sql, (customer_id,))
            orders = cursor.fetchall()

            for o in orders:
                o['OrderDate'] = o['OrderDate'].strftime('%Y-%m-%d %H:%M:%S')
                o['TotalAmount'] = float(o['TotalAmount'])

            return jsonify(orders), 200
    finally:
        conn.close()