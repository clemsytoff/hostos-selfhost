from flask import Blueprint, jsonify
import pymysql
from config import Config
from flask_jwt_extended import jwt_required, get_jwt_identity

users_infos_bp = Blueprint("users_infos", __name__)
admin_infos_bp = Blueprint("admin_infos", __name__)

def get_connection():
    """Crée une connexion MySQL"""
    return pymysql.connect(
        host=Config.DB_HOST,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )

# --- ROUTE 1 : INFOS D'UN MEMBRE DU STAFF ---
@admin_infos_bp.route("/staff/infos/<int:id>", methods=["GET"])
@jwt_required()
def get_staff_info(id):
    current_user = get_jwt_identity()
    
    # Seul un Admin (RoleID 1) peut voir les infos du Staff
    if current_user.get('RoleID') != 1:
        return jsonify({"error": "Accès réservé aux administrateurs"}), 403

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            # Jointure pour récupérer le RoleName (Admin, Support...) au lieu d'un simple ID
            sql = """
                SELECT s.ID, s.FirstName, s.LastName, s.Email, s.RoleID, r.RoleName, s.CreatedAt 
                FROM Staff s
                JOIN Roles r ON s.RoleID = r.ID
                WHERE s.ID=%s
            """
            cursor.execute(sql, (id,))
            staff = cursor.fetchone()
            
            if not staff:
                return jsonify({"error": "Membre du Staff non trouvé"}), 404
                
            if staff['CreatedAt']:
                staff['CreatedAt'] = staff['CreatedAt'].strftime('%Y-%m-%d %H:%M:%S')
                
            return jsonify(staff)
    finally:
        conn.close()

# --- ROUTE 2 : INFOS D'UN CLIENT ---
@users_infos_bp.route("/customer/infos/<int:id>", methods=["GET"])
@jwt_required()
def get_customer_info(id):
    current_user = get_jwt_identity()
    
    # Sécurité : Admin ou propriétaire du compte
    is_admin = current_user.get('RoleID') == 1
    is_owner = current_user.get('id') == id

    if not is_admin and not is_owner:
        return jsonify({"error": "Accès non autorisé"}), 403

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = "SELECT ID, FirstName, LastName, Email, PhoneNumber, CreatedAt FROM Customers WHERE ID=%s"
            cursor.execute(sql, (id,))
            customer = cursor.fetchone()
            
            if not customer:
                return jsonify({"error": "Client non trouvé"}), 404

            if customer['CreatedAt']:
                customer['CreatedAt'] = customer['CreatedAt'].strftime('%Y-%m-%d %H:%M:%S')
                
            return jsonify(customer)
    finally:
        conn.close()