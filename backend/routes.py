from flask import request, jsonify
from db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import Product, GeneratedDescription, User
from ai import generate_description as ai_generate_description

def register_routes(app):
    @app.route("/")
    def home():
        return "Backend is working"
    
    @app.route("/health")
    def health():
        return {"status": "ok"}

    @app.route("/products", methods=["POST"])
    def create_product():
        data = request.json

        new_product = Product(
            name=data["name"],
            price=data["price"],
            description=data.get("description", "")
        )

        db.session.add(new_product)
        db.session.commit()

        return jsonify({
            "message": "Product created",
            "product_id": new_product.id
        })

    @app.route("/products", methods=["GET"])
    def get_products():
        products = Product.query.all()

        return jsonify([
            {
                "id": p.id,
                "name": p.name,
                "price": p.price,
                "description": p.description
            }
            for p in products
        ])
    
    @app.route("/products/<int:id>", methods=["DELETE"])
    def delete_product(id):
        return jsonify({
            "message": "Deleted"
        })
    
    @app.route("/products/<int:id>", methods=["PUT"])
    def update_product(id):

        data = request.json

        return jsonify({
            "id": id,
            "name": data["name"],
            "price": data["price"],
            "description": data["description"]
        })

    @app.route("/generate-description", methods=["POST"])
    @jwt_required()
    def generate_description():

        user_id = get_jwt_identity()

        data = request.json

        product_name = data["product_name"]
        features = data["features"]

        ai_text = ai_generate_description(
            product_name,
            features
        )

        result = GeneratedDescription(
            user_id=user_id,
            product_name=product_name,
            features=features,
            text=ai_text
        )

        db.session.add(result)
        db.session.commit()

        return jsonify({
            "generated_text": ai_text
        })
    

    @app.route("/register", methods=["POST"])
    def register():
        data = request.json

        email = data["email"]
        password = data["password"]

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "User already exists"}), 400

        hashed_password = generate_password_hash(password, method="pbkdf2:sha256")

        user = User(email=email, password=hashed_password)
        db.session.add(user)
        db.session.commit()

        return jsonify({"message": "User created successfully"})
    
    @app.route("/login", methods=["POST"])
    def login():
        data = request.json

        email = data["email"]
        password = data["password"]

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        if not check_password_hash(user.password, password):
            return jsonify({"error": "Invalid password"}), 401

        token = create_access_token(identity=str(user.id))

        return jsonify({
            "token": token,
            "user_id": user.id
        })
    
    @app.route("/history", methods=["GET"])
    @jwt_required()
    def history():
        user_id = get_jwt_identity()

        descriptions = GeneratedDescription.query.filter_by(
            user_id=user_id
        ).order_by(
            GeneratedDescription.created_at.desc()
        ).all()

        return jsonify([
            {
                "id": item.id,
                "product_name": item.product_name,
                "features": item.features,
                "text": item.text,
                "created_at": item.created_at
            }
            for item in descriptions
        ])
    
    @app.route("/history/<int:id>", methods=["DELETE"])
    @jwt_required()
    def delete_history(id):

        user_id = get_jwt_identity()

        item = GeneratedDescription.query.filter_by(
            id=id,
            user_id=user_id
        ).first()

        if not item:
            return jsonify({
                "error": "Not found"
            }), 404

        db.session.delete(item)
        db.session.commit()

        return jsonify({
            "message": "Deleted"
        })
    
    @app.route("/history", methods=["DELETE"])
    @jwt_required()
    def delete_all_history():

        user_id = get_jwt_identity()

        GeneratedDescription.query.filter_by(
            user_id=user_id
        ).delete()

        db.session.commit()

        return jsonify({"message": "Deleted"})
    
    @app.route("/stats", methods=["GET"])
    @jwt_required()
    def stats():

        user_id = get_jwt_identity()

        total_generations = GeneratedDescription.query.filter_by(
            user_id=user_id
        ).count()

        total_products = db.session.query(
            GeneratedDescription.product_name
        ).filter_by(
            user_id=user_id
        ).distinct().count()

        return jsonify({
            "total_generations": total_generations,
            "total_products": total_products
        })