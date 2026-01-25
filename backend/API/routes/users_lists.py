from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import pymysql
from config import Config

customers_list_bp = Blueprint("customers_list", __name__)
staff_list_bp = Blueprint("staff_list", __name__)

def get_connection():
    """Crée une connexion à la base MySQL"""
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

# --- LISTE DES CLIENTS (ADMIN SEULEMENT) ---
@customers_list_bp.route("/customers/list", methods=["GET"])
@jwt_required()
def list_customers():
    user_id = int(get_jwt_identity())
    
    # Sécurité : Seul le Staff peut voir la liste des clients
    if not is_admin(user_id):
        return jsonify({"error": "Accès réservé aux administrateurs"}), 403

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT ID, FirstName, LastName, Email, PhoneNumber, CreatedAt FROM Customers")
            customers = cursor.fetchall()
            
            # Formatage des dates pour le JSON
            for c in customers:
                if c['CreatedAt']:
                    c['CreatedAt'] = c['CreatedAt'].strftime('%Y-%m-%d %H:%M:%S')
            
            return jsonify(customers)
    finally:
        conn.close()

# --- LISTE DU STAFF (ADMIN SEULEMENT) ---
@staff_list_bp.route("/admins/list", methods=["GET"])
@jwt_required()
def list_staff():
    user_id = int(get_jwt_identity())
    
    if not is_admin(user_id):
        return jsonify({"error": "Accès réservé aux administrateurs"}), 403

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT ID, FirstName, LastName, Email, RoleID, CreatedAt FROM Staff")
            staff = cursor.fetchall()
            
            # Formatage des dates pour le JSON
            for s in staff:
                if s['CreatedAt']:
                    s['CreatedAt'] = s['CreatedAt'].strftime('%Y-%m-%d %H:%M:%S')
            
            return jsonify(staff)
    finally:
        conn.close()