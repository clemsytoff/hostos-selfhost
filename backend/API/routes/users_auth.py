import token
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import bcrypt
import pymysql
from config import Config
from flask_jwt_extended import jwt_required, get_jwt

login_bp = Blueprint("login", __name__)

def get_connection():
    """Crée une connexion à la base MySQL"""
    return pymysql.connect(
        host=Config.DB_HOST,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME
    )

@login_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    Email = data.get("Email")
    Password = data.get("Password")

    if not Email or not Password:
        return jsonify({"error": "Veuillez remplir tous les champs"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT ID, PasswordHash, FirstName, LastName FROM Customers WHERE Email=%s", (Email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
            return jsonify({"error": "Identifiants invalides"}), 401

    # user[1] = mot de passe hashé stocké en DB
    if not bcrypt.checkpw(Password.encode('utf-8'), user[1].encode('utf-8')):
        return jsonify({"error": "Identifiants invalides"}), 401

    token = create_access_token(identity=str(user[0]))
    return jsonify({
        "access_token": token,
        "user": {
            "id": user[0],
            "firstName": user[2],
            "lastName": user[3]
        }
    })

logout_bp = Blueprint("logout", __name__)

# Ici on stocke les jti des tokens révoqués
revoked_tokens = set()

@logout_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]  # récupère l'identifiant unique du token
    revoked_tokens.add(jti)
    return jsonify({"msg": "Déconnexion réussie"})
