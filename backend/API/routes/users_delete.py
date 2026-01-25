from flask import Blueprint, jsonify
import pymysql
from config import Config
from flask_jwt_extended import jwt_required, get_jwt_identity

# On peut garder les deux ou n'en faire qu'un seul "admin_management_bp"
admin_delete_bp = Blueprint("admin_delete", __name__)

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

# --- ROUTE 1 : SUPPRIMER UN MEMBRE DU STAFF ---
@admin_delete_bp.route("/staff/<int:staff_id>", methods=["DELETE"])
@jwt_required()
def delete_staff(staff_id):
    # 1. On récupère l'ID de celui qui fait la requête
    current_admin_id = int(get_jwt_identity())
    
    # 2. On vérifie s'il est bien admin
    if not is_admin(current_admin_id):
        return jsonify({"error": "Accès refusé. Administrateurs uniquement."}), 403

    # 3. Empêcher l'admin de se supprimer lui-même
    if staff_id == current_admin_id:
        return jsonify({"error": "Action impossible : vous ne pouvez pas supprimer votre propre compte."}), 400

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT ID FROM Staff WHERE ID=%s", (staff_id,))
            if not cursor.fetchone():
                return jsonify({"error": "Membre du Staff non trouvé"}), 404

            cursor.execute("DELETE FROM Staff WHERE ID=%s", (staff_id,))
            conn.commit()
            return jsonify({"msg": "Membre du Staff supprimé avec succès !"})
    finally:
        conn.close()


# --- ROUTE 2 : SUPPRIMER UN CLIENT ---
@admin_delete_bp.route("/customer/<int:customer_id>", methods=["DELETE"])
@jwt_required()
def delete_customer(customer_id):
    # 1. On récupère l'ID de celui qui fait la requête
    current_admin_id = int(get_jwt_identity())
    
    # 2. On vérifie s'il est bien admin
    if not is_admin(current_admin_id):
        return jsonify({"error": "Accès refusé. Administrateurs uniquement."}), 403

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT ID FROM Customers WHERE ID=%s", (customer_id,))
            if not cursor.fetchone():
                return jsonify({"error": "Client non trouvé"}), 404

            # Suppression du client
            cursor.execute("DELETE FROM Customers WHERE ID=%s", (customer_id,))
            conn.commit()
            return jsonify({"msg": "Client et ses services associés supprimés !"})
    finally:
        conn.close()