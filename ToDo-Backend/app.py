from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from config import Config
from bson.objectid import ObjectId  # Import ObjectId to handle MongoDB ObjectIds

app = Flask(__name__)
CORS(app, origins=["*"])
app.config.from_object(Config)

# Initialize MongoDB, Bcrypt, and JWT
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Access MongoDB collections
users_collection = mongo.db.users
todos_collection = mongo.db.todos  

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # Check if the user already exists
    if users_collection.find_one({'email': email}):
        return jsonify({'msg': 'Email already exists'}), 409

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Create the new user document
    user = {
        'name': name,
        'email': email,
        'password': hashed_password
    }
    users_collection.insert_one(user)

    return jsonify({'msg': 'Registration successful'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Find user in the database
    user = users_collection.find_one({'email': email})
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'msg': 'Invalid email or password'}), 401

    # Create a JWT access token
    access_token = create_access_token(identity=str(user['_id']))
    return jsonify({'msg': 'Login successful', 'access_token': access_token}), 200

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({'msg': 'This is a protected route'}), 200

@app.route('/add-todos', methods=['POST'])
@jwt_required()  # Add JWT requirement
def create_todo():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    status = data.get('status', 'notcompleted')

    if not title or not description:
        return jsonify({"error": "Title and description are required"}), 400

    user_id = get_jwt_identity()  # Get the logged-in user ID

    todo = {
        "title": title,
        "description": description,
        "status": status,
        "user_id": user_id  # Add the user_id to the todo
    }
    result = todos_collection.insert_one(todo)

    created_todo = todos_collection.find_one({"_id": result.inserted_id})
    created_todo["_id"] = str(created_todo["_id"])  # Convert ObjectId to string

    return jsonify(created_todo), 201

@app.route('/todos', methods=['GET'])
@jwt_required()
def get_todos():
    user_id = get_jwt_identity()  # Get the logged-in user ID
    todos = mongo.db.todos.find({"user_id": user_id})  # Filter todos by user_id
    todos_list = []
    for todo in todos:
        todo['_id'] = str(todo['_id'])
        todos_list.append(todo)
    return jsonify(todos_list), 200

@app.route('/todos/<todo_id>', methods=['DELETE'])
@jwt_required()
def delete_todo(todo_id):
    user_id = get_jwt_identity()  # Get the logged-in user ID
    result = mongo.db.todos.delete_one({"_id": ObjectId(todo_id), "user_id": user_id})
    
    if result.deleted_count == 0:
        return jsonify({"error": "Todo not found"}), 404

    return jsonify({"msg": "Todo deleted successfully"}), 200

@app.route('/todos/<todo_id>', methods=['PUT'])
@jwt_required()
def update_todo(todo_id):
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    status = data.get('status')

    if not any([title, description, status]):
        return jsonify({"error": "At least one of title, description, or status is required"}), 400

    user_id = get_jwt_identity()  # Get the logged-in user ID

    # Only include fields that are not None in the update
    updated_data = {}
    if title is not None:
        updated_data['title'] = title
    if description is not None:
        updated_data['description'] = description
    if status is not None:
        updated_data['status'] = status

    result = mongo.db.todos.update_one(
        {"_id": ObjectId(todo_id), "user_id": user_id},
        {"$set": updated_data}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Todo not found"}), 404

    return jsonify({"msg": "Todo updated successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True)
