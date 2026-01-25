from flask import Flask
from config import Config
from routes import register_routes
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta # Import nécessaire pour la durée

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # --- CONFIGURATION JWT ---
    # On définit la durée de vie à 24 heures (ou ce que tu veux)
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    
    # Initialisation du JWTManager
    jwt = JWTManager(app)

    # --- CONFIGURATION CORS ---
    # On autorise explicitement les headers pour éviter les blocages sur le dashboard
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    # Enregistrement des blueprints
    register_routes(app)

    return app