from flask import Blueprint, request, jsonify
import pymysql
import bcrypt
from config import Config
from flask_jwt_extended import jwt_required, get_jwt_identity

admin_edit_bp = Blueprint("admin_edit", __name__)
customer_edit_bp = Blueprint("customer_edit", __name__)

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

# --- ROUTE 1 : EDITER UN STAFF (ADMIN UNIQUEMENT) ---
@admin_edit_bp.route("/staff/edit/<int:id>", methods=["PATCH"])
@jwt_required()
def edit_staff(id):
    # Récupération et conversion de l'ID du token
    user_id_token = int(get_jwt_identity())
    
    if not is_admin(user_id_token):
        return jsonify({"error": "Admin uniquement"}), 403

    data = request.json
    updates = []
    params = []

    fields = ["FirstName", "LastName", "Email", "RoleID"]
    for field in fields:
        if field in data:
            updates.append(f"{field}=%s")
            params.append(data[field])

    if "Password" in data and data["Password"]:
        hashed = bcrypt.hashpw(data["Password"].encode('utf-8'), bcrypt.gensalt())
        updates.append("PasswordHash=%s")
        params.append(hashed.decode('utf-8'))

    if not updates:
        return jsonify({"msg": "Aucune donnée à modifier"}), 400

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            params.append(id)
            sql = f"UPDATE Staff SET {', '.join(updates)} WHERE ID=%s"
            cursor.execute(sql, tuple(params))
            conn.commit()
            return jsonify({"msg": "Staff modifié avec succès !"})
    finally:
        conn.close()

# --- ROUTE 2 : EDITER UN CLIENT (ADMIN OU SOI-MÊME) ---
@customer_edit_bp.route("/customer/edit/<int:id>", methods=["PATCH"])
@jwt_required()
def edit_customer(id):
    user_id_token = int(get_jwt_identity())
    
    # Vérification : soit c'est un admin, soit c'est le client qui modifie son propre ID
    admin_status = is_admin(user_id_token)
    if not admin_status and user_id_token != id:
        return jsonify({"error": "Non autorisé à modifier ce profil"}), 403

    data = request.json
    updates = []
    params = []

    fields = ["FirstName", "LastName", "Email", "PhoneNumber"]
    for field in fields:
        if field in data:
            updates.append(f"{field}=%s")
            params.append(data[field])

    if "Password" in data and data["Password"]:
        hashed = bcrypt.hashpw(data["Password"].encode('utf-8'), bcrypt.gensalt())
        updates.append("PasswordHash=%s")
        params.append(hashed.decode('utf-8'))

    if not updates:
        return jsonify({"msg": "Aucune donnée à modifier"}), 400

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            params.append(id)
            sql = f"UPDATE Customers SET {', '.join(updates)} WHERE ID=%s"
            cursor.execute(sql, tuple(params))
            conn.commit()
            return jsonify({"msg": "Client modifié avec succès !"})
    finally:
        conn.close()