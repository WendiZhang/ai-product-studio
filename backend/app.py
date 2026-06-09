from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from db import db
from flask_jwt_extended import JWTManager

def create_app():

    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///store.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "super-secret-change-this"


    db.init_app(app)

    jwt = JWTManager(app)

    CORS(app)

    import models

    from routes import register_routes
    register_routes(app)

    return app


app = create_app()

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)  