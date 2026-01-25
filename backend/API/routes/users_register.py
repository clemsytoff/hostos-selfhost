from flask import Blueprint, request, jsonify
import pymysql
import bcrypt
from config import Config

register_bp = Blueprint("register", __name__)

def get_connection():
    """Crée une connexion MySQL"""
    return pymysql.connect(
        host=Config.DB_HOST,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME
    )

@register_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    FirstName = data.get("FirstName")
    LastName = data.get("LastName")
    Email = data.get("Email")
    PhoneNumber = data.get("PhoneNumber")
    Password = data.get("Password")
    
    if not FirstName or not LastName or not Email or not PhoneNumber or not Password:
        return jsonify({"error": "Veuillez remplir tous les champs"}), 400

    if not 1<=len(FirstName)<=50 or not 1<=len(LastName)<=50 or not 1<=len(Email)<=100 or not 10<=len(PhoneNumber)<=15 or not 8<=len(Password)<=100:
        return jsonify({"error": "Longueur des champs invalide"}), 400
    
    # Hash du mot de passe
    hashed_pw = bcrypt.hashpw(Password.encode('utf-8'), bcrypt.gensalt())

    conn = get_connection()
    cursor = conn.cursor()

    # Vérifie si l'utilisateur existe déjà
    cursor.execute("SELECT ID FROM Customers WHERE Email=%s", (Email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"error": "Utilisateur déjà existant"}), 409

    # Insère le nouvel utilisateur
    cursor.execute(
        "INSERT INTO Customers (FirstName, LastName, Email, PhoneNumber, PasswordHash) VALUES (%s, %s, %s, %s, %s)",
        (FirstName, LastName, Email, PhoneNumber, hashed_pw.decode('utf-8'))
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"msg": "Utilisateur créé avec succès !"})



admin_register_bp = Blueprint("admin_register", __name__)

@admin_register_bp.route("/admin/register", methods=["POST"])
def register():
    data = request.json
    FirstName = data.get("FirstName")
    LastName = data.get("LastName")
    Email = data.get("Email")
    Password = data.get("Password")

    if not FirstName or not LastName or not Email or not Password:
        return jsonify({"error": "Veuillez remplir tous les champs"}), 400

    if not 1<=len(FirstName)<=50 or not 1<=len(LastName)<=50 or not 1<=len(Email)<=100 or not 8<=len(Password)<=100:
        return jsonify({"error": "Longueur des champs invalide"}), 400
    
    # Hash du mot de passe
    hashed_pw = bcrypt.hashpw(Password.encode('utf-8'), bcrypt.gensalt())

    conn = get_connection()
    cursor = conn.cursor()

    # Vérifie si l'utilisateur existe déjà
    cursor.execute("SELECT ID FROM Staff WHERE Email=%s", (Email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"error": "Utilisateur déjà existant"}), 409

    # Insère le nouvel utilisateur
    cursor.execute(
        "INSERT INTO Staff (FirstName, LastName, Email, PasswordHash, RoleID) VALUES (%s, %s, %s, %s, %s)",
        (FirstName, LastName, Email, hashed_pw.decode('utf-8'), 2)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"msg": "Utilisateur créé avec succès !"})
