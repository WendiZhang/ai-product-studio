import os
from datetime import timedelta

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from sqlalchemy import inspect, text

from db import db

load_dotenv()


def ensure_product_ownership_column():
    columns = {column["name"] for column in inspect(db.engine).get_columns("products")}
    if "user_id" not in columns:
        db.session.execute(
            text(
                "ALTER TABLE products ADD COLUMN user_id "
                "INTEGER REFERENCES users(id)"
            )
        )
        db.session.commit()

    db.session.execute(
        text("CREATE INDEX IF NOT EXISTS ix_products_user_id ON products (user_id)")
    )
    db.session.commit()


def create_app():
    app = Flask(__name__)

    database_url = os.getenv("DATABASE_URL", "sqlite:///store.db")

    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret-change-this")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
    
    db.init_app(app)
    JWTManager(app)

    CORS(app)

    import models

    from routes import register_routes
    register_routes(app)

    with app.app_context():
        db.create_all()
        ensure_product_ownership_column()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
