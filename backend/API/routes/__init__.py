# routes/__init__.py

# Import des blueprints depuis chaque fichier de route
from .users_auth import login_bp
from .users_register import register_bp
from .users_auth import logout_bp
from .users_register import admin_register_bp
from .admin_login import admin_login_bp
from .users_lists import customers_list_bp
from .users_lists import staff_list_bp
from .users_delete import admin_delete_bp
from .users_edit import admin_edit_bp
from .users_edit import customer_edit_bp
from .users_infos import users_infos_bp
from .users_infos import admin_infos_bp
from .manage_products import products_bp
from .manage_orders import orders_bp
from .users_dashboard import client_dashboard_bp
# Si tu ajoutes d'autres routes plus tard, importe-les ici
# from .users import users_bp
# from .create import create_bp

def register_routes(app):
    """
    Enregistre tous les blueprints dans l'application Flask
    """
    app.register_blueprint(login_bp, url_prefix="/auth")
    app.register_blueprint(register_bp, url_prefix="/auth")
    app.register_blueprint(logout_bp, url_prefix="/auth")
    app.register_blueprint(admin_register_bp, url_prefix="/auth")
    app.register_blueprint(admin_login_bp, url_prefix="/auth")
    app.register_blueprint(customers_list_bp, url_prefix="/admin")
    app.register_blueprint(staff_list_bp, url_prefix="/admin")
    app.register_blueprint(admin_delete_bp, url_prefix="/admin")
    app.register_blueprint(admin_edit_bp, url_prefix="/admin")
    app.register_blueprint(customer_edit_bp, url_prefix="/admin")
    app.register_blueprint(users_infos_bp, url_prefix="/customers")
    app.register_blueprint(admin_infos_bp, url_prefix="/admin")
    app.register_blueprint(products_bp, url_prefix="/products")
    app.register_blueprint(orders_bp, url_prefix="/orders")
    app.register_blueprint(client_dashboard_bp, url_prefix="/me")
    # Pour chaque nouveau blueprint, ajoute une ligne ici
    # app.register_blueprint(users_bp, url_prefix="/users")
